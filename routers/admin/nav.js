const express = require('express');
const router = express.Router();
const NavModel = require('../../model/navModel');
const tools = require("../../model/tools");

router.get('/',(req,res)=>{
    res.send("导航列表")
})

router.get('/add',async (req,res)=>{
    let nav = new NavModel({
        title: '百度',
        url: 'www.baidu.com'
    });
    await nav.save();
    res.send('添加导航成功')
})

router.get('/edit',(req,res)=>{
    res.send('修改导航栏')
})

router.post("/doAdd",tools.multer().single("pic"), (req, res) => {
    //获取表单传过来的数据    
    res.send({
        body: req.body,
        file: req.file
    });
})
router.post("/doEdit", (req, res) => {
    res.send("执行修改")
})

module.exports = router