import Image from "next/image";

 function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 5INLZH-Q66PQYU-TQXNZ5W-IS76CA
  return (
   <main className="flex min-h-screen w-full 
   justify-between font-inter
   ">
  
    {children}
    <div className="auth-asset">
      <div>
        <Image
        src = "/icons/auth-image.svg"
        alt="Auth-image"
        width={500}
        height={500}
        />
      </div>
    </div>
   </main>
  );
}

export default AuthRootLayout