"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require("fs");
var path = require('path');
var jwt = require('jsonwebtoken');
var projectPath = path.resolve(__dirname, '../../Zorro_Server');
var checkSubjectPath = function (subjectPath) {
    return fs.existsSync(subjectPath);
};
var checkChapterPath = function (chapterPath) {
    return fs.existsSync(chapterPath);
};
var verifyToken = function (r) {
    var receiveToken = r.get('Authorization');
    var pass = false;
    jwt.verify(receiveToken, 'heiheihei', function (err, decoded) {
        console.log(decoded);
        if (!err) {
            pass = true;
        }
    });
    return pass;
};
router.get('/getPic', function (req, res) {
    if (verifyToken(req)) {
        var Result = { success: true, message: null, result: null };
        res.status(200).send(Result);
    }
    else {
        res.status(403).send({ res: '用户授权错误,请重新登录!' });
    }
});
router.post('/upload', function (req, res) {
    var typeCheck = req.is('multipart/form-data');
    var receiveToken = req.get('Authorization');
    if (typeCheck) {
        if (receiveToken) {
            jwt.verify(receiveToken, 'heiheihei', function (err, decoded) {
                console.log(decoded);
                if (err) {
                    res.status(407).send({ res: '授权错误!' });
                    res.end();
                }
                else {
                    var form = new multiparty.Form({ uploadDir: projectPath + "/public/upload" });
                    form.parse(req, function (err, fields, files) {
                        if (files) {
                            console.log('get file');
                        }
                        if (fields) {
                            // fs.renameSync(files.file[0].path,path.resolve(__dirname,'../public/upload/'+chapter+'/'+files.file[0].originalFilename));
                            var arr = fields.targetfile[0].toString().split(',');
                            var subject = arr[0];
                            var chapter = arr[1];
                            //console.log(arr);
                            var subjectPath = projectPath + "/public/upload/" + subject;
                            var chapterPath = projectPath + "/public/upload/" + subject + "/" + chapter;
                            // let ifExsitSubject=fs.existsSync(subjectPath);
                            if (!checkSubjectPath(subjectPath)) {
                                try {
                                    fs.mkdirSync(subjectPath);
                                    if (checkSubjectPath(subjectPath)) {
                                        try {
                                            fs.mkdirSync(chapterPath);
                                            if (checkChapterPath(chapterPath)) {
                                                //files.file[0].originalFilename
                                                fs.renameSync(files.file[0].path, chapterPath + "/" + files.file[0].originalFilename);
                                            }
                                        }
                                        catch (err) { }
                                    }
                                }
                                catch (err) { }
                            }
                            else {
                            }
                            //console.log(ifExsitSubject);
                            //console.log(ifExsitChapter);
                        }
                        res.end();
                    });
                }
            });
        }
        else {
            res.status(403).send({ res: '未授权，请先登录!' });
        }
    }
    else {
        res.status(400).send({ res: '类型错误!' });
    }
    res.end();
});
router.post('/login', function (req, res) {
    var userName = req.body.userName;
    var password = req.body.password;
    if (userName == '10086' && password == '123123') {
        var older_token = jwt.sign({ userName: userName, iat: Math.floor(Date.now() / 1000) - 30 }, 'heiheihei');
        var r = { success: true, message: null, result: older_token };
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);
        var receiveToken = req.get('Authorization');
        console.log(receiveToken);
        res.send(r);
    }
    else {
        var r = { success: false, message: '用户名或密码错误！', result: null };
    }
    res.end();
});
var ResponseModel = (function () {
    function ResponseModel() {
    }
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;
module.exports = router;
