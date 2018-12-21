const express = require('express');
const router = express.Router();
const ctrlHome = require('../controllers/index');

router.get('*', ctrlHome.getIndex);

module.exports = router;
