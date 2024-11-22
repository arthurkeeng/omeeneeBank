'use client'
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"

const Sidebar = ({user} : SiderbarProps) => {
          const pathname = usePathname()
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex
        items-center gap-2
        ">

            <Image src='/icons/logo.svg' width={34} height={34}
            alt="Omeenee bank" className="size-[24] max-xl:size-14"
            />
            <h1 
            className="sidebar-logo"
            >Omeenee</h1>
        </Link>
        {sidebarLinks.map(link =>{
            const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
            return <Link 
            className={cn('sidebar-link',{
                "bg-bank-gradient" : isActive
            })}
            key={link.label} href={link.route}>
              <div className="relative size-6">
                <Image src={link.imgURL}
                alt={link.label}
                fill
                className={cn({
                  'brightness-[3] invert-0': isActive
                } )}
                />
              </div>
              <p className={cn('sidebar-label', {
                '!text-white' : isActive
              })}>{link.label}</p>
              </Link>
        })}
        User info
      </nav>
      <Footer user= {user}/>
    </section >
  )
}

export default Sidebar
