import { motion } from "motion/react";
import { Settings, ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <div className="absolute inset-0 technical-grid opacity-30" />
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 bg-industrial-orange/10 text-industrial-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Settings className="w-3 h-3 animate-spin-slow" />
          15 Años de Excelencia Técnica
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-industrial-navy mb-6">
          Asegurando la<br />
          <span className="text-industrial-steel italic">continuidad operativa</span> <br />
          de su Empresa.
        </h1>
        <p className="text-lg text-industrial-steel max-w-lg mb-8 leading-relaxed">
          Infraestructura de Redes, Seguridad Electrónica y Electricidad bajo estándares de
          <span className="font-bold text-industrial-navy"> estética técnica</span> y Normativa SEC.
          <br />
          <span className="text-industrial-orange font-bold text-sm uppercase tracking-widest mt-2 block">Santiago y todo Chile</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-industrial-navy text-white px-8 py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-industrial-orange transition-all group shadow-lg shadow-industrial-navy/20">
            Solicitar Inspección Técnica Nivel 1
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border-2 border-industrial-navy text-industrial-navy px-8 py-4 rounded-sm font-bold hover:bg-industrial-navy hover:text-white transition-all">
            Ver Certificaciones
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative"
      >
        <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-8 border-white">
          <img
            src="/images/3.png"
            alt="Infraestructura Técnica"
            className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-industrial-navy to-transparent text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Proyecto Actual</p>
            <p className="text-xl font-bold">Data Center Corporativo</p>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 border-t-4 border-r-4 border-industrial-orange opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b-4 border-l-4 border-industrial-navy opacity-50" />
      </motion.div>
    </div>
  </section>
);

export default Hero;