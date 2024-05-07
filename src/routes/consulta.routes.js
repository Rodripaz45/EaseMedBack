import { Router } from "express";
import { createConsulta, getConsultasPorPaciente } from "../controllers/consulta.controller.js"
const router = Router()

router.post("/createConsulta", createConsulta);
router.get("/getConsultasById", getConsultasPorPaciente);



export default router;