'use server'

import { SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connect2DB } from "../mongoose"
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

interface Params {userId:string; username:string; name:string; bio:string; image:string; path:string;} //We passed these parameters to AccountProfile.tsx as an interface object called Params so now  it won't matter whichever order we send or recieve these to avoid errors.

export async function updateUser ({userId, username, name, bio, image, path}: Params): Promise<void> {
    connect2DB();

    try {
        await User.findOneAndUpdate(
        { id:userId },
        { username: username.toLowerCase(), name, bio, image, onboarded:true },
        { upsert:true },
        )
        if (path === '/profile/edit') {
        revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to update/create user: ${error.message}`)
    }
    
}

export async function fetchUser(userId: string){
    try {
        connect2DB();
        return await User
        .findOne({id:userId})
        //.populate({path: 'communities', model: Community})
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPost(userId: string){
    try {
        connect2DB();
        const threads = await User.findOne({id:userId})
        .populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {path: 'author', model: User, select: 'name image id'}
            }})
             return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function fetchUsers({userId, searchString="", pageNumber=1, pageSize=20, sortBy="desc"} : {userId:string; searchString?:string; pageNumber?:number; pageSize?:number; sortBy?:SortOrder;}){
    try {
        connect2DB();

        const skipAmount = (pageNumber-1) * pageSize;

        const regex = new RegExp (searchString, "i")

        const query: FilterQuery<typeof User> = { id:{$ne: userId} }

        if (searchString.trim() !== '') {
            query.$or = [
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        }

        const sortOptions = {createdAt: sortBy};

        const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        const totalUserCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUserCount > skipAmount + users.length;

        return {users, isNext};

    } catch (error:any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function getActivity(userId: string) {
    try {
        connect2DB();

        const userThreads = await Thread.find({author: userId})

        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        },[])

        const replies = await Thread.find({
            _id: {$in: childThreadIds},
            author: {$ne: userId}
        }).populate({
            path: 'author', model: User, select: 'name image _id'
        })

        return replies;

    } catch (error: any) {
        throw new Error(`Failed to fetch user activity: ${error.message}`)
    }
}