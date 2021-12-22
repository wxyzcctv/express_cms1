const express = require('express')
const svgCaptcha = require('svg-captcha');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("admin/login/login.html")
})
router.get("/doLogin", (req, res) => {
    res.send("执行登录")
})

 
router.get('/verify', function (req, res) {
    var captcha = svgCaptcha.create();
    // req.session.captcha = captcha.text;
    console.log('验证码内容',captcha.text);
    res.type('svg');
    res.status(200).send(captcha.data);
});

module.exports = router