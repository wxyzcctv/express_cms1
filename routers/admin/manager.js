const express = require('express')
const router = express.Router();
const ManagerModel = require("../../model/managerModel");
const { md5, getUnix } = require('../../model/tools')

router.get('/', async (req, res) => {
    // 获得管理员列表数据
    let userList = await ManagerModel.find({});
    res.render('admin/manager/index.html', {
        userList
    })
})

router.get('/add', (req, res) => {
    // 访问新增管理员界面
    res.render('admin/manager/add.html')
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
            "redirectUrl": `/${req.app.locals.adminPath}/manager/add`,
            "message": "用户名不能为空"
        })
        return;
    }
    if (password.length < 6) {
        res.render('admin/public/error', {
            message: '密码长度不能小于6位',
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    }
    if (password != rpassword) {
        res.render('admin/public/error', {
            message: "密码和确认密码不一致",
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
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
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
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
        res.redirect(`/${req.app.locals.adminPath}/manager`)
    }
})

router.get('/edit', async (req, res) => {
    // 访问编辑管理员界面
    let id = req.query.id;
    let managerList = await ManagerModel.find({"_id":id});
    
    res.render('admin/manager/edit.html',{
        manager: managerList[0]
    })
})

router.post('/doEdit', async (req,res) => {
    // 1、获取表单提交的数据
    let id = req.body.id;
    let password = req.body.password;
    let rpassword = req.body.rpassword;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let status = req.body.status;
    let params;

    // 2、验证数据是否合法
    if (password.length > 0) {
        // 修改密码并修改其他信息
        if (password.length < 6) {
            res.render('admin/public/error', {
                message: '密码长度不能小于6位',
                redirectUrl: `/${req.app.locals.adminPath}/manager/add`
            })
            return;
        }
        if (password != rpassword) {
            res.render('admin/public/error', {
                message: "密码和确认密码不一致",
                redirectUrl: `/${req.app.locals.adminPath}/manager/add`
            })
            return;
        }
        params = {
            "email": email,
            "mobile": mobile,
            "password": md5(password),
            "status": status
        }
    } else {
        // 不修改密码，只修改其他信息
        params = {
            "email": email,
            "mobile": mobile,
            "status": status
        }
    }
    let result = await ManagerModel.updateOne({"_id":id},params)
    if (result.ok) {
        res.render('admin/public/success', {
            message: '管理员信息修改成功',
            redirectUrl: `/${req.app.locals.adminPath}/manager`
        })
    }else{
        res.render('admin/public/error', {
            message: '管理员信息修改失败',
            redirectUrl: `/${req.app.locals.adminPath}/manager`
        })
    }
})
router.get('/delete', async (req,res)=>{
    let id = req.query.id;
    let result = await ManagerModel.deleteOne({"_id":id});
    if (result.ok) {
        res.render('admin/public/success.html', {
            message: "删除成功",
            redirectUrl: `/${req.app.locals.adminPath}/manager/`
        })        
    } else {
        res.render('admin/public/error.html', {
            message: "删除失败",
            redirectUrl: `/${req.app.locals.adminPath}/manager/`
        })
    }
})

module.exports = router;