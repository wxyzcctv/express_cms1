const express = require('express');
const router = express.Router();
const url = require('url')
const NavModel = require('../../model/navModel');
const { getUnix } = require("../../model/tools");

router.get('/', async (req,res)=>{
    let navList = await NavModel.find({});
    res.render("admin/nav/index.html",{
        navList
    })
})

router.get('/add', (req,res)=>{
    res.render('admin/nav/add.html')
})

router.post("/doAdd", async (req, res) => {
    // 将获取的表单提交数据直接存入数据库中
    try {        
        var result = new NavModel(Object.assign(req.body, { add_time: getUnix() }))
        await result.save()
        res.render("admin/public/success.html", {
            "redirectUrl": "/admin/nav",
            "message": "增加导航成功"
        })
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": "/admin/nav/add",
            "message": "增加导航失败"
        })
    }    
})

router.get('/edit', async (req,res)=>{
    let id = req.query.id;
    let result = await NavModel.find({"_id":id});
    res.render('admin/nav/edit.html',{
        nav: result[0]
    })
})

router.post("/doEdit", async (req, res) => {
    try {
        let result = await NavModel.updateOne({"_id": req.body.id},req.body)
        res.render("admin/public/success.html", {
            "redirectUrl": "/admin/nav",
            "message": "修改导航成功"
        })
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": "/admin/nav/add",
            "message": "修改导航失败"
        })
    }
})

router.get('/delete', async (req,res)=>{
    let id = req.query.id;
    let result = await NavModel.deleteOne({"_id":id});
    if (result.ok) {
        res.render('admin/public/success.html', {
            message: "删除成功",
            redirectUrl: '/admin/nav/'
        })        
    } else {
        res.render('admin/public/error.html', {
            message: "删除失败",
            redirectUrl: '/admin/nav/'
        })
    }
})
module.exports = router