import { colorController } from '../controllers/colorController.js';
import { Router } from 'express'; 

const router = Router();

router.post('/', colorController);

export default router;