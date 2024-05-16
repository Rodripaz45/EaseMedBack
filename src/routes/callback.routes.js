import { Router } from 'express';
import { handlePaymentCallback } from '../controllers/callback.controller.js';

const router = Router();

router.post('/callback', handlePaymentCallback);

export default router;