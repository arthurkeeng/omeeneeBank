'use client'
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { z } from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form } from '@/components/ui/form'
import AFormField from "@/components/AFormField"
import { authFormSchema } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/actions/user.actions"
import PlaidLink from "./PlaidLink"

const AuthForm = ({type} : {type : string}) => {
    const [loading , setLoading ] = useState(false)
    const [user , setUser] = useState(null)
    const formSchema = authFormSchema(type)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            email : "", password : ''
        }
    })
    const onSubmit = async (values : z.infer<typeof formSchema>)=>{
        setLoading(true)
        try {
            // sign up with appwrite
            // create plaid token
            if(type === "sign-up"){
              const userData = {
                firstName : values.firstName!,
                lastName : values.lastName!,
                address1 : values.address1!,
                city : values.city!,
                state : values.state!, 
                dateOfBirth : values.dateOfBirth!,
                ssn : values.ssn!, 
                postalCode : values.postalCode!,
                email : values.email!,
                password : values.password!

              }
                const newUser = await signUp(userData)
                setUser(newUser)
                
            }
            if(type === "sign-in"){

                const response = await signIn({
                email : values.email,
                password : values.password
            })
            if(response) {              
              router.push("/")
            }
            }
            
        } catch (error) {
            console.log('error occured',error);
            
        }
        finally{

            setLoading(false)
        }

    }
  return (
    <section className="auth-form">
        <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex
        items-center gap-1
        ">

            <Image src='/icons/logo.svg' width={34} height={34}
            alt="Omeenee bank" 
            />
            <h1 
            className="text-26 font-ibm-plex-serif font-bold text-black-1"
            >Omeenee</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3 ">
            <h1
            className="text-24 lg:text-36 font-semibold text-gray-900"
            >{user ? 'Link Account'  : type === 'sign-in' ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
                {user ? 'Link your account to get started' : "Please Enter your Details"}
            </p>
            </h1>
        </div>
        </header>
        {user ? (
            <div className="flex flex-col gap-4"> <PlaidLink
            user= {user} 
            variant = "primary"
            />
            </div>
        ) :  
        <>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {type === 'sign-in' ?(<>
      
    <AFormField name = "email" label="Email" placeholder="Please Enter Your Email" control={form.control}/>
    <AFormField name = "password" label="Password" placeholder="Please Enter Your Password" control={form.control}/>
      </>) : <>
      <div className="flex gap-4">

    <AFormField name = "firstName" label="First Name" placeholder="First Name" control={form.control}/>
    <AFormField name = "lastName" label="Last Name" placeholder="Last Name" control={form.control}/>
      </div>
      <div className="flex gap-4">
    <AFormField name = "postalCode" label="PostalCode" placeholder="Enter PostalCode" control={form.control}/>
    <AFormField name = "address1" label="Address" placeholder="Enter Address" control={form.control}/>
      </div>

      <div className="flex gap-4">
    <AFormField name = "state" label="State" placeholder="State Name" control={form.control}/>
    <AFormField name = "ssn" label="SSN" placeholder="Enter ssn" control={form.control}/>
      </div>
      <div className="flex gap-4">

    <AFormField name = "city" label="City" placeholder="City Name" control={form.control}/>
    <AFormField name = "dateOfBirth" label="Date Of Birth"  placeholder = "YYYY/MM/DD"control={form.control}/>
      </div>
    <AFormField name = "email" label="Email" placeholder="Enter Email" control={form.control}/>
    <AFormField name = "password" label="Password" placeholder="Enter Password" control={form.control}/>
      </>}
    <div className="flex flex-col gap-4">

        <Button 
        disabled = {loading}
        className="form-btn"
        type="submit">{
            loading ?(
                <>
                <Loader2 size={20} className="animate-spin"/>
                &nbsp; Loading...
                </>
            )
            : type ==='sign-in' ? "Sign In" : "Sign Up"
        }</Button>
    </div>
      </form>
    </Form>
    <footer className="flex justify-center gap-1">
        <p 
        className="text-14 font-normal text-gray-600"
        >{type === 'sign-in' ? "Don't have an account" : "Already have an account" }</p>
        <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"}
        className="form-link"
        >
            {type === 'sign-in' ? 'Sign Up' : "Sign In"}
        </Link>
    </footer>
    </>
    } 
    </section>
  )
}

export default AuthForm
