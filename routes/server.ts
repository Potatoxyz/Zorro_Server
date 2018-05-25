var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require("fs");
var path = require('path');
var jwt = require('jsonwebtoken');
var projectPath=path.resolve(__dirname,'../../Zorro_Server');
var Data=require('../data/user.json');
var checkSubjectPath=function (subjectPath) {
    return fs.existsSync(subjectPath);
};
var checkChapterPath=function (chapterPath) {
    return fs.existsSync(chapterPath);
};
var verifyToken=function (r) {
    let receiveToken = r.get('Authorization');
    var pass=false;
    jwt.verify(receiveToken, 'heiheihei', function (err, decoded) {
        console.log(decoded);
        if (!err) {pass=true;}
    });
    return pass;
};
router.get('/getPic', function (req, res){
    if(verifyToken(req)){
        let Result:ResponseModel={success:true,message:null,result:null};
        res.status(200).send(Result);
    }
    else{
        res.status(403).send({res: '用户授权错误,请重新登录!'});
    }
});
router.post('/upload', function (req, res) {
    let typeCheck = req.is('multipart/form-data');
    let receiveToken = req.get('Authorization');
    if (typeCheck) {
        if (receiveToken) {
            jwt.verify(receiveToken, 'heiheihei', function (err, decoded) {
                console.log(decoded);
                if (err) {
                    res.status(407).send({res: '授权错误!'});
                    res.end();
                }
                else {
                    var form = new multiparty.Form({uploadDir: `${projectPath}/public/upload`});
                    form.parse(req, function (err, fields, files) {
                        if (files) {
                            console.log('get file');
                        }
                        if (fields) {
                            console.log(fields.subject[0].toString());
                            console.log(fields.chapter[0].toString());
                            console.log(fields.des[0].toString());
                            let subject=fields.subject[0].toString();
                            let chapter=fields.chapter[0].toString();
                            let des=fields.des[0].toString();
                            let subjectPath=`${projectPath}/public/upload/${subject}`;
                            let chapterPath=`${projectPath}/public/upload/${subject}/第${chapter}章`;
                                if(!checkSubjectPath(subjectPath)){
                                try{
                                    fs.mkdirSync(subjectPath);
                                    if(checkSubjectPath(subjectPath)){
                                        try{
                                            fs.mkdirSync(chapterPath);
                                            if(checkChapterPath(chapterPath)){
                                                //files.file[0].originalFilename
                                               fs.renameSync(files.file[0].path,`${chapterPath}/${files.file[0].originalFilename}`);
                                            }
                                        }catch (err){}
                                    }
                                }catch(err) {}
                            }
                            else{

                                }
                        }
                        res.end()
                    });
                }
            });
        }
        else {
            res.status(403).send({res: '未授权，请先登录!'});
        }
    }
    else {
        res.status(400).send({res: '类型错误!'});
    }
    res.end();
});
router.post('/login', function (req, res) {
    let data={
        userName:req.body.userName,
        password:req.body.password,
        role:req.body.role
    };
    var r:ResponseModel={success:true,message:null,result:null};
    var index:number=Data.findIndex(v=>v.userName==data.userName&&v.password==data.password);
    var index1:number=Data.findIndex(v=>v.userName==data.userName);
    console.log(Data[index]);
    console.log(Data[index1]);
    if(index==-1){
        console.log("用户名或密码不正确！");
        res.status(400).send({message:"用户名或密码不正确！",result:null});
        res.end();
    }
    else if(index1==-1){
        res.status(400).send({message:"用户名不存在！",result:null});
        console.log("用户名不存在！");
        res.end();
    }
    else{
        r.success=true;r.message=Data[index].role;
        r.result = jwt.sign({ foo: 'bar' }, 'heiheihei');
        console.log("成功！");
        res.send(r);
        res.end();
    }

    // if (err.message) {res.send(err);res.end(); console.log("失败！")}
    // else {res.send(r);res.end(); console.log("成功！") }
});
router.post('/register', function (req, res) {
    let data={
        userName:req.body.userName,
        password:req.body.password
    };
    var addUser=function () {
        fs.writeFileSync(projectPath+"/data/user.json",JSON.stringify(Data),err => {
            if (err) throw err;
        })
    };
    var r:ResponseModel={success:true,message:"注册成功！",result:null};
    var index=Data.findIndex(v=>v.userName==data.userName);
    console.log(index);
    if(index==-1){
        Data.push(data);
        console.log(JSON.stringify(Data));
        addUser();
        console.log('用户写入成功');
        res.send(r);
        res.end();
    }
    else{
        let r:ResponseErrorModel={message:'用户名已经存在！',result:null};
        res.status(400).send(r);
        res.end();
    }

});
export class ResponseModel {
    success: boolean;
    message: string;
    result: any;
}
export class ResponseErrorModel{
    message:string;
    result:any;
}

module.exports = router;