const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
//   });  
var data ={
    "name": "smith",
    "age": 28,
    "sex": "男",
    "school": {
        "sname": "南京大学",
        "address": "南京市鼓楼区汉口路22号"
    }
}
app.get('/info',function (req, res) {
    console.log(111111111111,req.query)
    res.json(data)
})

app.post('/test',function (req, res) {
    console.log(2222222222,req.body)
    res.json(data)
})

app.delete('/delete',function (req, res) {
    console.log(33333333,req.body)
    res.json(data)
})
app.listen(80,function (req, res) {
    console.log("success")
})