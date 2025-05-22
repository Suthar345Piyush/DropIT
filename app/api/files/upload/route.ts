// API endpoints to upload on the image kit(through buffer , uploading the data like image,pdf etc..)

import { files } from "@/lib/db/schema";
import {auth} from "@clerk/nextjs/server";
import { eq , and } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";

// image kit important credentials 
const  imagekit = new ImageKit({
   publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
   privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
   urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});



export  async function POST(request : NextRequest){
   try {
        const  {userId} = await auth();
        if(!userId){
           return NextResponse.json({
            error : "Unauthorized"
           } , {status : 401});
        }
   }catch(error){
      
   }
}
  

