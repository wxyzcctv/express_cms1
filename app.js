const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
// 引入外部模块
const admin = require('./routers/admin');
const index = require('./routers/index');
const api = require('./routers/api');

const app = express()
// 配置模板引擎
app.engine('html',ejs.__express);
app.set("view engine","html")
//配置静态web目录
app.use(express.static("static"))
//配置第三方中间件获取post提交的数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//配置外部路由模块
app.use("/admin",admin)
app.use("/api",api)
app.use("/",index)

app.listen(3000, () => console.log(`Example app listening on port 3000!`))