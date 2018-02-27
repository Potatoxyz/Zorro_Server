"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require("fs");
var path = require('path');
var jwt = require('jsonwebtoken');
router.post('/upload', function (req, res) {
    var typeCheck = req.is('multipart/form-data');
    console.log(typeCheck);
    if (typeCheck) {
        var form = new multiparty.Form({ uploadDir: path.resolve(__dirname, '../public/upload/') });
        var result;
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
            }
            //分两种情况，一: 单个提交方式二：formData提交即全部提交
            if (files) {
                console.log('get file');
                // try {
                //     fs.renameSync(files.file[0].path,path.resolve(__dirname,'../public/upload/'+targetFile+'/'+files.file[0].originalFilename));
                //     result={result:true,message:'上传成功'};
                //     console.log('单个提交上传成功');
                //     res.send(result);
                //     res.end();
                // }
                // catch (err){
                //     result={result:false,message:err};
                //     console.log(err);
                //     res.send(result);
                //     res.end();
                // }
            }
            else {
                // console.log('all');
                // try{
                //     for(var key in files){
                //         //console.log(files[key][0].path);
                //         fs.renameSync(files[key][0].path,path.resolve(__dirname,'../public/upload/'+targetFile+'/'+files[key][0].originalFilename));
                //     }
                //     result={result:true,message:'上传成功'};
                //     console.log('all提交上传成功');
                //     res.send(result);
                //     res.end();
                // }
                // catch (err){
                //     result={result:false,message:'上传失败'};
                //     console.log(err);
                //     res.send(result);
                //     res.end();
                // }
            }
        });
    }
    else {
        res.status(404).send({ res: '类型错误!' });
    }
    res.end();
});
router.post('/login', function (req, res) {
    var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'heiheihei');
    var r = { success: true, message: null, result: older_token };
    console.log(req.body);
    console.log(req.query);
    console.log(req.params);
    var receiveToken = req.get('Authorization');
    console.log(receiveToken);
    res.send(r);
    res.end();
});
var ResponseModel = (function () {
    function ResponseModel() {
    }
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;
module.exports = router;
