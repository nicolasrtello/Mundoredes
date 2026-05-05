import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import * as z from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const inspectionSchema = z.object({
  company: z.string().min(2, "Nombre de empresa requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono requerido"),
  service: z.string().min(1, "Seleccione un servicio"),
  details: z.string().min(10, "Describe brevemente tu solicitud"),
});

type InspectionFormValues = z.infer<typeof inspectionSchema>;

const services = [
  { value: "puntos-de-red", label: "Instalación de puntos de red" },
  { value: "wifi-corporativo", label: "WiFi Corporativo" },
  { value: "certificacion-fluke", label: "Certificación Fluke" },
  { value: "cctv", label: "CCTV y Videovigilancia" },
  { value: "control-acceso", label: "Control de acceso biométrico" },
  { value: "tableros-electricos", label: "Tableros eléctricos SEC" },
  { value: "mantencion-electrica", label: "Mantención eléctrica industrial" },
  { value: "proyectos-te1", label: "Proyectos TE1" },
  { value: "eficiencia-led", label: "Eficiencia energética LED" },
  { value: "asesoria-tecnica", label: "Asesoría técnica y planeación" },
];

const Inspection = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: { service: "" },
  });

  const onSubmit = async (data: InspectionFormValues) => {
    try {
      console.log("Inspección técnica solicitada:", data);
      setSubmitted(true);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-industrial-gray py-20">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-industrial-navy font-semibold mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-white rounded-sm shadow-2xl p-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-industrial-navy mb-4">Inspección Técnica</h1>
            <p className="text-industrial-steel text-lg max-w-2xl mx-auto">
              Completa el formulario para solicitar una inspección técnica en electricidad, datos o seguridad. Nuestro equipo revisará tu solicitud y te contactará a la brevedad.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-industrial-navy mb-2">Empresa</label>
                <input
                  {...register("company")}
                  className="w-full rounded-sm border border-slate-200 px-4 py-3 focus:border-industrial-orange outline-none"
                  placeholder="Nombre de la empresa"
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-industrial-navy mb-2">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-sm border border-slate-200 px-4 py-3 focus:border-industrial-orange outline-none"
                    placeholder="tu@empresa.cl"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-industrial-navy mb-2">Teléfono</label>
                  <input
                    {...register("phone")}
                    className="w-full rounded-sm border border-slate-200 px-4 py-3 focus:border-industrial-orange outline-none"
                    placeholder="+56 9 1234 5678"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-industrial-navy mb-2">Selecciona el trabajo</label>
                <select
                  {...register("service")}
                  className="w-full rounded-sm border border-slate-200 px-4 py-3 focus:border-industrial-orange outline-none bg-white"
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-industrial-navy mb-2">Descripción</label>
                <textarea
                  {...register("details")}
                  className="w-full rounded-sm border border-slate-200 px-4 py-3 focus:border-industrial-orange outline-none min-h-[140px]"
                  placeholder="Describe brevemente qué necesitas inspeccionar"
                />
                {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-industrial-navy text-white py-4 rounded-sm font-bold hover:bg-industrial-orange transition-colors"
              >
                Enviar Solicitud
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-industrial-navy mb-3">Solicitud recibida</h2>
              <p className="text-industrial-steel mb-6">
                Gracias por solicitar una inspección técnica. Nuestro equipo revisará tu caso y te contactaremos a la brevedad.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-industrial-orange text-white px-8 py-3 rounded-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Hacer otra solicitud
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inspection;
