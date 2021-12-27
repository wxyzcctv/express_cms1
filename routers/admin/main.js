const express = require('express')
const router = express.Router();
const FocusModel = require('../../model/focusModel');
const ManagerModel = require("../../model/managerModel");
const NavModel = require('../../model/navModel');

const appModel = {
    FocusModel,
    ManagerModel,
    NavModel
}

router.get('/', async (req,res)=>{
    res.render('admin/main/index.html')
})

router.get('/welcome', (req,res)=>{
    res.send('欢迎来到后台管理中心')
})

router.get('/changeStatus', async (req,res)=>{
    //1、获取要修改数据的id
    //2、我们需要查询当前数据的状态 
    //3、修改状态   0 修改成 1    1修改成0

    // es6里面的属性名表达式
    // var aaa="username"
    // var obj={
    //     [aaa]:"张三"
    // }
    // console.log(obj)


    let id = req.query.id;
    let model = req.query.model + "Model";
    let field = req.query.field;
    let obj = {};
    let result = await appModel[model].find({"_id":id});
    if (result.length > 0) {
        result[0][field] === 1 ? obj = {[field]:0} : obj = {[field]:1};
        await appModel[model].updateOne({"_id":id},obj);        
        res.send({
            success: true,
            message: '修改状态成功'
        });
    }else{
        res.send({
            success: true,
            message: '修改状态失败'
        });
    }
})

module.exports = router;