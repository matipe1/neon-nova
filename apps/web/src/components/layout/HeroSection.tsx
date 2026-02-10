import { Calculator, ArrowRight } from "lucide-react";
import { NavigationButton } from "../ui/NavigationButton";

export function HeroSection() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-primary-background selection:bg-primary selection:text-white">
      
      {/* Background blur with logo's colors */}
      <div className="absolute -left-[10%] top-[20%] h-125 w-125 rounded-full bg-secondary/20 blur-[120px]" />
      <div className="absolute -right-[10%] bottom-[10%] h-125 w-125 rounded-full bg-primary/20 blur-[120px]" />

      <main className="container mx-auto flex grow flex-col items-center justify-center px-6 md:flex-row md:justify-between relative z-10">

        <div className="flex max-w-xl flex-col gap-6 text-center md:text-left pt-10 md:pt-0">
          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-7xl">
            Materializa tus <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-neon-purple drop-shadow-lg">
              Ideas en 3D
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 md:text-xl leading-relaxed">
            Desde prototipos únicos hasta producción en masa. 
            Cotiza tu diseño al instante o explora nuestro catálogo de productos exclusivos.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center md:justify-start mt-4">
            <NavigationButton href="/catalogo" className="group relative w-full overflow-hidden rounded-lg bg-primary px-8 py-4 font-bold text-black transition-all hover:scale-105 sm:w-auto cursor-pointer">
                <span className="relative z-10 flex items-center justify-center gap-2">
                    Ver Catálogo <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
            </NavigationButton>

            <NavigationButton href="/calculadora" className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 bg-secondary-background px-8 py-4 font-medium text-white transition-all hover:border-foreground sm:w-auto cursor-pointer">
                <Calculator width={20} height={20} />Cotizar diseño
            </NavigationButton>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            Trusted by creators & engineers
          </div>
        </div>

      </main>
    </div>
  );
}