import express from 'express';
import cors from 'cors';
import userroutes from "./routes/user.routes.js"
import pacienteroutes from "./routes/paciente.routes.js";
import medicoRoutes from "./routes/medico.routes.js";
import citaRoutes from "./routes/cita.routes.js";
import consultaRoutes from "./routes/consulta.routes.js";
const app = express();

app.use(express.json());

// Configuración de CORS
app.use(cors());

app.use(userroutes);
app.use(pacienteroutes);
app.use(medicoRoutes);
app.use(citaRoutes);
app.use(consultaRoutes);

app.listen(3000);
console.log("Server running on port 3000");
