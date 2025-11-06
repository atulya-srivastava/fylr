import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z
      .email({ message: "PLease enter a valid email" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password should be minimum of 8 characters" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm you password" }),
  })
  .refine((data) => (data.password = data.passwordConfirmation), {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }); //method,message
