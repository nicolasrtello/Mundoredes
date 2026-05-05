import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Network,
  ShieldCheck,
  Zap,
  Activity,
  PhoneCall,
  Calculator as CalcIcon,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Star
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const quoteSchema = z.object({
  points: z.number().min(1, "Mínimo 1 punto"),
  urgency: z.enum(["standard", "priority", "urgent"]),
  email: z.string().email("Email inválido"),
  company: z.string().min(2, "Nombre de empresa requerido"),
  phone: z.string().min(8, "Teléfono requerido")
});

const SimplifiedSite = () => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(quoteSchema)
  });

  const services = [
    {
      icon: <Network className="w-8 h-8" />,
      title: "Redes de Datos",
      desc: "Instalación profesional de puntos de red, WiFi corporativo y certificación Fluke.",
      features: ["Cat 6/6A", "WiFi Gestionado", "Certificación Técnica"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Seguridad IP",
      desc: "Sistemas de videovigilancia 4K con analítica inteligente y control de acceso.",
      features: ["CCTV 4K", "Control Biométrico", "Monitoreo 24/7"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Electricidad Industrial",
      desc: "Ingeniería eléctrica certificada SEC con mantención preventiva especializada.",
      features: ["Certificación SEC", "Tableros Eléctricos", "Eficiencia LED"]
    }
  ];

  const stats = [
    { number: "15+", label: "Años de Experiencia" },
    { number: "500+", label: "Proyectos Completados" },
    { number: "24/7", label: "Soporte Técnico" },
    { number: "100%", label: "Certificación Técnica" }
  ];

  const testimonials = [
    {
      name: "María González",
      company: "TechCorp SpA",
      text: "Excelente trabajo en la instalación de nuestra red corporativa. Profesionales y puntuales.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      company: "Industria Minera Ltda",
      text: "El sistema de seguridad implementado superó nuestras expectativas. Recomendados al 100%.",
      rating: 5
    }
  ];

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('points', data.points.toString());
      formData.append('urgency', data.urgency);
      formData.append('email', data.email);
      formData.append('company', data.company);
      formData.append('phone', data.phone);

      const resp = await fetch("/api/quote", {
        method: "POST",
        body: formData
      });

      if (resp.ok) {
        setQuoteSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Simplificado */}
      <header className="bg-industrial-navy text-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-industrial-orange flex items-center justify-center rounded-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter">MUNDOREDES</h1>
              <p className="text-xs text-slate-300">Infraestructura Técnica Profesional</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs bg-slate-700 text-white px-3 py-1 rounded-sm hover:bg-slate-600 transition-colors"
            >
              Versión Completa
            </button>
            <a href="tel:+56223456789" className="flex items-center gap-2 text-sm hover:text-industrial-orange transition-colors">
              <PhoneCall className="w-4 h-4" />
              +56 2 2345 6789
            </a>
            <button
              onClick={() => setShowQuoteForm(true)}
              className="bg-industrial-orange text-white px-6 py-2 rounded-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Cotizar Ahora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section Simplificado */}
      <section className="bg-gradient-to-br from-industrial-navy to-industrial-steel text-white py-20 relative z-0 overflow-hidden scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Infraestructura Técnica
            <span className="text-industrial-orange block">que funciona</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            Más de 15 años instalando redes, seguridad y electricidad industrial
            con estándares certificados y soporte 24/7.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => setShowQuoteForm(true)}
              className="bg-industrial-orange text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-5 h-5" />
              Obtener Cotización
            </button>
            <a
              href="tel:+56223456789"
              className="border-2 border-white text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-white hover:text-industrial-navy transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              Llamar Ahora
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100 relative z-0 overflow-hidden scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-industrial-navy mb-2">{stat.number}</div>
                <div className="text-sm text-industrial-steel uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Section Simplificado */}
      <section className="py-20 bg-slate-50 relative z-0 overflow-hidden scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-industrial-navy mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-industrial-steel max-w-2xl mx-auto">
              Soluciones integrales de infraestructura técnica con certificación profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-sm shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-industrial-navy text-white flex items-center justify-center rounded-sm mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-industrial-navy mb-4">{service.title}</h3>
                <p className="text-industrial-steel mb-6 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 bg-industrial-navy text-white relative z-0 overflow-hidden scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Por qué elegir Mundoredes?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Compromiso, experiencia y resultados que respaldan nuestro trabajo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-industrial-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Respuesta Rápida</h3>
              <p className="text-slate-300">Atención inmediata y tiempos de entrega cumplidos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-industrial-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Equipo Certificado</h3>
              <p className="text-slate-300">Técnicos con certificaciones oficiales y experiencia comprobada</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-industrial-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Garantía Total</h3>
              <p className="text-slate-300">Trabajo garantizado con soporte técnico post-instalación</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-industrial-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Calidad Premium</h3>
              <p className="text-slate-300">Equipos y materiales de primera calidad con estándares internacionales</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white relative z-0 overflow-hidden scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-industrial-navy mb-4">Lo que dicen nuestros clientes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-industrial-steel mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-industrial-navy">{testimonial.name}</div>
                  <div className="text-sm text-industrial-steel">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-industrial-orange text-white relative z-0 overflow-hidden scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Necesitas una cotización?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contáctanos hoy y recibe una evaluación técnica profesional sin compromiso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowQuoteForm(true)}
              className="bg-white text-industrial-orange px-8 py-4 rounded-sm font-bold text-lg hover:bg-slate-100 transition-colors"
            >
              Solicitar Cotización
            </button>
            <a
              href="tel:+56223456789"
              className="border-2 border-white text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-white hover:text-industrial-orange transition-colors"
            >
              Llamar: +56 2 2345 6789
            </a>
          </div>
        </div>
      </section>

      {/* Footer Simplificado */}
      <footer className="bg-industrial-navy text-white py-12 relative z-0 overflow-hidden scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-industrial-orange w-6 h-6" />
                <span className="text-xl font-bold">MUNDOREDES</span>
              </div>
              <p className="text-slate-300 text-sm">
                Infraestructura técnica profesional con más de 15 años de experiencia.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Redes de Datos</li>
                <li>Seguridad IP</li>
                <li>Electricidad Industrial</li>
                <li>Mantención Técnica</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>+56 2 2345 6789</li>
                <li>contacto@mundoredes.cl</li>
                <li>Santiago, Chile</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2026 Mundoredes. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Modal de Cotización */}
      {showQuoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowQuoteForm(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white w-full max-w-md p-8 rounded-sm shadow-2xl"
          >
            <button
              onClick={() => setShowQuoteForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-industrial-navy"
            >
              ✕
            </button>

            {!quoteSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <CalcIcon className="w-12 h-12 text-industrial-orange mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-industrial-navy mb-2">Cotización Express</h3>
                  <p className="text-industrial-steel">Completa el formulario y te contactamos en 24 horas</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-industrial-steel mb-1">Empresa</label>
                    <input
                      {...register("company")}
                      className="w-full p-3 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none"
                      placeholder="Nombre de tu empresa"
                    />
                    {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-industrial-steel mb-1">Email</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full p-3 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none"
                      placeholder="tu@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-industrial-steel mb-1">Teléfono</label>
                    <input
                      {...register("phone")}
                      className="w-full p-3 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none"
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-industrial-steel mb-1">Puntos de Red</label>
                    <input
                      type="number"
                      {...register("points", { valueAsNumber: true })}
                      className="w-full p-3 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none"
                      placeholder="Ej: 24"
                    />
                    {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-industrial-steel mb-1">Urgencia</label>
                    <select
                      {...register("urgency")}
                      className="w-full p-3 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none"
                    >
                      <option value="standard">Estándar (7-10 días)</option>
                      <option value="priority">Prioritario (3-5 días)</option>
                      <option value="urgent">Urgente (24-48 horas)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-industrial-orange text-white py-3 rounded-sm font-bold hover:bg-orange-600 transition-colors"
                  >
                    Enviar Cotización
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-industrial-navy mb-2">¡Cotización Enviada!</h3>
                <p className="text-industrial-steel mb-6">
                  Gracias por contactarnos. Nuestros técnicos revisarán tu solicitud y te contactaremos en las próximas 24 horas.
                </p>
                <button
                  onClick={() => {
                    setShowQuoteForm(false);
                    setQuoteSubmitted(false);
                  }}
                  className="bg-industrial-navy text-white px-6 py-2 rounded-sm font-semibold hover:bg-industrial-steel transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SimplifiedSite;</content>
<parameter name="filePath">vscode-vfs://github/nicolasrtello/Mundoredes/src/components/SimplifiedSite.tsx