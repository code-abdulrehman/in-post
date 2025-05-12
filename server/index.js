import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import textRoutes from './routes/text.js';
import chatRoutes from './routes/chat.js';
import colorRoutes from './routes/color.js';

dotenv.config();
 const PORT = process.env.PORT || 4003;

 const app = express();

 app.use(cors());
 app.use(express.json());

 app.use('/api/text/gen', textRoutes);
 app.use('/api/chat/gen', chatRoutes);
 app.use('/api/color/gen', colorRoutes);
 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 });