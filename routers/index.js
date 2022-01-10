const express = require('express');
const url = require('url');
const router = express.Router();
const FocusModel = require('../model/focusModel');
const NavModel = require('../model/navModel');
const ArticleModel = require('../model/articleModel');
const ArticleCateModel = require('../model/articleCateModel');

const mongoose = require('../model/core');
const { formatTime } = require('../model/tools');

router.use( async (req,res,next)=>{
    let pathName = url.parse(req.url).pathname;
    let navList = await NavModel.find({"position":2}).sort({"sort":1});
    // 设置为全局变量
    req.app.locals.pathName = pathName;
    req.app.locals.navList = navList;
    req.app.locals.formatTime = formatTime;
    next();
})

router.get("/", async (req,res)=>{
    let focusList = await FocusModel.find({"type":1}).sort({'sort':1});
    res.render("default/index.html",{
        focusList
    })
 })
 
 router.get("/overview.html",(req,res)=>{
    res.render("default/overview.html")
 })
 
 router.get("/news.html", async (req,res)=>{
    let cid = req.query.cid || '';
    let page = req.query.page || 1;
    let pageSize = 3;
    let json = {};

    // 获取新闻中心的id值 5f561dae10fc462a0c265ec0
    if (cid) {
        json = Object.assign(json,{'cid': mongoose.Types.ObjectId(cid)});
    } else {
        let cateResult = await ArticleCateModel.find({'pid':mongoose.Types.ObjectId('5f561dae10fc462a0c265ec0')});
        let tempArr = [];
        cateResult.forEach((item)=>{
            tempArr.push(item._id)
        })
        json = Object.assign(json, {
            'cid': { $in: tempArr }
        })
    }

    let result = await ArticleModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "cid",
                foreignField: "_id",
                as: "cate"
            }
        },
        {
            $match: json
        },
        {
            $sort: { 'add_time': -1 }
        },
        {
            $skip: ( page - 1 ) * pageSize
        },
        {
            $limit: pageSize
        }
    ])

    let count = await ArticleModel.count(json);

    res.render("default/news.html",{
        newsList: result,
        totalPages: Math.ceil(count / pageSize),
        page: page,
        cid: cid
    })
 })
 
 router.get("/services.html",(req,res)=>{
    res.render("default/services.html")
 })
 router.get("/content_:id.html", async (req,res)=>{
    let id = req.params.id;
    let result = await ArticleModel.find({"_id":id});    
    res.render("default/news_content.html",{
        list: result[0]
    })
 })

module.exports = router;