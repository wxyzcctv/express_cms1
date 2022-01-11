const express = require('express');
const router = express.Router();
const ArticleCateModel = require('../../model/articleCateModel');
const ArticleModel = require('../../model/articleModel');
const { multer,getUnix } = require('../../model/tools')

router.get('/', async (req,res)=>{
    let page = req.query.page || 1;
    let pageSize = 15;
    let json = {};

    // let articleList = await ArticleModel.find({}).skip((page-1)*pageSize).limit(pageSize);

    let articleList = await ArticleModel.aggregate([
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
            $sort: { "add_time": -1 }
        },
        {
            $skip: (page - 1) * pageSize
        },
        {
            $limit: pageSize
        }
    ])

    let count = await ArticleModel.count({});

    res.render("admin/article/index.html",{
        articleList,
        totalPages: Math.ceil(count / pageSize),
        page: page
    })
})

router.get('/add', async (req,res)=>{
    let articleCateList = await ArticleCateModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match: {
                pid:"0"
            }
        },
    ]);

    res.render("admin/article/add.html",{
        articleCateList
    })
})

router.post('/doAdd',multer().single('article_img'), async (req,res)=>{
    let imgSrc = req.file ? req.file.path.substr(7) : "";
    let result = new ArticleModel(Object.assign(req.body, { "article_img": imgSrc, 'add_time': getUnix() }))
    await result.save()
    res.redirect(`/${req.app.locals.adminPath}/article`);
})

router.get('/edit', async (req,res)=>{
    let id = req.query.id;
    let result = await ArticleModel.find({_id: id});
    let articleCateList = await ArticleCateModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match: {
                pid:"0"
            }
        },
    ]);
    res.render('admin/article/edit.html',{
        articleCateList,
        articleList: result[0],
    })
})

router.post('/doEdit', multer().single('article_img'), async (req,res)=>{
    try {
        if(req.file){
            let imgSrc = req.file ? req.file.path.substr(7) : "";
            await ArticleModel.updateOne({"_id":req.body.id},Object.assign(req.body,{"article_img":imgSrc}))
        }else{        
            await ArticleModel.updateOne({"_id":req.body.id},req.body)
        }
        res.redirect(`/${req.app.locals.adminPath}/article`);
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/article/edit?id=${req.body.id}`,
            "message": "修改数据失败"
        })
    }
})

router.get('/delete', async (req,res)=>{
    let id = req.query.id;
    let result = await ArticleModel.deleteOne({"_id":id});    
    if (result.ok) {
        res.render('admin/public/success.html', {
            message: "删除成功",
            redirectUrl: `/${req.app.locals.adminPath}/article/`
        })        
    } else {
        res.render('admin/public/error.html', {
            message: "删除失败",
            redirectUrl: `/${req.app.locals.adminPath}/article/`
        })
    }
})

router.post('/doUploadImage',multer().single('file'), (req,res)=>{
    var imgSrc = req.file ? req.file.path.substr(7) : "";
    // {link: 'path/to/image.jpg'}.
    res.send({
        link:"/"+imgSrc
    })
})

module.exports = router