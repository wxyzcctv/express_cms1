const express = require('express');
const url = require('url');
const router = express.Router();
const FocusModel = require('../model/focusModel');
const NavModel = require('../model/navModel');
const ArticleModel = require('../model/articleModel');
const ArticleCateModel = require('../model/articleCateModel');

const mongoose = require('../model/core');
const { formatTime,unixToDay,unixToYearAndMonth } = require('../model/tools');

router.use( async (req,res,next)=>{
    let pathName = url.parse(req.url).pathname;
    let navList = await NavModel.find({"position":2}).sort({"sort":-1});
    // 设置为全局变量
    req.app.locals.pathName = pathName;
    req.app.locals.navList = navList;
    req.app.locals.formatTime = formatTime;
    req.app.locals.unixToDay = unixToDay;
    req.app.locals.unixToYearAndMonth = unixToYearAndMonth;
    next();
})

router.get("/", async (req,res)=>{
    // 轮播图
    let focusList = await FocusModel.find({"type":1}).sort({'sort':1});
    // 展会新闻
    let topNewsList = await ArticleModel.find({'cid': mongoose.Types.ObjectId('5f718f951dc45e2698739df3')}, 'title').limit(4).sort({'sort':-1});
    // 推荐新闻
    let bestNewsList = await ArticleModel.find({'is_best':1}).limit(4).sort({'sort':-1});    
    res.render("default/index.html",{
        focusList,
        topNewsList,
        bestNewsList
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
 
 router.get("/services.html", async (req,res)=>{

    // 获取展会服务下面的信息 如果可以循环
    //    var result = await ArticleCateModel.aggregate([
    //       {
    //           $lookup: {
    //               from: "article",
    //               localField: "_id",
    //               foreignField: "cid",
    //               as: "articleList"
    //           }
    //       },
    //       {
    //           $match: {"pid":mongoose.Types.ObjectId("5f5702245aeb0720f8201df9")}
    //       },
    //       {
    //           $sort: { "sort": -1 }
    //       }
    //   ])

    // 资料下载
    let list1 = await ArticleModel.find({"cid":mongoose.Types.ObjectId('5f5633dcc0848423a8344dce')},'title link');
    // 票务信息
    let list2 = await ArticleModel.find({"cid":mongoose.Types.ObjectId('5f57022b5aeb0720f8201dfa')},'title link');
    // 交通信息
    let list3 = await ArticleModel.find({"cid":mongoose.Types.ObjectId('5f71965a1dc45e2698739df6')},'title link');
    // 平面图
    let list4 = await ArticleModel.find({"cid":mongoose.Types.ObjectId('5f71964c1dc45e2698739df5')},'title link');
    // 同期活动
    let list5 = await ArticleModel.find({"cid":mongoose.Types.ObjectId('5f8e48fadcfe8721ecea0450')},'title link');
    // 周边服务
    let list6 = await ArticleModel.find({"cid":mongoose.Types.ObjectId('5f7196621dc45e2698739df7')},'title link');
    res.render("default/services.html",{
        list1,
        list2,
        list3,
        list4,
        list5,
        list6
    })
 })
 router.get("/content_:id.html", async (req,res)=>{
    let id = req.params.id;
    let result = await ArticleModel.find({"_id":id});    
    res.render("default/news_content.html",{
        list: result[0]
    })
 })

module.exports = router;