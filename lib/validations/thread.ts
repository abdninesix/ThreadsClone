import * as z from "zod"

export const threadValidation = z.object({
    thread: z.string().min(3, {message:'Minimum 3 characters.'}),
    accountId: z.string().min(3).max(30),
})

export const commentValidation = z.object({
    thread: z.string().min(3, {message:'Minimum 3 characters.'}),
})