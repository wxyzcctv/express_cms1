const express = require('express');
const router = express.Router();
const { multer } = require('../../model/tools')

router.get('/', async (req,res)=>{    
    res.render("admin/article/index.html",{})
})

router.get('/add', async (req,res)=>{    
    res.render("admin/article/add.html",{})
})

router.post('/doUploadImage',multer().single('file'), (req,res)=>{
    var imgSrc = req.file ? req.file.path.substr(7) : "";

    // {link: 'path/to/image.jpg'}.
    res.send({
        link:"/"+imgSrc
    })
})

module.exports = router