'use server'

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { plaidClient } from "@/lib/plaid"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { ID } from "node-appwrite"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { addFundingSource, createDwollaCustomer } from "./dwollaActions"
const {
  OMEENEE_BANK_DATABASE_ID,
DATABASE_BANK_COLLECTION_ID,
DATABASE_USER_COLLECTION_ID
} = process.env
export const createBankAccount = async (
  {
    userId , 
        bankId, 
        accountId, 
        accessToken , 
        fundingSourceUrl , 
        sharableId 
  } : createBankAccountProps
) => {
  try {
     const {database }= await createAdminClient()
    const bankAccount = await database.createDocument(
      OMEENEE_BANK_DATABASE_ID , DATABASE_BANK_COLLECTION_ID ,
      ID.unique(), {userId , 
        bankId, 
        accountId, 
        accessToken , 
        fundingSourceUrl , 
        sharableId }
    )
    return parseStringify(bankAccount)
  } catch (error) {
    
  }
}
export const signIn = async(userData : signInProps) =>{
  const {email , password  } = userData

    try {
      const { account } = await createAdminClient();
      const response = await account.createEmailPasswordSession(email,password)
      return parseStringify(response)
    } catch (error) {
        console.log("error", error)
    }
}
export const signUp = async({password , ...userData} : SignUpParams) =>{
    let newUserAccount;
    try {
          const { account , database } = await createAdminClient();

 newUserAccount =  await account.create(ID.unique(),
    userData.email, 
    password,
     `${userData.firstName} ${userData.lastName }`);

     if(!newUserAccount) throw new Error("error creating user");

     const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData , type : "personal"
     });

     const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)
     const newUser = await database.createDocument(
      OMEENEE_BANK_DATABASE_ID , DATABASE_USER_COLLECTION_ID , ID.unique(), {
        ...userData , userId : newUserAccount.$id , dwollaCustomerId , 
        dwollaCustomerUrl
      }
     )
     if(!dwollaCustomerUrl) throw new Error("couldnt create dwolla customer")
  const session = await account.createEmailPasswordSession(userData.email, password);

  cookies().set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return parseStringify(newUser)
    } catch (error) {
        console.log("error", error)
    }
}

// ... your initilization functions

export async function getLoggedInUser() {
    try {
     const {account}= await createSessionClient()
     return await account.get()
     
    } catch (error) {
      return null;
    }
  }

export async function logoutAccount(){
  try {
    const {account} = await createSessionClient()
    cookies().delete('appwrite-session');
    return await account.deleteSession('current');
  } catch (error) {
    console.log(error);
  }
}

export const createLinkToken = async(user : User) =>{
  try {
    const tokenParams = {
      user : {
        client_user_id : user.$id,
        
      },
      client_name : `${user.firstName} ${user.lastName}`,
      products : ['auth'] as Products[],
      language : "en",
      country_codes : ['US'] as CountryCode[]
    }
    const res = await plaidClient.linkTokenCreate(tokenParams)
    console.log("the res is " , res);
    
    return parseStringify({
      linkToken : res.data.link_token
    })
  } catch (error) {
    console.log('something happened');
    
  }
}

export const exchangePublicToken = async ({
      publicToken  ,
      user
  } : exchangePublicTokenProps)=>{
    try {
      const res = await plaidClient.itemPublicTokenExchange({
        public_token : publicToken
      })
      const accessToken = res.data.access_token;
      const itemId = res.data.item_id;
      const accountsResponse = await plaidClient.accountsGet({
        access_token : accessToken
      })
      const accountData =accountsResponse.data.accounts[0];
      const request : ProcessorTokenCreateRequest = {
        access_token : accessToken , 
        account_id : accountData.account_id,
        processor : "dwolla" as ProcessorTokenCreateRequestProcessorEnum
      }
      const processorTokenResponse = await plaidClient.processorTokenCreate(request)
      const processorToken = processorTokenResponse.data.processor_token;

      const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId : user.dwollaCustomerId, 
        processorToken , bankName : accountData.name
      })
      // if the funding url is not created , throw error;
      if(!fundingSourceUrl)throw Error
      // if fundingSourceUrl exists, 
      await createBankAccount({
        userId : user.$id, 
        bankId : itemId, 
        accountId : accountData.account_id, 
        accessToken , 
        fundingSourceUrl , 
        sharableId : encryptId(accountData.account_id)
      })
      
      revalidatePath("/")
      return parseStringify({
        publicTokenExchange : "complete"
      })

    } catch (error) {
      console.error("an error occured")
    }
  }
  