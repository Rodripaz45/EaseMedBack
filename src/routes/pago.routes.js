import { Router } from 'express';
import { handlePagoNotification } from '../controllers/pago.controller.js';

const router = Router();

router.post('/pago/notification', handlePagoNotification);

export default router;
