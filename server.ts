import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, Date.now() + '-' + sanitizedName);
  }
});

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Max 10 files
  }
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve static files from public directory
  app.use(express.static(path.join(__dirname, 'public')));

  // API Routes
  app.post("/api/emergency", (req, res) => {
    const { rut, contactName, location, type, urgency, description, contact } = req.body;
    console.log("Emergency Report Received:", { rut, contactName, location, type, urgency, description, contact });
    // In a real app, this would send an SMS/Email to the technical team
    res.json({ success: true, message: "Reporte de emergencia recibido. Un técnico se contactará a la brevedad." });
  });

  app.get("/api/client-status/:rut", (req, res) => {
    const { rut } = req.params;
    // Mock data for demonstration
    const mockData: Record<string, any> = {
      "12345678-9": {
        client: "Constructora Industrial S.A.",
        status: "Certificación Vigente",
        nextMaintenance: "2026-06-15",
        lastProject: "Normalización Eléctrica TE1",
      },
      "98765432-1": {
        client: "Logística Express Ltda.",
        status: "Mantención Pendiente",
        nextMaintenance: "2026-04-01",
        lastProject: "Cableado Estructurado Cat6A",
      }
    };

    const status = mockData[rut];
    if (status) {
      res.json({ success: true, data: status });
    } else {
      res.status(404).json({ success: false, message: "RUT no encontrado en nuestra base de datos de certificaciones." });
    }
  });

  app.post("/api/quote", upload.array('photos', 10), async (req, res) => {
    const { points, urgency, email } = req.body;
    const files = req.files as Express.Multer.File[];

    // Check for multer errors
    if (req.fileValidationError) {
      return res.status(400).json({ success: false, message: req.fileValidationError });
    }

    try {
      // Calculate estimate
      const basePrice = parseInt(points) * 45000;
      const urgencyMultiplier = urgency === "Nivel 1" ? 1.5 : urgency === "Nivel 2" ? 1.2 : 1.0;
      const estimatedTotal = Math.round(basePrice * urgencyMultiplier);

      // Send email with details
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: 'robertelloa@gmail.com',
        subject: 'Nueva Cotización de Proyecto - Mundoredes',
        html: `
          <h2>Nueva Solicitud de Cotización</h2>
          <p><strong>Cliente:</strong> ${email}</p>
          <p><strong>Puntos de Red:</strong> ${points}</p>
          <p><strong>Nivel de Urgencia:</strong> ${urgency}</p>
          <p><strong>Estimación Calculada:</strong> $${estimatedTotal.toLocaleString('es-CL')} + IVA</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}</p>
          ${files && files.length > 0 ? `<p><strong>Fotos adjuntas:</strong> ${files.length} archivo(s)</p>` : '<p>Sin fotos adjuntas</p>'}
        `,
        attachments: files ? files.map(file => ({
          filename: file.originalname,
          path: file.path,
          cid: `image-${file.filename}` // Content ID for inline display
        })) : []
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to robertelloa@gmail.com with ${files?.length || 0} attachments`);

      res.json({ 
        success: true, 
        estimate: estimatedTotal,
        message: "Presupuesto estimado generado. Se ha enviado un detalle técnico a su correo." 
      });
    } catch (error) {
      console.error('Error processing quote:', error);
      res.status(500).json({ success: false, message: "Error al procesar la cotización" });
    }
  });

  // Middleware de autenticación
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token de acceso requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'mundoredes-secret-key', (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Token inválido' });
      }
      req.user = user;
      next();
    });
  };

  // Endpoint de login
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      // Mock user database - En producción usarías una base de datos real
      const users = [
        {
          id: 1,
          username: "admin",
          password: await bcrypt.hash("admin123", 10),
          role: "admin",
          name: "Administrador"
        },
        {
          id: 2,
          username: "tecnico1",
          password: await bcrypt.hash("tec123", 10),
          role: "technician",
          name: "Juan Pérez"
        },
        {
          id: 3,
          username: "cliente1",
          password: await bcrypt.hash("cliente123", 10),
          role: "client",
          name: "Empresa XYZ"
        }
      ];

      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(401).json({ success: false, message: "Usuario no encontrado" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'mundoredes-secret-key',
        { expiresIn: '8h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ success: false, message: "Error en el servidor" });
    }
  });

  // Endpoint para obtener trabajos (protegido)
  app.get("/api/jobs", authenticateToken, (req: any, res) => {
    try {
      // Mock data - En producción vendría de una base de datos
      const mockJobs = [
        {
          id: "JOB-001",
          title: "Instalación de Red Estructurada - Edificio Corporativo",
          status: "in_progress",
          location: "Av. Providencia 123, Santiago",
          scheduledDate: "2024-12-20",
          description: "Instalación de 50 puntos de red Cat6A, configuración de switches Cisco y certificación Fluke.",
          priority: "high"
        },
        {
          id: "JOB-002",
          title: "Mantenimiento Preventivo - Sistema Eléctrico",
          status: "pending",
          location: "Calle Industrial 456, Quilicura",
          scheduledDate: "2024-12-22",
          description: "Revisión completa de tableros eléctricos, medición de cargas y actualización de rotulación SEC.",
          priority: "medium"
        },
        {
          id: "JOB-003",
          title: "Implementación CCTV 4K - Bodega Logística",
          status: "completed",
          location: "Ruta 5 Sur km 25, Lampa",
          scheduledDate: "2024-12-15",
          description: "Instalación de 16 cámaras 4K con analítica IA, configuración de NVR y testing completo.",
          priority: "high"
        },
        {
          id: "JOB-004",
          title: "Actualización WiFi Corporativo",
          status: "pending",
          location: "Plaza Empresarial, Las Condes",
          scheduledDate: "2024-12-25",
          description: "Migración a WiFi 6, configuración de controladores y pruebas de cobertura.",
          priority: "low"
        }
      ];

      // Filtrar trabajos según el rol del usuario
      let filteredJobs = mockJobs;
      if (req.user.role === 'technician') {
        // Técnicos ven todos los trabajos asignados
        filteredJobs = mockJobs.filter(job => job.status !== 'completed');
      } else if (req.user.role === 'client') {
        // Clientes ven solo sus trabajos
        filteredJobs = mockJobs.filter(job => job.status === 'completed' || job.status === 'in_progress');
      }

      res.json({
        success: true,
        jobs: filteredJobs
      });
    } catch (error) {
      console.error('Error obteniendo trabajos:', error);
      res.status(500).json({ success: false, message: "Error al obtener trabajos" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
