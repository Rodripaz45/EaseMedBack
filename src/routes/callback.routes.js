import { Router } from 'express';
import { confirmarPago } from '../controllers/callback.controller.js';

const router = Router();

router.post('/callback', confirmarPago);

export default router;