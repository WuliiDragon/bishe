var express = require('express');
var router = express.Router();
var mysqlDB = require('../../lib/SQLDB')


router.post('/root_login', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };

  const formData = req.body.formData;
  const r_id = formData.r_id;
  const r_pass = formData.r_pass;


  const par = [r_id, r_pass]
  mysqlDB.query('select * from root_user where r_id = ? AND r_pass = ?', par, function (result, error, fields) {
    if (result.length > 0) {
      respone.status = 901
      respone.msg = '管理登录成功'
      resp.send(respone);
    } else {
      respone.status = 902
      respone.msg = '管理员登录失败'
      resp.send(respone);
    }
  });
});



module.exports = router;
