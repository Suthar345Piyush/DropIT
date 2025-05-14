"use client"

import  {useForm} from 'react-hook-form';
import  {useSignUp} from '@clerk/nextjs';
import  {z} from 'zod';


// zod custom schema 
import { signUpSchema } from '@/schemas/signUpSchema';
import { useState } from 'react';


export default function SignUpSchema(){
    const [verifying , setVerifying] = useState(false);

     // destructring the useSignUp hook from clerk

   const {signUp , isLoaded , setActive}  = useSignUp();


   const {
     register,
     handleSubmit,
     formState : (errors)
   }




      const  onSubmit = async() => {}

      const  handleVerificationSubmit = async () => {}


      if(verifying){
         return (
           <h1>This  is  OTP entering field</h1>
         )
      }

      return(
        <h1>Signup form with email and other fields</h1>
      )

}



