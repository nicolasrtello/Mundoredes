import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Activity, 
  PhoneCall, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Menu,
  X,
  Calculator as CalcIcon,
  Camera,
  Cpu,
  Settings,
  ArrowUpRight
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "./lib/utils";

// --- Types & Schemas ---

const emergencySchema = z.object({
  rut: z.string().regex(/^\d{7,8}-[\dkK]$/, "Formato RUT inválido (ej: 12345678-9)"),
  contactName: z.string().min(3, "Nombre de contacto requerido"),
  location: z.string().min(5, "Dirección requerida"),
  type: z.enum(["Eléctrica", "Datos", "Seguridad"]),
  urgency: z.enum(["Nivel 1", "Nivel 2", "Nivel 3"]),
  description: z.string().min(10, "Describa brevemente la falla"),
  contact: z.string().min(8, "Teléfono de contacto")
});

const quoteSchema = z.object({
  points: z.number().min(1, "Mínimo 1 punto"),
  area: z.number().min(1, "Mínimo 1 m²"),
  urgency: z.enum(["Nivel 1", "Nivel 2", "Nivel 3"]),
  email: z.string().email("Email inválido")
});

const rutSchema = z.object({
  rut: z.string().regex(/^\d{7,8}-[\dkK]$/, "Formato RUT inválido (ej: 12345678-9)")
});

// --- Components ---

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
        <div className="space-y-4 pt-8">
          <div className="bg-industrial-orange p-4 text-white">
            <p className="text-2xl font-bold">100%</p>
            <p className="text-xs uppercase tracking-widest">Normativa SEC</p>
          </div>
          <img src="/images/1.png" className="rounded-sm grayscale hover:grayscale-0 transition-all" alt="Técnico 2" referrerPolicy="no-referrer" />
        </div>
      </div>
    </div>
  </section>
);

const Services = () => {
  const pillars = [
    {
      icon: <Network className="w-8 h-8" />,
      title: "Redes de Datos",
      desc: "Diseño e implementación de autopistas de información. Instalación de puntos Cat 5e, 6 y 6A, fusión de fibra óptica y WiFi gestionado para oficinas y bodegas.",
      tags: ["Certificación Fluke", "Peinado de Racks", "Fusión Fibra", "WiFi Corporativo"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Seguridad IP",
      desc: "Sistemas de videovigilancia de alta resolución con analítica. Control de acceso biométrico y mantenimiento preventivo de almacenamiento y UPS.",
      tags: ["CCTV 4K", "Biometría", "Analítica Video", "Respaldo Energía"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Electricidad Industrial",
      desc: "Ingeniería eléctrica bajo normativa SEC. Mantención de tableros, bancos de condensadores, declaraciones TE1 y proyectos de eficiencia LED.",
      tags: ["Normativa SEC", "Proyectos TE1", "Eficiencia LED", "Corrientes Débiles"]
    }
  ];
  return (
    <section id="servicios" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-industrial-orange uppercase tracking-[0.3em] mb-4">Nuestros Pilares</h2>
          <p className="text-4xl md:text-5xl font-bold text-industrial-navy">Ingeniería de Detalle en cada Conexión</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 border border-slate-100 bg-industrial-gray rounded-sm hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 bg-white flex items-center justify-center rounded-sm shadow-sm mb-6 group-hover:bg-industrial-navy group-hover:text-white transition-colors">
                {p.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
              <p className="text-industrial-steel mb-6 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-tighter bg-slate-200 px-2 py-1 rounded-sm">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectShowcase = () => {
  const projects = [
    {
      title: "Conectividad de Alto Rendimiento (Panduit/Leviton).",
      desc: "Gabinete de comunicaciones con fibra óptica y respaldo industrial en condiciones extremas.",
      img: "/images/4.png",
      tag: "Redes & Datos"
    },
    {
      title: "Seguridad Perimetral y Analítica IP.",
      desc: "Poste de vigilancia con cámaras 4K, analítica IA y enlace inalámbrico de alta capacidad.",
      img: "/images/5.png",
      tag: "Electricidad"
    },
    {
      title: "Energía Industrial y Certificación SEC.",
      desc: "Peinado y rotulación de tableros de fuerza bajo normativa SEC para planta industrial.",
      img: "/images/2.png",
      tag: "Seguridad IP"
    },
    {
      title: "Data Center & Networking",
      desc: "Organización de racks de alta densidad con cableado estructurado certificado.",
      img: "/images/6.png",
      tag: "Networking"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm font-bold text-industrial-orange uppercase tracking-[0.3em] mb-4">Proyectos Destacados</h2>
          <p className="text-4xl font-bold text-industrial-navy leading-tight">Nuestra Estética Técnica en Acción</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-sm aspect-[3/4]"
            >
              <img 
                src={p.img} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={p.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-industrial-navy via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-industrial-orange px-2 py-1 mb-3 inline-block">
                  {p.tag}
                </span>
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StandardGallery = () => (
  <section id="estandar" className="py-24 bg-industrial-navy text-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <h2 className="text-sm font-bold text-industrial-orange uppercase tracking-[0.3em] mb-4">El Estándar Mundoredes</h2>
          <p className="text-4xl md:text-6xl font-bold leading-tight">Estética Técnica: Orden que garantiza eficiencia.</p>
        </div>
        <p className="text-slate-400 max-w-xs text-sm italic">
          "Un rack ordenado no es solo estética, es facilidad de diagnóstico y reducción de tiempos de falla."
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative group">
            <img src="/images/3.png" className="w-full h-full object-cover rounded-sm border-2 border-industrial-orange" alt="Estándar Mundoredes" referrerPolicy="no-referrer" />
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-xs font-bold uppercase">Estándar Mundoredes</div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center gap-8">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-industrial-orange/20 flex items-center justify-center rounded-sm">
              <CheckCircle2 className="text-industrial-orange" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Peinado de Racks</h4>
              <p className="text-slate-400">Eliminamos el "espagueti" de cables mediante canalización vertical y horizontal con organizadores de alta densidad.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-industrial-orange/20 flex items-center justify-center rounded-sm">
              <CheckCircle2 className="text-industrial-orange" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Rotulación Normativa</h4>
              <p className="text-slate-400">Cada punto de red y cada térmico en el tablero eléctrico queda identificado según planos técnicos actualizados.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-industrial-orange/20 flex items-center justify-center rounded-sm">
              <CheckCircle2 className="text-industrial-orange" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Certificación de Enlaces</h4>
              <p className="text-slate-400">Entregamos reporte de certificación Fluke Networks para cada nodo instalado, asegurando el ancho de banda contratado.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Calculator = () => {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(quoteSchema)
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      setResult(json.estimate);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="calculadora" className="py-24 bg-industrial-gray relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="glass-panel p-12 rounded-sm shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CalcIcon className="w-32 h-32" />
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-industrial-navy mb-4">Calculadora de Presupuesto Express</h2>
            <p className="text-industrial-steel">Obtenga una estimación técnica preliminar para su proyecto de infraestructura.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel">Nº de Puntos de Red</label>
              <input 
                type="number" 
                {...register("points", { valueAsNumber: true })}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none transition-all"
                placeholder="Ej: 24"
              />
              {errors.points && <p className="text-red-500 text-xs">{errors.points.message as string}</p>}
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel">Metros Cuadrados del Recinto</label>
              <input 
                type="number" 
                {...register("area", { valueAsNumber: true })}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none transition-all"
                placeholder="Ej: 150"
              />
              {errors.area && <p className="text-red-500 text-xs">{errors.area.message as string}</p>}
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel">Nivel de Urgencia</label>
              <select 
                {...register("urgency")}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none transition-all"
              >
                <option value="Nivel 3">Nivel 3 (Estándar - 7 a 10 días)</option>
                <option value="Nivel 2">Nivel 2 (Prioritario - 3 a 5 días)</option>
                <option value="Nivel 1">Nivel 1 (Crítico - &lt; 48 horas)</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel">Correo Corporativo</label>
              <input 
                type="email" 
                {...register("email")}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none transition-all"
                placeholder="nombre@empresa.cl"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
            </div>

            <div className="md:col-span-2">
              <button 
                disabled={loading}
                className="w-full bg-industrial-orange text-white py-4 rounded-sm font-bold hover:bg-industrial-navy transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Calculando..." : "Generar Estimación Técnica"}
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 p-8 bg-industrial-navy text-white rounded-sm text-center"
              >
                <p className="text-sm font-bold uppercase tracking-widest text-industrial-orange mb-2">Inversión Estimada</p>
                <p className="text-5xl font-bold mb-4">${result.toLocaleString("es-CL")} <span className="text-lg font-normal opacity-60">+ IVA</span></p>
                <p className="text-xs opacity-60">* Este valor es referencial y está sujeto a visita técnica de factibilidad.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ClientArea = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(rutSchema)
  });

  const onSearch = async (vals: any) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await fetch(`/api/client-status/${vals.rut}`);
      const json = await resp.json();
      if (json.success) setData(json.data);
      else setError(json.message);
    } catch (e) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="clientes" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-navy text-white rounded-full mb-8">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-bold text-industrial-navy mb-4">Área de Clientes</h2>
        <p className="text-industrial-steel mb-12">Consulte el estado de sus certificaciones y próximas mantenciones preventivas.</p>

        <form onSubmit={handleSubmit(onSearch)} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-12">
          <input 
            {...register("rut")}
            className="flex-1 p-4 border border-slate-200 rounded-sm focus:border-industrial-navy outline-none"
            placeholder="Ingrese RUT Empresa (ej: 12345678-9)"
          />
          <button className="bg-industrial-navy text-white px-8 py-4 rounded-sm font-bold hover:bg-industrial-orange transition-all">
            {loading ? "Buscando..." : "Consultar"}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 text-red-600 rounded-sm border border-red-100 mb-8">
              <AlertTriangle className="inline-block mr-2 w-5 h-5" />
              {error}
            </motion.div>
          )}
          {data && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6 text-left"
            >
              <div className="p-6 border border-slate-100 bg-industrial-gray rounded-sm">
                <p className="text-xs font-bold text-industrial-steel uppercase mb-1">Cliente</p>
                <p className="text-xl font-bold">{data.client}</p>
              </div>
              <div className="p-6 border border-slate-100 bg-industrial-gray rounded-sm">
                <p className="text-xs font-bold text-industrial-steel uppercase mb-1">Estado General</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                  <p className="text-xl font-bold">{data.status}</p>
                </div>
              </div>
              <div className="p-6 border border-slate-100 bg-industrial-gray rounded-sm">
                <p className="text-xs font-bold text-industrial-steel uppercase mb-1">Próxima Mantención</p>
                <p className="text-xl font-bold">{data.nextMaintenance}</p>
              </div>
              <div className="p-6 border border-slate-100 bg-industrial-gray rounded-sm">
                <p className="text-xs font-bold text-industrial-steel uppercase mb-1">Último Proyecto</p>
                <p className="text-xl font-bold">{data.lastProject}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const EmergencyPortal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"form" | "protocol">("form");
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(emergencySchema)
  });

  const onSubmit = async (data: any) => {
    try {
      await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setIsOpen(false);
        reset();
      }, 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const protocol = [
    {
      title: "1. Disponibilidad Total (24/7/365)",
      content: [
        "Atención ininterrumpida las 24 horas del día, los 365 días del año.",
        "Nivel 1: Emergencia Crítica (Respuesta < 2 horas). Corte total de suministro, caída de Data Center o fallo total CCTV.",
        "Nivel 2: Urgencia Técnica (Respuesta < 4 horas). Fallas parciales, puntos de red específicos o pérdida de visualización."
      ]
    },
    {
      title: "2. Triaje Técnico (Evaluación Remota)",
      content: [
        "Evaluación remota inmediata para determinar el nivel de urgencia.",
        "Diagnóstico vía fotos/videos para optimización de herramientas y repuestos.",
        "Confirmación de técnico asignado, ETA y código de servicio."
      ]
    },
    {
      title: "3. Resolución en Terreno (Primer Contacto)",
      content: [
        "Cuadrillas equipadas para resolver fallas críticas en el primer contacto.",
        "Uso obligatorio de EPP completo y cumplimiento de normativa SEC.",
        "Intervención bajo Estándar Mundoredes: Prolijidad y orden garantizados."
      ]
    },
    {
      title: "4. Registro y Documentación Técnica",
      content: [
        "Registro Fotográfico: Capturar estado 'Antes' y 'Después' de la intervención.",
        "Reporte Digital: Generar bitácora técnica detallando materiales y horas hombre.",
        "Sincronización inmediata con sistemas centrales de gestión."
      ]
    },
    {
      title: "5. Cierre y Seguimiento de Calidad",
      content: [
        "Validación: Firma digital del cliente conforme con la solución técnica.",
        "Rendición: Reporte de gastos y materiales en un plazo máximo de 12 horas.",
        "Feedback: Encuesta de satisfacción para asegurar el estándar de excelencia."
      ]
    }
  ];

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setView("form"); }}
        className="fixed bottom-8 right-8 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <PhoneCall className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Emergencias 24/7
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-industrial-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl p-8 rounded-sm shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-industrial-navy">
                <X />
              </button>

              <div className="flex gap-4 mb-8 border-b border-slate-100">
                <button 
                  onClick={() => setView("form")}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all",
                    view === "form" ? "text-red-600 border-b-2 border-red-600" : "text-slate-400"
                  )}
                >
                  Reportar Falla
                </button>
                <button 
                  onClick={() => setView("protocol")}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all",
                    view === "protocol" ? "text-industrial-navy border-b-2 border-industrial-navy" : "text-slate-400"
                  )}
                >
                  Protocolo Operativo
                </button>
              </div>

              {sent ? (
                <div className="text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-industrial-navy mb-2 tracking-tighter">PROTOCOLO ACTIVADO</h3>
                  <p className="text-industrial-steel mb-8 max-w-xs mx-auto">Su reporte ha sido ingresado al sistema de despacho crítico. Un técnico senior se contactará en menos de 15 minutos.</p>
                  
                  <div className="bg-industrial-gray p-4 rounded-sm border border-slate-200 inline-block text-left">
                    <p className="text-[10px] font-bold uppercase text-industrial-steel mb-1">ID de Seguimiento</p>
                    <p className="font-mono text-lg font-bold text-industrial-navy">MR-EM-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                </div>
              ) : view === "form" ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-industrial-navy mb-1 flex items-center gap-2">
                        <AlertTriangle className="text-red-600" />
                        Portal de Emergencias Técnicas
                      </h3>
                      <p className="text-xs text-industrial-steel">Uso exclusivo para clientes B2B con contrato de soporte activo.</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em]">Estado del Sistema</p>
                      <p className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                        <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                        Operativo
                      </p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-industrial-steel">RUT Empresa</label>
                      <input {...register("rut")} className="w-full p-3 border border-slate-200 rounded-sm text-sm" placeholder="12345678-9" />
                      {errors.rut && <p className="text-[10px] text-red-500">{errors.rut.message as string}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-industrial-steel">Contacto en Terreno</label>
                      <input {...register("contactName")} className="w-full p-3 border border-slate-200 rounded-sm text-sm" placeholder="Nombre completo" />
                      {errors.contactName && <p className="text-[10px] text-red-500">{errors.contactName.message as string}</p>}
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-industrial-steel">Ubicación de la Falla</label>
                      <input {...register("location")} className="w-full p-3 border border-slate-200 rounded-sm text-sm" placeholder="Dirección exacta" />
                      {errors.location && <p className="text-[10px] text-red-500">{errors.location.message as string}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-industrial-steel">Tipo de Infraestructura</label>
                      <select {...register("type")} className="w-full p-3 border border-slate-200 rounded-sm text-sm">
                        <option value="Eléctrica">Electricidad Industrial</option>
                        <option value="Datos">Redes de Datos</option>
                        <option value="Seguridad">Seguridad Electrónica</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-industrial-steel">Nivel de Gravedad</label>
                      <select {...register("urgency")} className="w-full p-3 border border-slate-200 rounded-sm text-sm">
                        <option value="Nivel 1">Nivel 1 (Crítico - &lt; 2h)</option>
                        <option value="Nivel 2">Nivel 2 (Urgente - &lt; 4h)</option>
                        <option value="Nivel 3">Nivel 3 (Programado)</option>
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-industrial-steel">Descripción Técnica</label>
                      <textarea {...register("description")} className="w-full p-3 border border-slate-200 rounded-sm text-sm h-20" placeholder="¿Qué está ocurriendo?" />
                      {errors.description && <p className="text-[10px] text-red-500">{errors.description.message as string}</p>}
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-industrial-steel">Teléfono de Contacto</label>
                      <input {...register("contact")} className="w-full p-3 border border-slate-200 rounded-sm text-sm" placeholder="+56 9 ..." />
                      {errors.contact && <p className="text-[10px] text-red-500">{errors.contact.message as string}</p>}
                    </div>
                    <button className="md:col-span-2 bg-red-600 text-white py-4 rounded-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                      Activar Protocolo de Emergencia
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-industrial-navy mb-1">Protocolo Operativo Interno</h3>
                      <p className="text-xs text-industrial-steel uppercase tracking-widest font-bold">Doc. Ref: MR-PRO-247-V1</p>
                    </div>
                    <div className="bg-industrial-navy text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                      Confidencial
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {protocol.map((p, i) => (
                      <div key={i} className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-industrial-orange border-b border-industrial-orange/20 pb-1">{p.title}</h4>
                        <ul className="space-y-2">
                          {p.content.map((item, j) => (
                            <li key={j} className="flex gap-2 text-sm text-industrial-steel leading-relaxed">
                              <ChevronRight className="w-4 h-4 flex-shrink-0 text-industrial-orange mt-1" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="flex-1 p-4 bg-industrial-gray rounded-sm border-l-4 border-industrial-navy">
                      <p className="text-[10px] font-bold uppercase mb-1 text-industrial-steel">Escalación Directa</p>
                      <p className="text-sm font-bold text-industrial-navy">Gerencia Técnica: Roberto Tello González</p>
                      <p className="text-xs text-industrial-steel">contacto: rtello@mundoredes.cl</p>
                    </div>
                    <button className="bg-industrial-navy text-white px-6 py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-industrial-orange transition-all flex items-center justify-center gap-2">
                      <CalcIcon className="w-4 h-4" />
                      Descargar PDF
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => (
  <footer className="bg-industrial-navy text-white py-16 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-industrial-orange w-8 h-8" />
          <span className="text-3xl font-bold tracking-tighter">MUNDOREDES<span className="text-industrial-orange">.</span></span>
        </div>
        <p className="text-slate-400 max-w-md leading-relaxed mb-8">
          Expertos en infraestructura crítica con más de 15 años de trayectoria en el mercado chileno. 
          Certificados por las principales marcas y normativas vigentes.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="px-3 py-1 bg-white/5 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/10">
            Dahua Certified
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/10">
            Panduit Authorized
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/10">
            Leviton Certified
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-sm text-[10px] font-bold uppercase tracking-widest text-industrial-orange border border-industrial-orange/20">
            Sello SEC Autorizado
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest text-industrial-orange mb-6">Contacto</h4>
        <ul className="space-y-4 text-slate-400">
          <li className="flex items-center gap-2"><PhoneCall className="w-4 h-4" /> +56 2 2345 6789</li>
          <li>Santiago y todo Chile</li>
          <li>contacto@mundoredes.cl</li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest text-industrial-orange mb-6">Legal</h4>
        <ul className="space-y-4 text-slate-400">
          <li>Normativa SEC</li>
          <li>Certificación Panduit</li>
          <li>Declaraciones TE1</li>
          <li>Políticas de Privacidad</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
      © 2026 Mundoredes Infraestructura Técnica. Todos los derechos reservados.
    </div>
  </footer>
);

const WhyChooseUs = () => {
  const reasons = [
    {
      num: "01",
      title: "Experiencia Comprobada",
      desc: "15 años resolviendo problemas complejos de infraestructura en diversos sectores industriales."
    },
    {
      num: "02",
      title: "Estética Técnica",
      desc: "Creemos que un cableado ordenado es un cableado seguro, duradero y fácil de mantener."
    },
    {
      num: "03",
      title: "Enfoque B2B",
      desc: "Entendemos los tiempos, las exigencias de calidad y la continuidad operativa del mundo empresarial."
    },
    {
      num: "04",
      title: "Respuesta Inmediata",
      desc: "No somos solo un proveedor, somos su socio estratégico en emergencias críticas 24/7."
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/3 sticky top-32">
            <h2 className="text-sm font-bold text-industrial-orange uppercase tracking-[0.3em] mb-4">Diferenciación</h2>
            <p className="text-4xl font-bold text-industrial-navy leading-tight">Por qué elegir Mundoredes</p>
            <div className="mt-8 w-20 h-1 bg-industrial-orange" />
          </div>
          <div className="md:w-2/3 grid sm:grid-cols-2 gap-12">
            {reasons.map((r, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <p className="text-5xl font-bold text-industrial-gray group-hover:text-industrial-orange/20 transition-colors duration-500 mb-4">{r.num}</p>
                <h3 className="text-xl font-bold text-industrial-navy mb-3">{r.title}</h3>
                <p className="text-industrial-steel leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-industrial-orange selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <ProjectShowcase />
        <StandardGallery />
        <WhyChooseUs />
        <Calculator />
        <ClientArea />
      </main>
      <Footer />
      <EmergencyPortal />
    </div>
  );
}
