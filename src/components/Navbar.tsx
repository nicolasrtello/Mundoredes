import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-industrial-navy flex items-center justify-center rounded-sm">
            <Activity className="text-industrial-orange w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-industrial-navy">
            MUNDOREDES<span className="text-industrial-orange">.</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest text-industrial-navy/80">
          <a href="#quienes-somos" className="hover:text-industrial-orange transition-colors">Nosotros</a>
          <a href="#servicios" className="hover:text-industrial-orange transition-colors">Servicios</a>
          <a href="#estandar" className="hover:text-industrial-orange transition-colors">Estándar</a>
          <a href="#calculadora" className="hover:text-industrial-orange transition-colors">Cotizador</a>
          <a href="#clientes" className="bg-industrial-navy text-white px-4 py-2 rounded-sm hover:bg-industrial-steel transition-all">Área Clientes</a>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#servicios" onClick={() => setMobileMenuOpen(false)}>Servicios</a>
            <a href="#estandar" onClick={() => setMobileMenuOpen(false)}>Estándar</a>
            <a href="#calculadora" onClick={() => setMobileMenuOpen(false)}>Cotizador</a>
            <a href="#clientes" onClick={() => setMobileMenuOpen(false)}>Área Clientes</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;