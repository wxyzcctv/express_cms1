const express = require('express')
const svgCaptcha = require('svg-captcha');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("admin/login/login.html",{
        "username":'',
        "password":'',
        "verifyTip":'',
    })
})
router.post("/doLogin", (req, res) => {

    let username = req.body.username
    let password = req.body.password
    let verify = req.body.verify

    // 1、判断验证码是否正确
    // 2、判断用户名密码是否合法

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

    //验证成功
    res.render("admin/public/success.html", {
        "redirectUrl": "/admin",
        "message": "登录成功"
    })    
})

 
router.get('/verify', function (req, res) {
    var captcha = svgCaptcha.create();
    // 保存验证码到session中
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});

module.exports = router