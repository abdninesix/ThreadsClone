import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {

    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');
    
    const userId = userInfo._id.toString();

    return (
    <>
    <h1 className="head-text">Create a thread</h1>
    <PostThread userId = {userId}/>
    </>
    )
}

export default Page;