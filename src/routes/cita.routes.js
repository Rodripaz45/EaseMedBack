import { Router } from "express";
import { getCita, createCita, getCitasPorPaciente, getCitasPorMedico, getCitasDelDia, deleteCita} from "../controllers/cita.controller.js";
const router = Router()

router.get('/cita',getCita);
router.post('/cita/create', createCita);
router.get('/cita/paciente', getCitasPorPaciente);
router.get('/cita/medico', getCitasPorMedico);
router.get('/cita/today', getCitasDelDia);
router.delete('/cita/:id', deleteCita);


export default router;