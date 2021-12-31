const express = require('express');
const router = express.Router();
const mongoose = require("../../model/core");
const ArticleCateModel = require('../../model/articleCateModel');
const { getUnix } = require('../../model/tools');

router.get('/', async (req,res)=>{
    // 使用表关联的方式获取树形结构
    let articleCateList = await ArticleCateModel.aggregate([        
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match:{
                pid:"0"
            }
        },
    ]);
    res.render("admin/articleCate/index.html",{
        articleCateList
    })
})

router.get('/add', async (req,res)=>{
    // 获得定级分类
    let topCateList = await ArticleCateModel.find({pid:"0"});
    res.render('admin/articleCate/add.html', {
        cateList: topCateList
    })
})

router.post("/doAdd", async (req, res) => {
    if (req.body.pid !== "0") {
        req.body.pid = mongoose.Types.ObjectId(req.body.pid)
    }
    req.body.add_time = getUnix();
    let result = new ArticleCateModel(req.body);
    await result.save();
    res.redirect(`/${req.app.locals.adminPath}/articleCate`)
})

router.get('/edit', async (req,res)=>{
    let id = req.query.id;
    let result = await ArticleCateModel.find({"_id":id});
    // 获得定级分类
    let topCateList = await ArticleCateModel.find({pid:"0"});
    res.render('admin/articleCate/edit.html',{
        articleCateList: result[0],
        cateList: topCateList
    })
})

router.post("/doEdit", async (req, res) => {
    try {
        if (req.body.pid !== "0") {
            req.body.pid = mongoose.Types.ObjectId(req.body.pid)
        }
        req.body.status = Number(req.body.status);
        req.body.sort = Number(req.body.sort);
        let result = await ArticleCateModel.updateOne({'_id': req.body.id},req.body);
        res.redirect(`/${req.app.locals.adminPath}/articleCate`);
    } catch (error) {
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/articleCate/edit?id=${req.body.id}`,
            "message": "修改数据失败"
        })
    }
})

router.get('/delete', async (req,res)=>{
    let id = req.query.id;
    let result = await ArticleCateModel.deleteOne({"_id":id});    
    if (result.ok) {
        res.render('admin/public/success.html', {
            message: "删除成功",
            redirectUrl: `/${req.app.locals.adminPath}/articleCate/`
        })        
    } else {
        res.render('admin/public/error.html', {
            message: "删除失败",
            redirectUrl: `/${req.app.locals.adminPath}/articleCate/`
        })
    }
    // 考虑有子分类的情况不让删

    // let subReuslt=await ArticleCateModel.find({"pid":mongoose.Types.ObjectId(id)});
    // if(subReuslt.length>0){
    //     res.render("admin/public/error.html", {
    //         "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
    //         "message": "当前分类没法删除，请删除下面的子分类后重试"
    //     })
    // }else{
    //     await ArticleCateModel.deleteOne({ "_id": id });
    //     res.render("admin/public/success.html", {
    //         "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
    //         "message": "删除数据成功"
    //     })
    // }
})
module.exports = router