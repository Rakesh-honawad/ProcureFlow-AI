import { Router } from 'express';
import { emailController } from '../controllers/email.controller';

const router = Router();

router.post('/inbound', emailController.handleInbound);

export default router;
