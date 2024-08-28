import Link from "next/link";
import React from "react";
import Image from "next/image";
const Navbar = () => {
  return (
    <header className="px-4 h-14 sticky top-0 inset-x-0 w-full bg-background/40 backdrop-blur-lg  border-b border-border z-50">
      <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
        <div className="flex items-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/android-chrome-192x192.png"
              alt="Vercel Logo"
              width={35}
              height={35}
            />
            <span className="text-lg font-medium">MyGVP</span>
          </Link>
        </div>
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <ul className="flex items-center justify-center gap-8">
            <li className="hover:text-foreground/80 text-sm">
              <Link href="/about">About</Link>
            </li>
            <li className="hover:text-foreground/80 text-sm">
              <Link href="/services">Products</Link>
            </li>
            <li className="hover:text-foreground/80 text-sm">
              <Link href="/contact">Blogs</Link>
            </li>
            
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
