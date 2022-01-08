const express = require('express');
const url = require('url');
const router = express.Router();
const FocusModel = require('../model/focusModel');
const NavModel = require('../model/navModel');

router.use( async (req,res,next)=>{
    let pathName = url.parse(req.url).pathname;
    let navList = await NavModel.find({"position":2}).sort({"sort":1});
    // 设置为全局变量
    req.app.locals.pathName = pathName;
    req.app.locals.navList = navList;
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
 
 router.get("/news.html",(req,res)=>{
    res.render("default/news.html")
 })
 
 router.get("/services.html",(req,res)=>{
    res.render("default/services.html")
 })
 router.get("/contact.html",(req,res)=>{
    res.render("default/contact.html")
 })

module.exports = router;