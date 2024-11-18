import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

 function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  const loggedin = {firstName : "Keeng" , lastName : "Arthur"}
  return (
   <main className="flex h-screen w-full font-inter">
    <Sidebar user = {loggedin}/>
    <div className="flex size-full flex-col">
      <div className="root-layout">
        <Image src='/icons/logo.svg' width={30} height={30}
        alt="logo"
        />
      <div><MobileNav user={loggedin}/></div>
      </div>
    {children}
    </div>
   </main>
  );
}

export default RootLayout