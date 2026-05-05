import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LogOut, Briefcase, Calendar, MapPin, Clock, CheckCircle, AlertCircle, User } from "lucide-react";

interface Job {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  location: string;
  scheduledDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const Dashboard = ({ token, onLogout }: DashboardProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const resp = await fetch("/api/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp.status === 401) {
        onLogout();
        return;
      }

      const json = await resp.json();
      if (json.success) {
        setJobs(json.jobs);
      } else {
        setError(json.message);
      }
    } catch (e) {
      setError("Error al cargar los trabajos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in_progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-industrial-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-industrial-navy mx-auto mb-4"></div>
          <p className="text-industrial-steel">Cargando trabajos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-industrial-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-industrial-navy flex items-center justify-center rounded-sm">
              <Briefcase className="text-industrial-orange w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-industrial-navy">Servidor de Trabajos</h1>
              <p className="text-sm text-industrial-steel">Mundoredes - Gestión de Proyectos</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-industrial-navy text-white px-4 py-2 rounded-sm hover:bg-industrial-steel transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-industrial-navy mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Mis Trabajos ({jobs.length})
            </h2>

            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-industrial-steel mx-auto mb-4" />
                <p className="text-industrial-steel">No hay trabajos asignados actualmente</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-industrial-navy mb-2">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-industrial-steel">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(job.scheduledDate).toLocaleDateString('es-CL')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(job.priority)}`}>
                          {job.priority.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          <span className="text-sm font-medium">{getStatusText(job.status)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-industrial-steel">{job.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;