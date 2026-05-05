import { motion } from "motion/react";

const About = () => (
  <section id="quienes-somos" className="py-24 bg-industrial-gray relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-sm font-bold text-industrial-orange uppercase tracking-[0.3em] mb-4">Quiénes Somos</h2>
        <p className="text-4xl font-bold text-industrial-navy mb-6 leading-tight">
          + 15 Años de Trayectoria en el mercado.<br />
        </p>
        <p className="text-lg text-industrial-steel mb-6 leading-relaxed">
          Nos hemos consolidado como un referente en soluciones de infraestructura crítica.
          Nos diferenciamos por la <span className="text-industrial-navy font-bold">prolijidad técnica</span>,
          el cumplimiento estricto de la normativa de la SEC y una capacidad de respuesta inmediata para emergencias.
        </p>
        <div className="p-6 bg-white border-l-4 border-industrial-orange shadow-sm">
          <p className="text-industrial-navy font-bold italic">
            "Nuestro equipo cuenta con personal altamente calificado y certificado, enfocado en entregar trabajos de alta calidad estética y funcional."
          </p>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <img src="/images/7.png" className="rounded-sm grayscale hover:grayscale-0 transition-all" alt="Técnico 1" referrerPolicy="no-referrer" />
          <div className="bg-industrial-navy p-4 text-white">
            <p className="text-2xl font-bold text-industrial-orange">15+</p>
            <p className="text-xs uppercase tracking-widest">Años de Experiencia</p>
          </div>
        </div>
        <div className="space-y-4">
          <img src="/images/8.png" className="rounded-sm grayscale hover:grayscale-0 transition-all" alt="Técnico 2" referrerPolicy="no-referrer" />
          <div className="bg-industrial-navy p-4 text-white">
            <p className="text-2xl font-bold text-industrial-orange">500+</p>
            <p className="text-xs uppercase tracking-widest">Proyectos Completados</p>
          </div>
        </div>
        <div className="space-y-4">
          <img src="/images/9.png" className="rounded-sm grayscale hover:grayscale-0 transition-all" alt="Técnico 3" referrerPolicy="no-referrer" />
          <div className="bg-industrial-navy p-4 text-white">
            <p className="text-2xl font-bold text-industrial-orange">24/7</p>
            <p className="text-xs uppercase tracking-widest">Soporte Técnico</p>
          </div>
        </div>
        <div className="space-y-4">
          <img src="/images/10.png" className="rounded-sm grayscale hover:grayscale-0 transition-all" alt="Técnico 4" referrerPolicy="no-referrer" />
          <div className="bg-industrial-navy p-4 text-white">
            <p className="text-2xl font-bold text-industrial-orange">100%</p>
            <p className="text-xs uppercase tracking-widest">Cumplimiento SEC</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;