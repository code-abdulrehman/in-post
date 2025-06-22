import { summarizeBlog, searchBlogs, getBlogWithRelated } from '../controllers/thoggoController.js';
import { Router } from 'express'; 

const router = Router();

// Route to summarize a single blog post
router.post('/summarize', summarizeBlog);

// Route to search through blogs based on query
router.post('/search', searchBlogs);

// Route to get blog summary with related links and recommendations
router.post('/related', getBlogWithRelated);

export default router; 