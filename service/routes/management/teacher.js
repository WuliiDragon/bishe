var express = require('express');
var router = express.Router();
var mysqlDB = require('../../lib/SQLDB')

router.post('/loadAllTeacher', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
    count: 0
  };

  const currPage = req.body.page
  const currPageSize = req.body.pageSize

  var start = (currPage - 1) * currPageSize;
  var end = currPageSize;
  var count = 0
  mysqlDB.query('select count(*) as count from teacher;', [], function (result, fields) {
    count = result[0].count
    if (result[0].count > 0) {
      mysqlDB.query('select * from teacher order by t_num desc limit ?, ?', [start, end], function (result, fields) {
        respone.data = result
        respone.count = count
        respone.msg = "获取成功"
        resp.send(mysqlDB.jsonWrite(resp, respone))
      });
    } else {
      respone.msg = '无学生数据'
      respone.status = 902
      resp.send(respone)
    }
  });
});

//根据学号获取某个学生所有的信息
router.post('/loadTeacherInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      teacher: {}
    },
  };
  const t_num = req.body.t_num
  const par = [t_num]
  mysqlDB.query('select t_id,t_name,t_num from teacher where t_num = ?', par, function (result, fields) {

    if (result.length > 0) {

      result = JSON.stringify(result[0]);
      respone.data.teacher = JSON.parse(result);//把results字符串转为json对象

      respone.msg = "获取成功"
      respone.status = 901
      resp.send(respone)

    } else {
      respone.msg = '获取失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});


//上传老师信息
router.post('/PostTeacherInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      student: {}
    },
  };
  const teacher = req.body.formData
  const par = [teacher.t_name, teacher.t_num, teacher.t_id]
  mysqlDB.query('REPLACE  INTO teacher SET t_name = ? ,t_num = ? , t_id = ?', par, function (result, fields) {
    if (result.affectedRows > 0) {
      respone.msg = "提交成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '获取失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});
module.exports = router;
