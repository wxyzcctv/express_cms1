const express = require('express')
const router = express.Router();
const ManagerModel = require("../../model/managerModel");

router.get('/', async (req,res)=>{
    res.render('admin/manager/index.html')
})

router.get('/add', (req,res)=>{
    res.render('admin/manager/add.html')
})

router.get('/edit', (req,res)=>{
    res.render('admin/manager/edit.html')
})

module.exports = router;