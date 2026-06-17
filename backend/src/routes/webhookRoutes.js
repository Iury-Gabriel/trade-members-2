const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/registro', webhookController.registro);
router.get('/ftd', webhookController.ftd);
router.post('/ativar', authMiddleware, webhookController.ativar);

module.exports = router;
