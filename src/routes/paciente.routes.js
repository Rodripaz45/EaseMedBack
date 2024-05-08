import { Router } from "express";
import { register, login, getById } from "../controllers/paciente.controller.js"
const router = Router()

router.post('/paciente/register',register);
router.post('/paciente/login',login);
router.get('/paciente/getById',getById);

export default router