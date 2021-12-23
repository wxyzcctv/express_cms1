const express = require('express')
const svgCaptcha = require('svg-captcha');
const md5 = require('md5');
const router = express.Router();
const ManagerModel = require('../../model/managerModel');

router.get("/", async (req, res) => {
    // 测试阶段使用代码新建一用户
    // let manager = new ManagerModel({
    //     username: 'admin',
    //     password: md5('123456')
    // })
    // await manager.save()

    res.render("admin/login/login.html",{
        "username":'',
        "password":'',
        "verifyTip":'',
    })
})
router.post("/doLogin", async (req, res) => {

    let username = req.body.username
    let password = req.body.password
    let verify = req.body.verify

    // 1、判断验证码是否正确    

    if (verify.toLocaleLowerCase() != req.session.captcha.toLocaleLowerCase()) {
        // res.render("admin/public/error.html", {
        //     "redirectUrl": "/admin/login",
        //     "message": "图形验证码输入错误"
        // })
        res.render("admin/login/login.html", {
            "username": username,
            "password": password,
            "verifyTip": "图形验证码输入错误"
        })
        return
    }

    // 2、判断用户名密码是否合法
    
    let user = await ManagerModel.find({username:username,password:md5(password)});
    if (user.length > 0) {
        // 保存用户信息
        req.session.userinfor = user[0];
        // 提示一下登录成功
        res.render("admin/public/success.html", {
            "redirectUrl": "/admin",
            "message": "登录成功"
        }) 
    } else {
        res.render("admin/login/login.html", {
            "username": username,
            "password": password,
            "verifyTip": "用户名或密码错误"
        })
    }

    // // 登录成功提示过度界面
    // res.render("admin/public/success.html", {
    //     "redirectUrl": "/admin",
    //     "message": "登录成功"
    // })    
})

 
router.get('/verify', function (req, res) {
    var captcha = svgCaptcha.create();
    // 保存验证码到session中
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});

// 退出请求
router.get('/logOut',(req,res)=>{
    req.session.userinfor = null;
    res.redirect('/admin/login')
})

module.exports = router