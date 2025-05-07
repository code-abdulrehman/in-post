import { textController } from '../controllers/textController.js';
import { Router } from 'express'; 

const router = Router();

router.post('/', textController);

export default router;