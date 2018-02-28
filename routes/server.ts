var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require("fs");
var path=require('path');
var jwt = require('jsonwebtoken');
router.post('/upload', function(req, res) {
   let typeCheck=req.is('multipart/form-data');
    console.log(typeCheck);
    let receiveToken=req.get('Authorization');
    if(typeCheck){
        if(receiveToken){
            jwt.verify(receiveToken, 'heiheihei', function(err, decoded) {
                console.log(decoded);
                if(err){
                    res.status(407).send({res:'授权错误!'});
                    res.end();
                }
                else{
                    var form = new multiparty.Form({uploadDir:path.resolve(__dirname,'../public/upload/')});
                    form.parse(req, function(err, fields, files) {
                        if(files){
                            console.log('get file');
                            res.end();
                        }
                    })
                }
            });
        }
        else {
            res.status(403).send({res:'未授权，请先登录!'});
        }
    }
    else{
        res.status(400).send({res:'类型错误!'});
    }
    res.end();
});
router.post('/login',function (req,res) {
    let userName=req.body.userName;
    let password=req.body.password;
    if(userName=='10086'&&password=='123123'){
        let older_token = jwt.sign({ userName: userName, iat: Math.floor(Date.now() / 1000) - 30 }, 'heiheihei');
        let r:ResponseModel={success:true,message:null,result:older_token};
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        let receiveToken=req.get('Authorization');
        console.log(receiveToken);
        res.send(r);
    }
    else{
        let r:ResponseModel={success:false,message:'用户名或密码错误！',result:null};
    }
    res.end();
});
export class ResponseModel{
    success:boolean;
    message:string;
    result:any;
}
module.exports = router;