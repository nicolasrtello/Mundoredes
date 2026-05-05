import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator as CalcIcon, ArrowUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const quoteSchema = z.object({
  points: z.number().min(1, "Mínimo 1 punto"),
  area: z.number().min(1, "Mínimo 1 m²"),
  type: z.enum(["Eléctrica", "Datos", "Seguridad"]),
  urgency: z.enum(["Nivel 1", "Nivel 2", "Nivel 3"]),
  email: z.string().email("Email inválido")
});

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
              <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel">Tipo de Infraestructura</label>
              <select
                {...register("type")}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none transition-all"
              >
                <option value="Datos">Redes de Datos</option>
                <option value="Eléctrica">Electricidad Industrial</option>
                <option value="Seguridad">Seguridad Electrónica</option>
              </select>
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

            <div className="md:col-span-2 space-y-4">
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

export default Calculator;