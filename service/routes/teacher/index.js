var express = require('express');
var router = express.Router();
var mysqlDB = require('../../lib/SQLDB')

const fs = require('fs');
const xlsx = require('better-xlsx');

var path = require('path');


router.post('/teacher_login_', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };

  const data = req.body;
  const t_num = data.t_num;
  const t_pass = data.t_pass;


  const par = [t_num, t_pass]
  mysqlDB.query('select t_id,t_num,t_name from teacher where t_num = ? AND t_pass = ?', par, function (result, error, fields) {
    if (result.length > 0) {
      result = JSON.stringify(result[0]);
      respone.data = JSON.parse(result);
      respone.status = 901
      resp.send(respone);
    } else {
      console.log('')
      respone.status = 902
      respone.msg = '教师登录失败 账户密码错误'

      resp.send(respone);
    }
  });
});


router.post('/loadClassInfoByTeacher', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };

  const sql = 'SELECT *FROM (SELECT tcs.tcs_id ,tcs.teacher_id, tcs.sub_id,tcs.class_id ,s.sub_name,class_name\n' +
    'FROM teacher t, subject s, teacher_class_subject tcs,class\n' +
    'WHERE t.t_id = tcs.teacher_id AND tcs.class_id = class.class_id AND tcs.sub_id = s.sub_id) temp' +
    ' WHERE temp.teacher_id=?'
  const data = req.body;
  const t_id = data.t_id;
  const par = [t_id]
  mysqlDB.query(sql, par, function (result, error, fields) {
    if (result.length > 0) {
      result = JSON.stringify(result);
      respone.data = JSON.parse(result);

      respone.status = 901
      resp.send(respone);
    } else {
      console.log('')
      respone.status = 902
      respone.msg = '获取失败'

      resp.send(respone);
    }
  });
});

router.post('/loadAllScore', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };
  var sql = 'SELECT *\n' +
    'FROM score AS sc, (SELECT\n' +
    '                     stu.id,\n' +
    '                     stu.s_name\n' +
    '                   FROM student AS stu\n' +
    '                   WHERE class_id = ?) AS re\n' +
    'WHERE sc.student_id = re.id AND sc.subject_id = ?'
  const data = req.body;
  const class_id = data.class_id;
  const sub_id = data.sub_id;
  const par = [class_id, sub_id]
  mysqlDB.query(sql, par, function (result, error, fields) {
    if (result.length >= 0) {

      result = JSON.stringify(result);
      respone.data = JSON.parse(result);
      respone.status = 901
      resp.send(respone);
    } else {
      respone.status = 902
      respone.msg = '获取失败'
      resp.send(respone);
    }
  });
});


router.post('/loadAllStudentByClass', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };
  var sql = 'SELECT id,s_name FROM student WHERE class_id = ?'
  const data = req.body;
  const class_id = data.class_id;
  const par = [class_id]
  mysqlDB.query(sql, par, function (result, error, fields) {
    if (result.length > 0) {

      result = JSON.stringify(result);
      respone.data = JSON.parse(result);
      respone.status = 901
      resp.send(respone);
    } else {
      respone.status = 902
      respone.msg = '获取失败'
      resp.send(respone);
    }
  });
});


router.post('/postStudentScore', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };

  const data = req.body.data;
  var pars = []

  for (var i = 0; i < data.length; i++) {
    var par = []
    par[0] = data[i].id
    par[1] = data[i].sub_id
    par[2] = data[i].grade
    par[3] = data[i].teacher_id
    par[4] = data[i].score_id
    pars[i] = par
  }
  // REPLACE  INTO student SET s_name = ? ,s_num = ? , academy_id = ? ,major_id = ? ,class_id=?, id = ?'
  // 'REPLACE INTO score   SET student_id = ? , subject_id = ?,grade = ?,teacher_id = ?'
  mysqlDB.query('REPLACE INTO score (student_id,subject_id,grade,teacher_id,score_id) VALUES ?', [pars], function (result, error, fields) {
    if (result.affectedRows > 0) {
      respone.status = 901
      resp.send(respone);
    } else {
      respone.status = 902
      respone.msg = '获取失败'
      resp.send(respone);
    }
  });
});


router.post('/getScoresBySubject', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {},
  };


  const subject_id = req.body.subject_id;
  var pars = [subject_id]

  mysqlDB.query('SELECT student_id, grade FROM score WHERE subject_id = ?', [pars], function (result, error, fields) {


    if (result.length > 0) {
      result = JSON.stringify(result);
      respone.data = JSON.parse(result);
      respone.status = 901
      resp.send(respone);
    } else {
      respone.status = 902
      respone.msg = '获取失败'
      resp.send(respone);
    }
  });
});


router.post('/getExcel', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    fileUrl: '',

  };
  var sql = 'SELECT *\n' +
    'FROM score AS sc, (SELECT\n' +
    '                     stu.s_num,' +
    '                     stu.id,\n' +
    '                     stu.s_name\n' +
    '                   FROM student AS stu\n' +
    '                   WHERE class_id = ?) AS re\n' +
    'WHERE sc.student_id = re.id AND sc.subject_id = ?'
  const data = req.body;
  const class_id = data.class_id;
  const sub_id = data.sub_id;
  const par = [class_id, sub_id]
  mysqlDB.query(sql, par, async function (result, error, fields) {
    if (result.length >= 0) {
      result = JSON.stringify(result);
      var allScore = JSON.parse(result);


      var reName = await createExcel(allScore, class_id, sub_id)
      respone.fileUrl = reName
      respone.status = 901
      resp.send(respone);
    } else {
      respone.status = 902
      respone.msg = '获取失败'
      resp.send(respone);
    }
  });
});


async function createExcel(data, class_id, sub_id) {

  const file = new xlsx.File();
  const sheet = file.addSheet('Sheet1');
  {
    //标题
    const titleRow = sheet.addRow();
    const titleCell = titleRow.addCell();
    titleCell.value = '西安文理学院成绩单';
    titleCell.hMerge = 10;
    // titleCell.vMerge = 0;
    const style = new xlsx.Style();
    style.fill.patternType = 'solid';
    style.align.h = 'center';
    style.align.v = 'center';
    titleCell.style = style;
  }


  {
    //标题
    const Row = sheet.addRow();
    const Cell1 = Row.addCell();
    Cell1.value = '学院：信息工程学院';
    Cell1.hMerge = 2;


    for (let i = 0; i < 2; i++) {
      const cells = Row.addCell();
    }

    const Cell2 = Row.addCell();
    Cell2.value = '班级：软件工程一班';
    Cell2.hMerge = 2;


    for (let i = 0; i < 2; i++) {
      const cells = Row.addCell();
    }
    const Cell3 = Row.addCell();
    Cell3.value = '课程名称：计算机组成原理';
    Cell3.hMerge = 4;
    for (let i = 0; i < 3; i++) {
      const cells = Row.addCell();
    }
    const style = new xlsx.Style();
    style.align.h = 'center';
    style.align.v = 'center';
    Cell1.style = style;
    Cell2.style = style;
    Cell3.style = style;
  }

  for (let i = 0; i < data.length; i++) {
    const studentRow = sheet.addRow();
    const s_num = studentRow.addCell();
    s_num.value = data[i].s_num

    const s_name = studentRow.addCell();
    s_name.value = data[i].s_name

    const s_grade = studentRow.addCell();
    s_grade.value = data[i].grade

  }

  var class_name = await queryClassById(class_id)
  var sub_name = await querySubjectById(sub_id)


  saveName = 'service/source/' + class_name + '' + sub_name + '成绩' + '.xlsx'
  reName = class_name + '' + sub_name + '成绩' + '.xlsx'

  //
  // saveName = 'service/source/' + class_id + '_' + sub_id + '成绩' + '.xlsx'
  // reName = class_id + '_' + sub_id + '.xlsx'

  return new Promise(function (resolve, reject) {
    file
      .saveAs()
      .pipe(fs.createWriteStream(saveName))
      .on('finish', () => {
          resolve(reName);
        },
      );
    // reject(error);

  });
}

async function queryClassById(class_id) {

  sql = 'SELECT class.class_name\n' +
    'FROM class\n' +
    'WHERE class_id = ?'

  par = [class_id]

  return new Promise(function (resolve, reject) {
    mysqlDB.query(sql, par, async function (result, error, fields) {
      resolve(result[0].class_name)
    });
  });
}

async function querySubjectById(subject_id) {
  sql = '\n' +
    'SELECT sub_name\n' +
    'FROM subject\n' +
    'WHERE sub_id = ?;'

  par = [subject_id]

  return new Promise(function (resolve, reject) {
    mysqlDB.query(sql, par, async function (result, error, fields) {
      resolve(result[0].sub_name)
    });
  });

}


module.exports = router;
