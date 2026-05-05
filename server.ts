import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import nodemailer from "nodemailer";
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
