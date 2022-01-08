const express = require('express');
const router = express.Router();
const SettingModel = require('../../model/settingModel');
const { multer } = require("../../model/tools");

router.get('/', async (req,res)=>{

    // 如下代码为添加测试数据
    // let obj = {
    //     site_title: '测试1',
    //     site_logo: '',
    //     site_keywords: '测试关键字',
    //     site_description: '测试描述',
    //     no_picture: '',
    //     site_icp: '备案信息',
    //     site_tel: '网站电话',
    //     search_keywords: '搜索关键词',
    //     tongji_code: '统计代码'
    // }
    // let result = new SettingModel(obj);
    // await result.save()

    let result = await SettingModel.find({});
    res.render("admin/setting/index.html",{
        settingList: result[0]
    })
})
var cpUpload = multer().fields([{ name: 'site_logo', maxCount: 1 }, { name: 'no_picture', maxCount: 1 }])
router.post('/doEdit',cpUpload, async (req,res)=>{
    let json = {};
    if (req.files.site_logo) {
        json = Object.assign(json,{'site_logo': req.files.site_logo[0].path.substr(7)});
    }
    if (req.files.no_picture) {
        json = Object.assign(json,{'no_picture': req.files.no_picture[0].path.substr(7)});
    }
    await SettingModel.updateMany({},Object.assign(json,req.body));
    
    res.render('admin/public/success.html', {
        message: "修改数据成功",
        redirectUrl:`/${req.app.locals.adminPath}/setting`
    })
})

module.exports = router