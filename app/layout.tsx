import type { Metadata } from "next";
import {Inter , IBM_Plex_Serif} from 'next/font/google';

import "./globals.css";

const inter = Inter({
  subsets : ['latin'],variable : '--font-inter',
})
const ibmPlex = IBM_Plex_Serif({
  subsets : ['latin'],variable : '--font-ibm-plex-serif',
  weight : ['400' , '700']
})

export const metadata: Metadata = {
  title: "Omeeneebanking",
  description: "Converging all banking in one app",
  icons :{
    icon :"/icons/logo.svg"
  }
};

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  


 
  
  return (
   <html lang="en">
    <body className= {`${inter.variable} ${ibmPlex.variable}`}>
      {children}
    </body>
   </html>
  );
}

export default RootLayout