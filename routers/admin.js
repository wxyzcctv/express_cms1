const express = require('express')
const router = express.Router();

//引入模块
const login = require('./admin/login');
const manager = require('./admin/manager');
const nav = require('./admin/nav');
const user = require('./admin/user');

router.get('/',(req,res)=>{
    res.send('后台管理中心')
})

//挂载路由
router.use('/login',login);
router.use('/manager',manager);
router.use('/nav',nav);
router.use('/user',user);

module.exports = router;
