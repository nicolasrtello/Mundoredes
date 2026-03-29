import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  app.post("/api/quote", (req, res) => {
    const { points, area, urgency, email } = req.body;
    // Simple logic for a "lead magnet" calculator
    const basePrice = points * 45000 + area * 1500;
    const urgencyMultiplier = urgency === "Nivel 1" ? 1.5 : urgency === "Nivel 2" ? 1.2 : 1.0;
    const estimatedTotal = Math.round(basePrice * urgencyMultiplier);

    res.json({ 
      success: true, 
      estimate: estimatedTotal,
      message: "Presupuesto estimado generado. Se ha enviado un detalle técnico a su correo." 
    });
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
