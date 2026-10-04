import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
export const auth=betterAuth({database:prismaAdapter(prisma,{provider:"mysql"}),baseURL:process.env.BETTER_AUTH_URL||"http://localhost:3000",secret:process.env.BETTER_AUTH_SECRET,emailAndPassword:{enabled:true},user:{additionalFields:{role:{type:"string",required:false,defaultValue:"member",input:false}}},session:{expiresIn:60*60*24*7,updateAge:60*60*24}});
