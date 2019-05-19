var express = require('express');
var router = express.Router();
var mysqlDB = require('../../lib/SQLDB')

router.post('/student_list', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
    count: 0
  };
  const type = req.body.type
  const typeId = req.body.typeId

  const currPage = req.body.page
  const currPageSize = req.body.pageSize
  var start = (currPage - 1) * currPageSize;
  var end = currPageSize;
  var count = 0


  // 不同查询类型
  if (type === 0) {//直接获取所有

    mysqlDB.query('select count(*) as count from student;', [], function (result, fields) {
      count = result[0].count
      if (result[0].count > 0) {
        mysqlDB.query('select * from student order by s_num desc limit ?, ?', [start, end], function (result, fields) {
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

  } else if (type === 1) {//按照学院获取


    mysqlDB.query('select count(*) as count from student where academy_id = ?', [typeId], function (result, fields) {
      count = result[0].count
      if (result[0].count > 0) {

        mysqlDB.query('select * from student where academy_id = ? order by s_num desc limit ?, ? ', [typeId, start, end], function (result, fields) {
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
  } else if (type === 2) {//专业
    mysqlDB.query('select count(*) as count from student where major_id = ?', [typeId], function (result, fields) {
      count = result[0].count
      if (result[0].count > 0) {

        mysqlDB.query('select * from student where major_id = ? order by s_num desc limit ?, ? ', [typeId, start, end], function (result, fields) {
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
  }
});
router.get('/loadSelectInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      academy: [],
      major: [],
      class: []
    },

  };

  mysqlDB.query('select *from academy;', [], function (resultA, fields) {

    if (resultA.length > 0) {

      resultAA = JSON.stringify(resultA);
      respone.data.academy = JSON.parse(resultAA);//把results字符串转为json对象

      mysqlDB.query('select * from major;', [], function (resultB, fields) {
        if (resultB.length > 0) {
          resultBB = JSON.stringify(resultB);
          respone.data.major = JSON.parse(resultBB);//把results字符串转为json对象

          mysqlDB.query('select * from class;', [], function (resultsC, fields) {
            if (resultsC.length > 0) {

              resultsCC = JSON.stringify(resultsC);
              respone.data.class = JSON.parse(resultsCC);//把results字符串转为json对象
              respone.msg = "获取成功"
              respone.status = 901
              resp.send(respone)
            } else {

              respone.msg = '获取失败'
              respone.status = 902
              resp.send(respone)

            }

          });


        } else {
          respone.msg = '获取失败'
          respone.status = 902
          resp.send(respone)
        }
      });


    } else {
      respone.msg = '获取失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});
//上传学生数据
router.post('/PostStudentInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      student: {}
    },
  };
  const student = req.body.formData
  const par = [student.s_name, student.s_num, student.academy_id, student.major_id, student.class_id, student.id]
  mysqlDB.query('REPLACE  INTO student SET s_name = ? ,s_num = ? , academy_id = ? ,major_id = ? ,class_id=?, id = ?', par, function (result, fields) {

    console.log(result)
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

//删除学生数据
router.post('/DeleteStudentInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
  };
  const id = req.body.id

  const par = [id]
  mysqlDB.query('DELETE FROM student WHERE id =  ?', par, function (result, fields) {

    if (result.affectedRows === 1) {
      respone.msg = "删除成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '删除失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});


//根据学号获取某个学生所有的信息
router.post('/loadStudentInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      student: {}
    },
  };
  const s_num = req.body.s_num
  const par = [s_num]
  mysqlDB.query('select *from student where s_num = ?;', par, function (result, fields) {

    if (result.length > 0) {

      result = JSON.stringify(result[0]);
      respone.data.student = JSON.parse(result);//把results字符串转为json对象

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






module.exports = router;
