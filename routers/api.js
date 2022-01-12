const express = require('express')
const router = express.Router();

const v1 = require('./api/v1.js');
const v2 = require('./api/v2.js');
const v3 = require('./api/v3.js');

router.use('/',v1);
router.use('/v1',v1);
router.use('/v2',v2);
router.use('/v3',v3);

module.exports = router