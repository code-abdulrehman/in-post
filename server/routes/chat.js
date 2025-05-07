import { chatController } from '../controllers/chatController.js';
import { Router } from 'express'; 

const router = Router();

router.post('/', chatController);

export default router;