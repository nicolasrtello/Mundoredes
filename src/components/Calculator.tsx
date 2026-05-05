import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator as CalcIcon, ArrowUpRight, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const quoteSchema = z.object({
  points: z.number().min(1, "Mínimo 1 punto"),
  urgency: z.enum(["Nivel 1", "Nivel 2", "Nivel 3"]),
  email: z.string().email("Email inválido")
});

const Calculator = () => {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: zodResolver(quoteSchema)
  });

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const isImage = file.type.startsWith('image/');
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        return isImage && isValidSize;
      });
      setSelectedFiles(validFiles);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('points', data.points.toString());
      formData.append('urgency', data.urgency);
      formData.append('email', data.email);
      
      // Add selected files
      selectedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const resp = await fetch("/api/quote", {
        method: "POST",
        body: formData
      });
      
      if (!resp.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      const json = await resp.json();
      if (json.success) {
        setResult(json.estimate);
        setShowConfirmation(true);
        setSelectedFiles([]); // Clear files after successful submission
      } else {
        alert(json.message || 'Error al generar la cotización');
      }
    } catch (e) {
      console.error(e);
      alert('Error al enviar la cotización. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowConfirmation(false);
    setResult(null);
    reset();
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

          <AnimatePresence mode="wait">
            {!showConfirmation ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 gap-8"
              >
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

                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-industrial-steel">Fotos del Proyecto (Opcional)</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleFileButtonClick}
                      className="bg-industrial-navy text-white px-6 py-3 rounded-sm font-bold hover:bg-industrial-steel transition-all flex items-center gap-2"
                    >
                      Elegir Archivos
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-industrial-steel">Puedes subir múltiples fotos (máx. 10, hasta 10MB cada una).</p>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold">Archivos seleccionados:</p>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                          <span className="text-sm">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
              </motion.form>
            ) : (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100/50"
                >
                  <CalcIcon className="w-12 h-12" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl font-bold text-industrial-navy mb-4 tracking-tighter"
                >
                  INFORMACIÓN RECIBIDA
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-industrial-steel mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                  Nuestros ingenieros especializados están analizando su requerimiento técnico.
                  En las próximas 24 horas hábiles, nos contactaremos con usted para coordinar
                  una visita de factibilidad y entregar una cotización detallada y personalizada.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-industrial-gray p-6 rounded-sm border border-slate-200 inline-block mb-8"
                >
                  <p className="text-[10px] font-bold uppercase text-industrial-steel mb-2">Estimación Preliminar</p>
                  <p className="text-2xl font-bold text-industrial-navy">${result?.toLocaleString("es-CL")}</p>
                  <p className="text-xs text-industrial-steel mt-1">Valor referencial + IVA</p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  onClick={resetForm}
                  className="bg-industrial-navy text-white px-8 py-3 rounded-sm font-bold hover:bg-industrial-steel transition-all"
                >
                  Solicitar Nueva Cotización
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Calculator;