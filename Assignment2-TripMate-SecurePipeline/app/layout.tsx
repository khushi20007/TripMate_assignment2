import type {Metadata} from "next"; import "./globals.css";
export const metadata:Metadata={title:"TripMate – Assignment 2",description:"Prisma, Better Auth, Resend and secure endpoints"}; export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
