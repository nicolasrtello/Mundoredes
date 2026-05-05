import { useState, useEffect, FormEvent } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Calculator from "./components/Calculator";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import SimplifiedSite from "./components/SimplifiedSite";
import Inspection from "./components/Inspection";

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

const rutSchema = z.object({
  rut: z.string().regex(/^\d{7,8}-[\dkK]$/, "Formato RUT inválido")
});

// --- Main App Component ---

const App = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for stored token on app load
  useEffect(() => {
    const token = localStorage.getItem('mundoredes_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleLogin = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('mundoredes_token', token);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('mundoredes_token');
    navigate('/');
  };

  // Show simplified version for /simple route
  if (location.pathname === '/simple') {
    return <SimplifiedSite />;
  }

  // Show inspection page for /inspeccion
  if (location.pathname === '/inspeccion') {
    return <Inspection />;
  }

  // Show auth page for /auth route
  if (location.pathname === '/auth') {
    return <Auth onLogin={handleLogin} onBack={() => navigate('/')} />;
  }

  // Show dashboard for authenticated users
  if (location.pathname === '/dashboard' && authToken) {
    return <Dashboard token={authToken} onLogout={handleLogout} />;
  }

  // Show main site for all other routes
  return <MainSite onAuthClick={() => navigate('/auth')} />;
};

// --- Main Site Component ---

const MainSite = ({ onAuthClick }: { onAuthClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('img.grayscale-scroll'));
    if (!images.length) return;

    const updateFilters = () => {
      const isMobile = window.innerWidth <= 768;
      const viewportCenter = window.innerHeight / 2;

      images.forEach((img) => {
        if (!isMobile) {
            img.style.filter = "grayscale(0)";
            return;
          }

          const rect = img.getBoundingClientRect();
          const imgCenter = rect.top + rect.height / 2;
          const distance = Math.abs(imgCenter - viewportCenter);
          const maxDistance = viewportCenter * 0.9;
          const ratio = Math.max(0, Math.min(1, 1 - distance / maxDistance));
          const grayscale = 1 - ratio;
    window.addEventListener("scroll", updateFilters, { passive: true });
    window.addEventListener("resize", updateFilters);

    return () => {
      window.removeEventListener("scroll", updateFilters);
      window.removeEventListener("resize", updateFilters);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
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
            <button
              onClick={() => navigate('/simple')}
              className="text-xs bg-slate-100 text-industrial-navy px-3 py-1 rounded-sm hover:bg-industrial-orange hover:text-white transition-all"
            >
              Versión Simple
            </button>
            <button
              onClick={onAuthClick}
              className="bg-industrial-navy text-white px-4 py-2 rounded-sm hover:bg-industrial-steel transition-all"
            >
              Área Clientes
            </button>
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
              <a href="#quienes-somos" className="hover:text-industrial-orange transition-colors">Nosotros</a>
              <a href="#servicios" className="hover:text-industrial-orange transition-colors">Servicios</a>
              <a href="#estandar" className="hover:text-industrial-orange transition-colors">Estándar</a>
              <a href="#calculadora" className="hover:text-industrial-orange transition-colors">Cotizador</a>
              <button
                onClick={() => {
                  navigate('/simple');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-xs bg-slate-100 text-industrial-navy px-3 py-2 rounded-sm hover:bg-industrial-orange hover:text-white transition-all"
              >
                Versión Simple
              </button>
              <button
                onClick={() => {
                  onAuthClick();
                  setMobileMenuOpen(false);
                }}
                className="bg-industrial-navy text-white px-4 py-2 rounded-sm hover:bg-industrial-steel transition-all text-left"
              >
                Área Clientes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        <Hero />
        <About />
        <Services />
        <Standards />
        <Calculator />
        <ClientArea onAuthClick={onAuthClick} onLogin={handleLogin} />
        <EmergencyPortal />
      </main>
    </div>
  );
};

// --- Components ---

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

const Standards = () => (
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

const ClientArea = ({ onAuthClick, onLogin }: { onAuthClick: () => void; onLogin: (token: string) => void }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(rutSchema)
  });

  const handleClientLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    if (!loginEmail || !loginPassword) {
      setLoginError("Debe ingresar correo y contraseña.");
      setLoginLoading(false);
      return;
    }

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginEmail, password: loginPassword })
      });
      const json = await resp.json();
      if (json.success) {
        onLogin(json.token);
      } else {
        setLoginError(json.message || "Credenciales inválidas");
      }
    } catch (err) {
      setLoginError("Error de conexión con el servidor.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

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
        <p className="text-industrial-steel mb-8">Acceda a su servidor de trabajos y consulte el estado de sus certificaciones.</p>

        <div className="grid gap-4 max-w-5xl mx-auto mb-12">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
            <form onSubmit={handleClientLogin} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-navy outline-none"
                  placeholder="Correo electrónico"
                  type="email"
                />
                <input
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-navy outline-none"
                  placeholder="Contraseña"
                  type="password"
                />
              </div>
              {loginError && (
                <div className="text-red-600 text-sm">{loginError}</div>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="bg-industrial-navy text-white px-8 py-4 rounded-sm font-bold hover:bg-industrial-steel transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Verificando..." : "Ingresar con contraseña"}
              </button>
            </form>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-white text-industrial-navy border border-industrial-navy px-8 py-4 rounded-sm font-bold hover:bg-industrial-navy hover:text-white transition-all"
            >
              Iniciar con Google
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-12">
          <p className="text-industrial-steel mb-8">O consulte el estado de sus certificaciones públicas:</p>

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
        </div>

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
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel mb-2">RUT Empresa</label>
                        <input {...register("rut")} className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none" placeholder="12345678-9" />
                        {errors.rut && <p className="text-red-500 text-xs mt-1">{errors.rut.message as string}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel mb-2">Nombre de Contacto</label>
                        <input {...register("contactName")} className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none" placeholder="Juan Pérez" />
                        {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message as string}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel mb-2">Dirección del Sitio</label>
                      <input {...register("location")} className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none" placeholder="Av. Providencia 123, Santiago" />
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message as string}</p>}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel mb-2">Tipo de Sistema</label>
                        <select {...register("type")} className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none">
                          <option value="Eléctrica">Eléctrica</option>
                          <option value="Datos">Datos</option>
                          <option value="Seguridad">Seguridad</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel mb-2">Nivel de Urgencia</label>
                        <select {...register("urgency")} className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none">
                          <option value="Nivel 1">Nivel 1 (Crítico)</option>
                          <option value="Nivel 2">Nivel 2 (Urgente)</option>
                          <option value="Nivel 3">Nivel 3 (Normal)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel mb-2">Teléfono de Contacto</label>
                        <input {...register("contact")} className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none" placeholder="+569 1234 5678" />
                        {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message as string}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel mb-2">Descripción de la Falla</label>
                      <textarea {...register("description")} rows={4} className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none resize-none" placeholder="Describa detalladamente la falla técnica..." />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
                    </div>

                    <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-sm font-bold hover:bg-red-700 transition-all">
                      ACTIVAR PROTOCOLO DE EMERGENCIA
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-industrial-navy mb-6">Protocolo de Emergencias Mundoredes</h3>
                    <p className="text-industrial-steel mb-8">Sistema operativo estandarizado para respuesta crítica 24/7/365.</p>
                  </div>

                  {protocol.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border-l-4 border-industrial-orange pl-6 pb-8"
                    >
                      <h4 className="text-xl font-bold text-industrial-navy mb-4">{step.title}</h4>
                      <ul className="space-y-2">
                        {step.content.map((item, j) => (
                          <li key={j} className="text-industrial-steel flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-industrial-orange mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
