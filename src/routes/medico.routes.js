import { Router } from "express";
import { getMedico, createMedico, loginMedico } from "../controllers/medico.controller.js";
const router = Router()

router.get('/medico',getMedico);
router.post('/medico/create', createMedico);
router.post('/medico/login', loginMedico);


export default router;