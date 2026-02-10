import Link from "next/link";
import { User } from "lucide-react";
import { NavigationButton } from "../ui/NavigationButton";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#272727]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/LogoSolo2.png" width={40} height={40} alt="Neon nova logo" />
          <p className="text-xl font-bold font-display tracking-wider text-white">
            NEON <span className="text-primary text-glow">NOVA</span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/catalogo"
            className="text-gray-300 hover:text-primary transition-colors text-sm font-medium">
            Catálogo
          </Link>
          <Link
            href="/calculadora"
            className="text-gray-300 hover:text-primary transition-colors text-sm font-medium">
            Calculadora
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <NavigationButton 
            href="/login" 
            className="flex items-center gap-2 rounded-full border border-gray-600 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-primary hover:text-primary hover:shadow-[0_0_15px_rgba(135,79,241,0.3)]">
            <User className="mr-2 h-4 w-4" />
            Login
          </NavigationButton>
        </div>

      </div>
    </header>
  );
}