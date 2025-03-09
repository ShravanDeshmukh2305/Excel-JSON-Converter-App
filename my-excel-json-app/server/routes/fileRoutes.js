const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/fileController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-excel', upload.single('file'), fileController.uploadExcel);
router.post('/json-to-excel', fileController.jsonToExcel);

module.exports = router;