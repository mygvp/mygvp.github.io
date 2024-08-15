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
              width={32}
              height={32}
            />
            <span className="text-lg font-medium">MyGvp</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
