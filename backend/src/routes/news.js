const express = require('express');
const router = express.Router();
const { createNews, getNews, updateNews, deleteNews, getNewsById } = require('../controllers/newsController');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authMiddleware');

router.post('/', auth, isAdmin, createNews);
router.get('/', getNews);
router.get('/:id', getNewsById);
router.put('/:id', auth, isAdmin, updateNews);
router.delete('/:id', auth, isAdmin, deleteNews);

module.exports = router;
