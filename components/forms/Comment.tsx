'use client'

import * as z from 'zod'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentValidation } from '@/lib/validations/thread'
import Image from 'next/image';
import { addThreadComment } from '@/lib/actions/thread.action';
//import { createThread } from '@/lib/actions/thread.action'

interface Props { threadId: string; currentUserImage: string; currentUserId: string; }

function Comment ({ threadId, currentUserImage, currentUserId }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(commentValidation),
        defaultValues: { thread: '' }
    })

    const onSubmit = async (values: z.infer<typeof commentValidation>) => {
        await addThreadComment(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        );
   
        form.reset();
      };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className='flex items-center w-full gap-3'>
                        <FormLabel>
                            <Image src={currentUserImage} alt="current user" width={48} height={48} className='rounded-full object-cover'/>
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input type='text' placeholder='Write your comment here...' className='no-focus text-light-1 outline-none' {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
                <Button type="submit" className='comment-form_btn'>Reply</Button>
            </form>
        </Form>
    )
}

export default Comment;
