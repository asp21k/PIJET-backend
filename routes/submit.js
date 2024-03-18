const express = require('express');
const router = express.Router();
const {upload} = require('../middlewares/multer');
const { uploadPaperDetails, uploadFilePathToVersionTable } = require('../controllers/uploadPaper');
const {isAuthenticated} = require('../middlewares/userAuth');   

router.post('/upload', isAuthenticated ,upload , uploadFilePathToVersionTable);
router.post('/', isAuthenticated, uploadPaperDetails);
module.exports = router;