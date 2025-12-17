"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

import { signUpSchema } from "@/schemas/signUpSchema";// i wrote this schema
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

function SignUpForm(){
    const [verifying,setVerifying] = useState<boolean>(false);
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false);
    const [authError,setAuthError] = useState<string | null>(null)
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [verificationError,setVerificationError] = useState<string | null>(null);
    
    const router = useRouter()
    const {signUp, isLoaded, setActive} = useSignUp();

    const{
        register, // a method to connect the input
        handleSubmit,
        formState: {errors},
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            email: "",
            password:"",
            passwordConfirmation:"",
        }
    })

    //useForm is my assistant that watches remembers valus validates them and throw errors
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if(!isLoaded) return;
        setIsSubmitting(true);
        setAuthError(null);

        try {
           await signUp.create({
                emailAddress: data.email,
                password: data.password
            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setVerifying(true)
        } catch (error: any) {
            console.error("Signup error: ",error)
            setAuthError(
                error.errors?.[0]?.message || "An error occured while sign up. Please try again"
            )
            
        } finally{
            setIsSubmitting(false);
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!isLoaded || !signUp) return;
        setIsSubmitting(true);
        setAuthError(null);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode
            })
            console.log("this is the result i get ==",result); //todo : remove this line in prod
            if(result.status == "complete"){
                await setActive({session: result.createdSessionId})
                router.push("/dashboard")
            }else{
                console.error("Verification incompelete for user", result)
                setVerificationError(
                    "Verification could not be completed"
                )
            }
        } catch (error : any) {
            setVerificationError(
                error.errors?.[0]?.message || "An error occured while verifying the code"
            )
        }finally{
            setIsSubmitting(false)
        }
    }

    if(verifying){
        return(<h1>this is an otp entering field</h1>)
    }

    return(<h1>this is the signup component</h1>     )
}

export default SignUpForm;


//z.infer is used to automatically derive TypeScript types from a 
// Zod schema so that runtime validation and compile-time types stay consistent 
// without duplication.