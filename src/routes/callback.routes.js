import { Router } from 'express';
import { processCallback } from '../controllers/callback.controller.js';

const router = Router();

router.post('/callback', processCallback);

export default router;