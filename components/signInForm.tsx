"use client"

import { signInSchema } from "@/schemas/signInSchema"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function signInForm(){

   const  router  = useRouter()
   // use sign in hook from clerk 
   const {signIn , isLoaded , setActive} = useSignIn();
   const [isSubmitting , setIsSubmitting] = useState();
   const [authError , setAuthError] = useState<string | null>(null);




    return (
       <h1>
         Return a sign in form 
       </h1>
    )
}