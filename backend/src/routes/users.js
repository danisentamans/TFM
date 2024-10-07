const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/me', auth, userController.getAuthenticatedUser);
router.put('/me', auth, userController.updateAuthenticatedUser);
router.put('/:id', auth, isAdmin, userController.updateUserById);
router.put('/:username/update-to-admin', auth, userController.updateToAdmin);
router.delete('/:id', auth, userController.deleteUserById);
router.delete('/me', auth, userController.deleteAuthenticatedUser);
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/:id', auth, isAdmin, userController.getUserById);

module.exports = router;
