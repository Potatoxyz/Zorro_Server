"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require("fs");
var path = require('path');
var jwt = require('jsonwebtoken');
var projectPath = path.resolve(__dirname, '../../Zorro_Server');
var Data = require('../data/user.json');
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
                            console.log(fields.subject[0].toString());
                            console.log(fields.chapter[0].toString());
                            console.log(fields.des[0].toString());
                            var subject = fields.subject[0].toString();
                            var chapter = fields.chapter[0].toString();
                            var des = fields.des[0].toString();
                            var subjectPath = projectPath + "/public/upload/" + subject;
                            var chapterPath = projectPath + "/public/upload/" + subject + "/\u7B2C" + chapter + "\u7AE0";
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
    var data = {
        userName: req.body.userName,
        password: req.body.password,
        role: req.body.role
    };
    var r = { success: true, message: null, result: null };
    var index = Data.findIndex(function (v) { return v.userName == data.userName && v.password == data.password; });
    var index1 = Data.findIndex(function (v) { return v.userName == data.userName; });
    console.log(Data[index]);
    console.log(Data[index1]);
    if (index == -1) {
        console.log("用户名或密码不正确！");
        res.status(400).send({ message: "用户名或密码不正确！", result: null });
        res.end();
    }
    else if (index1 == -1) {
        res.status(400).send({ message: "用户名不存在！", result: null });
        console.log("用户名不存在！");
        res.end();
    }
    else {
        r.success = true;
        r.message = Data[index].role;
        r.result = jwt.sign({ foo: 'bar' }, 'heiheihei');
        console.log("成功！");
        res.send(r);
        res.end();
    }
    // if (err.message) {res.send(err);res.end(); console.log("失败！")}
    // else {res.send(r);res.end(); console.log("成功！") }
});
router.post('/register', function (req, res) {
    var data = {
        userName: req.body.userName,
        password: req.body.password
    };
    var addUser = function () {
        fs.writeFileSync(projectPath + "/data/user.json", JSON.stringify(Data), function (err) {
            if (err)
                throw err;
        });
    };
    var r = { success: true, message: "注册成功！", result: null };
    var index = Data.findIndex(function (v) { return v.userName == data.userName; });
    console.log(index);
    if (index == -1) {
        Data.push(data);
        console.log(JSON.stringify(Data));
        addUser();
        console.log('用户写入成功');
        res.send(r);
        res.end();
    }
    else {
        var r_1 = { message: '用户名已经存在！', result: null };
        res.status(400).send(r_1);
        res.end();
    }
});
var ResponseModel = /** @class */ (function () {
    function ResponseModel() {
    }
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;
var ResponseErrorModel = /** @class */ (function () {
    function ResponseErrorModel() {
    }
    return ResponseErrorModel;
}());
exports.ResponseErrorModel = ResponseErrorModel;
module.exports = router;
