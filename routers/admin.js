const express = require('express')
const router = express.Router();

//引入模块
const nav = require('./admin/nav');
const user = require('./admin/user');
const main = require('./admin/main');
const login = require('./admin/login');
const manager = require('./admin/manager');

//挂载路由
router.use('/',main);
router.use('/nav',nav);
router.use('/user',user);
router.use('/login',login);
router.use('/manager',manager);

module.exports = router;
