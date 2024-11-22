'use server'

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { parseStringify } from "@/lib/utils"
import { cookies } from "next/headers"
import { ID } from "node-appwrite"


export const signIn = async(userData : SignUpParams) =>{
  const {email , password  } = userData

    try {
      const { account } = await createAdminClient();
      const response = await account.createEmailPasswordSession(email,password)
      return parseStringify(response)
    } catch (error) {
        console.log("error", error)
    }
}
export const signUp = async(userData : SignUpParams) =>{
    const {email , password , firstName , lastName } = userData
    try {
          const { account } = await createAdminClient();

 const newUserAccount =  await account.create(ID.unique(),
    email, 
    password,
     `${firstName} ${lastName }`);
  const session = await account.createEmailPasswordSession(email, password);

  cookies().set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return parseStringify(newUserAccount)
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
    await account.deleteSession('current');
  } catch (error) {
    
  }
}
  