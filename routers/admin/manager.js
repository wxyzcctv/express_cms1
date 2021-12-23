const express = require('express')
const router = express.Router();
const ManagerModel = require("../../model/managerModel");
const { md5, getUnix } = require('../../model/tools')

router.get('/', async (req, res) => {
    let userList = await ManagerModel.find({});
    res.render('admin/manager/index.html', {
        userList
    })
})

router.get('/add', (req, res) => {
    res.render('admin/manager/add.html')
})

router.get('/edit', (req, res) => {
    res.render('admin/manager/edit.html')
})

router.post('/doAdd', async (req, res) => {
    // 1、获取表单提交的数据
    let username = req.body.username;
    let password = req.body.password;
    let rpassword = req.body.rpassword;
    let email = req.body.email;
    let mobile = req.body.mobile;
    // 2、验证数据是否合法
    if (username == "") {
        res.render("admin/public/error.html", {
            "redirectUrl": "/admin/manager/add",
            "message": "用户名不能为空"
        })
        return;
    }
    if (password.length < 6) {
        res.render('admin/public/error', {
            message: '密码长度不能小于6位',
            redirectUrl: '/admin/manager/add'
        })
        return;
    }
    if (password != rpassword) {
        res.render('admin/public/error', {
            message: "密码和确认密码不一致",
            redirectUrl: '/admin/manager/add'
        })
        return;
    }
    // 3、判断数据库里面有没有我们要增加的数据
    let result = await ManagerModel.find({
        "username": username
    });
    if (result.length > 0) {
        res.render('admin/public/error', {
            message: "当前用户已经存在，请换一个用户",
            redirectUrl: '/admin/manager/add'
        })
        return;
    } else {
        //4、执行增加操作
        var addResult = new ManagerModel({
            username,
            password: md5(password),
            email,
            mobile,
            addtime: getUnix()
        })
        await addResult.save()
        res.redirect("/admin/manager")
    }

})

module.exports = router;