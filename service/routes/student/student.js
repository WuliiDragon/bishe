var express = require('express');
var router = express.Router();
var mysqlDB = require('../../lib/SQLDB')

router.post('/student_login', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };

  const data = req.body.formData;
  const s_num = data.s_num;
  const s_pass = data.s_pass;


  const par = [s_num, s_pass]
  mysqlDB.query('select * from student where s_num = ? AND s_pass = ?', par, function (result, error, fields) {
    if (result.length > 0) {
      result = JSON.stringify(result[0]);
      respone.data = JSON.parse(result);
      respone.status = 901
      resp.send(respone);
    } else {
      console.log('')
      respone.status = 902
      respone.msg = '学生登录失败 学号密码错误'

      resp.send(respone);
    }
  });
});


router.post('/get_student_grade', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };

  const s_id = req.body.s_id;
  var sql = 'SELECT *\n' +
    'FROM (SELECT\n' +
    '        student_id,\n' +
    '        subject_id,\n' +
    '        grade\n' +
    '      FROM score\n' +
    '      WHERE student_id = ?) AS re, subject, student\n' +
    'WHERE re.subject_id = subject.sub_id AND re.student_id = student.id\n'

  const par = [s_id]
  mysqlDB.query(sql, par, function (result, error, fields) {
    if (result.length > 0) {
      result = JSON.stringify(result[0]);
      respone.data = JSON.parse(result);
      respone.status = 901
      resp.send(respone);
    } else {
      console.log('')
      respone.status = 902
      respone.msg = '学生登录失败 学号密码错误'

      resp.send(respone);
    }
  });
});
module.exports = router;
