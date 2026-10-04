import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
const g=globalThis as unknown as {prisma?:PrismaClient};
const adapter=new PrismaMariaDb({host:process.env.DATABASE_HOST||"localhost",port:Number(process.env.DATABASE_PORT||3306),user:process.env.DATABASE_USER||"root",password:process.env.DATABASE_PASSWORD||"",database:process.env.DATABASE_NAME||"tripmate_assignment2",connectionLimit:5});
export const prisma=g.prisma??new PrismaClient({adapter}); if(process.env.NODE_ENV!=="production") g.prisma=prisma;
