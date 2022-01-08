const express = require('express')

const router = express.Router();

router.get("/",(req,res)=>{
    res.render("default/index.html")
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