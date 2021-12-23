const express = require('express');
const router = express.Router();
const url = require('url')

// admin界面跳转是实现权限校验
router.use((req,res,next)=>{
    let pathName = url.parse(req.url).pathname;    
    let dontRedictPath = ['/login','/login/verify','/login/doLogin']; // 不需要校验的路由界面
    if (req.session.userinfor && req.session.userinfor.username) {        
        next();
    }else{
        // if (dontRedictPath.includes(pathName)) {
        //     next();
        // }else{
        //     res.redirect('/admin/login')
        // }
        next()
    }
})

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
