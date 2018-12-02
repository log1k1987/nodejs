const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.sendData);

router.get('/login', ctrlLogin.getLogin);

router.get('/admin', ctrlAdmin.getAdmin);
router.post('/admin/skills', ctrlAdmin.sendSkills);
router.post('/admin/upload', ctrlAdmin.sendUpload);

module.exports = router;
