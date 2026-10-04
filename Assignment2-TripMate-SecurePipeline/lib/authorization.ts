import { headers } from "next/headers"; import { auth } from "@/lib/auth";
export type AppRole="admin"|"member"|"guest";
export async function requireSession(allowedRoles?:AppRole[]){const session=await auth.api.getSession({headers:await headers()}); if(!session) throw new Error("UNAUTHENTICATED"); const role=(session.user.role||"member") as AppRole; if(allowedRoles&&!allowedRoles.includes(role)) throw new Error("FORBIDDEN"); return {session,role};}
