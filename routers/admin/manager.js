const express = require('express')
const router = express.Router();
const ManagerModel = require("../../model/managerModel");

router.get('/', async (req,res)=>{
    let result = await ManagerModel.find({});

    console.log(result);

    res.send('管理员界面')
})

router.get('/add', (req,res)=>{
    let manager = new ManagerModel({
        username: '张三',
        password: '12313445'
    })
    manager.save((err)=>{
        if (err) {
            return console.log(err);
        }
        console.log('添加管理员成功');
    });
    res.send('添加管理员')
})

module.exports = router;