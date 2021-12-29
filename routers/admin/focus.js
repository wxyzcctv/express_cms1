const express = require('express');
const fs = require('fs');
const router = express.Router();
const url = require('url')
const FocusModel = require('../../model/focusModel');
const { multer } = require("../../model/tools");

router.get('/', async (req,res)=>{
    let focusList = await FocusModel.find({});
    res.render("admin/focus/index.html",{
        focusList
    })
})

router.get('/add', (req,res)=>{
    res.render('admin/focus/add.html')
})

router.post("/doAdd", multer().single('focus_img'), async (req, res) => {
    // 将获取的表单提交数据直接存入数据库中
    let focus_img = req.file ? req.file.path.substring(7) : '';    
    try {
        let result = new FocusModel(Object.assign(req.body, { focus_img }))
        await result.save();
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/focus`,
            "message": "增加轮播成功"
        })
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/focus/add`,
            "message": "增加轮播失败"
        })
    }
})

router.get('/edit', async (req,res)=>{
    let id = req.query.id;
    let result = await FocusModel.find({"_id":id});
    res.render('admin/focus/edit.html',{
        focus: result[0]
    })
})

router.post("/doEdit", multer().single('focus_img'),  async (req, res) => {
    try {
        if (req.file) {  //更新了图片
            var focus_img = req.file ? req.file.path.substring(7) : "";
            await FocusModel.updateOne({ "_id": req.body.id }, Object.assign(req.body, { "focus_img": focus_img }))
        } else {
            await FocusModel.updateOne({ "_id": req.body.id }, req.body)
        }
        res.redirect(`/${req.app.locals.adminPath}/focus`);
    } catch (error) {
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/focus/edit?id=` + req.body.id,
            "message": "修改数据失败"
        })
    }
})

router.get('/delete', async (req,res)=>{
    let id = req.query.id;
    let resultList = await FocusModel.find({ "_id": id });
    let delResult = await FocusModel.deleteOne({ "_id": id });
    if (delResult.ok == 1 && delResult.n == 1) {
        if (resultList[0].focus_img) {
            fs.unlink("static/"+resultList[0].focus_img, (err) => {
                console.log(err);
            })
            res.render('admin/public/success.html', {
                message: "删除成功",
                redirectUrl: `/${req.app.locals.adminPath}/focus/`
            })
        }
    } else {
        res.render('admin/public/error.html', {
            message: "删除失败",
            redirectUrl: `/${req.app.locals.adminPath}/focus/`
        })
    }
})
module.exports = router