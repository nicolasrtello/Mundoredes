import { useState } from "react";
import { motion } from "motion/react";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida")
});

interface AuthProps {
  onLogin: (token: string) => void;
  onBack: () => void;
}

const Auth = ({ onLogin, onBack }: AuthProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const json = await resp.json();
      if (json.success) {
        onLogin(json.token);
      } else {
        setError(json.message || "Credenciales inválidas");
      }
    } catch (e) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-navy to-industrial-steel flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-navy text-white rounded-full mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-industrial-navy mb-2">Acceso Seguro</h1>
          <p className="text-industrial-steel">Servidor de Trabajos Mundoredes</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-industrial-steel mb-2">
              Correo
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none transition-all"
              placeholder="correo@empresa.cl"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-industrial-steel mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-industrial-orange outline-none transition-all pr-12"
                placeholder="Ingrese su contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-industrial-steel hover:text-industrial-navy"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-sm border border-red-100 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-industrial-navy text-white py-4 rounded-sm font-bold hover:bg-industrial-steel transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-500">O bien, inicia sesión con</div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-white text-industrial-navy border border-industrial-navy py-4 rounded-sm font-bold hover:bg-industrial-navy hover:text-white transition-all"
        >
          Continuar con Google
        </button>

        <button
          onClick={onBack}
          className="w-full mt-6 text-industrial-steel hover:text-industrial-navy transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al sitio principal
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;