const express = require('express');
const router = express.Router();
const {isAuthenticated}  = require('../middlewares/userAuth');
const {getPaperDetails} = require('../controllers/userPaperFetching');
router.get('/papers/',isAuthenticated ,getPaperDetails);  
module.exports = router;