const express = require('express');
const { createBlog, listBlogs, getBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', listBlogs);
router.get('/:id', getBlog); 

router.post('/', authMiddleware, createBlog); 
router.patch('/:id', authMiddleware, updateBlog); 
router.delete('/:id', authMiddleware, deleteBlog); 

module.exports = router;