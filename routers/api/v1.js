const express = require('express')
const router = express.Router();
const ArticleCateModel = require('../../model/articleCateModel');

router.get('/',(req,res)=>{
    res.send('api接口v1')
})

router.get('/focus',(req,res)=>{
    //只支持ajax请求
    // res.send({
    //     "success":true,
    //     "message":"获取数据成功"
    // })

    // res.json({
    //     "success":true,
    //     "message":"获取数据成功"
    // })

    //支持jsonp 以及ajax请求
    res.jsonp({
        "success":true,
        "message":"获取数据成功"
    })
})

router.get('/articleCate', async (req,res)=>{
    let resultList = await ArticleCateModel.find({});
    res.json({
        "success":true,
        "message":"获取数据成功",
        result: resultList
    })
})

router.post('/doLogin',(req,res)=>{
    let body=req.body;
    console.log(body)
    res.json({
        "success":true,
        "message":"登录成功",
        "result":body
    })
})

router.put('/editUser',(req,res)=>{
    let body=req.body;
    console.log(body)
    res.json({
        "success":true,
        "message":"修改用户成功",
        "result":body
    })
})

router.delete('/deleteUser',(req,res)=>{
    let id=req.query.id;
    let body=req.body;
    console.log(body)
    res.json({
        "success":true,
        "message":"删除用户成功",
        "result":body,
        "id": id
    })
})

module.exports = router;