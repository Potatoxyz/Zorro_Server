var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require("fs");
var path = require('path');
router.post('/upload', function (req, res) {
    //console.log(path.resolve(__dirname,'get-upload'));
    var form = new multiparty.Form({ uploadDir: path.resolve(__dirname, '../public/upload/') });
    var result;
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        }
        if(fields){
            console.log(fields);
        }
        //分两种情况，一: 单个提交方式二：formData提交即全部提交
        if (files.file) {
            console.log(files.file);
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
                result={response:'上传成功啦！',error:false,message:null};
                res.send(result);
                res.end();
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
    res.type('json');
});
module.exports = router;
