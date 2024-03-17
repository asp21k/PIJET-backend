const express = require('express');
const router = express.Router();
const {upload} = require('../middlewares/multer');
const { uploadPaper, addAuthor } = require('../controllers/uploadPaper');
const {isAuthenticated} = require('../middlewares/userAuth');   

router.post('/', isAuthenticated ,upload ,uploadPaper);
router.post('/addAuthor', addAuthor);

module.exports = router;