var express = require('express');
var router = express.Router();
var mysqlDB = require('../../lib/SQLDB')
const fs = require('fs');
const xlsx = require('better-xlsx');

var path = require('path');

//上传学院信息
router.post('/PostAcademyInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
  };

  const academy = req.body.formData
  const par = [academy.academy_name, academy.academy_id]
  mysqlDB.query('REPLACE  INTO academy SET academy_name = ? , academy_id = ?', par, function (result, fields) {

    console.log(result)
    if (result.affectedRows > 0) {
      respone.msg = "提交成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '提交失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});

//上传专业系信息
router.post('/PostMajorInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
  };

  const major = req.body.formData
  const par = [major.major_id, major.major_name, major.academy_id]
  mysqlDB.query('REPLACE  INTO major SET major_id = ? , major_name = ?, academy_id = ?', par, function (result, fields) {

    console.log(result)
    if (result.affectedRows > 0) {
      respone.msg = "提交成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '提交失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});
//上传班级系信息
router.post('/PostClassInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
  };

  const classes = req.body.formData
  const par = [classes.major_id, classes.class_name, classes.class_id]
  mysqlDB.query('REPLACE  INTO class SET major_id = ? , class_name = ?, class_id = ?', par, function (result, fields) {

    console.log(result)
    if (result.affectedRows > 0) {
      respone.msg = "提交成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '提交失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});

//上传班级系信息
router.post('/deleteClassInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
  };

  const class_id = req.body.class_id
  const par = [class_id]
  mysqlDB.query('DELETE  FROM class WHERE class_id = ?', par, function (result, fields) {

    console.log(result)
    if (result.affectedRows > 0) {
      respone.msg = "提交成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '提交失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});

//获取所有班级个课程
router.get('/loadClassAndSubject', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      classes: [],
      subjects: []
    },
  };

  sqlClass = 'SELECT *FROM class'
  sqlSubject = 'SELECT *FROM subject'


  mysqlDB.query(sqlClass, [], function (result, fields) {
    if (result.length > 0) {

      result = JSON.stringify(result);
      respone.data.classes = JSON.parse(result);

      mysqlDB.query(sqlSubject, [], function (results, fields) {
        if (results.length > 0) {
          results = JSON.stringify(results);
          respone.data.subjects = JSON.parse(results);
          respone.msg = "提交成功"
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
});


//排课
router.post('/PostSubjectClass', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      classes: [],
      subjects: []
    },
  };

  const formData = req.body.formData

  console.log(formData)

  par1 = [formData.sub_id, formData.class_id]
  par2 = [formData.class_id, formData.sub_id, formData.teacher_id, formData.tcs_id,]

  sql1 = 'SELECT *FROM teacher_class_subject WHERE sub_id=? AND teacher_id= ?'
  sql2 = 'REPLACE  INTO ' +
    ' teacher_class_subject SET' +
    ' class_id = ? ,sub_id = ? , teacher_id = ? ,tcs_id = ?'

  mysqlDB.query(sql1, par1, function (result, fields) {
    if (result.length == 0) {
      mysqlDB.query(sql2, par2, function (result, fields) {
        if (result.affectedRows > 0) {
          respone.msg = "提交成功"
          respone.status = 901
          resp.send(respone)
        } else {
          respone.msg = '提交失败'
          respone.status = 902
          resp.send(respone)
        }
      });

    } else {
      respone.msg = '提交失败，该班级已存在该课程'
      respone.status = 902
      resp.send(respone)
    }
  });
});


//获取所有班级个课程
router.get('/loadSubject', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    data: {
      subjects: []
    },
  };

  sqlSubject = 'SELECT *FROM subject'


  mysqlDB.query(sqlSubject, [], function (result, fields) {
    if (result.length > 0) {

      result = JSON.stringify(result);
      respone.data.subjects = JSON.parse(result);
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

router.post('/PostSubjectInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
  };

  const sub = req.body.formData
  const par = [sub.sub_id, sub.sub_name]
  mysqlDB.query('REPLACE  INTO subject SET sub_id = ? , sub_name = ?', par, function (result, fields) {

    console.log(result)
    if (result.affectedRows > 0) {
      respone.msg = "提交成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '提交失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});

router.post('/deleteSubjectInfo', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
  };

  const sub_id = req.body.sub_id
  const par = [sub_id]
  mysqlDB.query('DELETE FROM subject WHERE sub_id =  ?', par, function (result, fields) {

    console.log(result)
    if (result.affectedRows > 0) {
      respone.msg = "提交成功"
      respone.status = 901
      resp.send(respone)
    } else {
      respone.msg = '提交失败'
      respone.status = 902
      resp.send(respone)
    }

  });
});


router.post('/getClassExcel', function (req, resp) {
  const respone = {
    status: 0,
    msg: '',
    fileUrl: '',

  };
  var sql = 'SELECT\n' +
    '  student.s_num,\n' +
    '  student.s_name,\n' +
    '  re2.grade,\n' +
    '  subject.sub_name\n' +
    'FROM (SELECT\n' +
    '        score.grade,\n' +
    '        score.student_id,\n' +
    '        score.subject_id\n' +
    '      FROM score, (SELECT\n' +
    '                     tcs.sub_id,\n' +
    '                     tcs.teacher_id\n' +
    '                   FROM teacher_class_subject AS tcs\n' +
    '                   WHERE class_id = 1) AS re1\n' +
    '      WHERE re1.sub_id = score.subject_id AND re1.teacher_id = score.teacher_id) AS re2, student, subject\n' +
    'WHERE re2.student_id = student.id AND re2.subject_id = subject.sub_id'
  const class_id = req.body.class_id;
  const par = [class_id]


  mysqlDB.query(sql, par, async function (result, error, fields) {
    if (result.length >= 0) {
      result = JSON.stringify(result);
      var allScore = JSON.parse(result);


      var reName = await createExcel(allScore)
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


async function createExcel(data) {

  stuScore = {}


  for (let i = 0; i < data.length; i++) {
    var score = data[i]
    student = stuScore[score.s_num]
    if (student == undefined) {
      student = {}
    }
    student.s_num = score.s_num
    student.s_name = score.s_name
    scores = student.scores
    if (scores == undefined) {
      scores = []
    }
    scoreTemp = {}
    scoreTemp.grade = score.grade
    scoreTemp.subject = score.sub_name
    scores.push(scoreTemp)
    student.scores = scores
    stuScore[score.s_num] = student
  }

  // 计算总分
  for (var index in stuScore) {
    student = stuScore[index];

    //拿到总分
    scores = student.scores
    total = 0
    for (let i = 0; i < scores.length; i++) {
      total += scores[i].grade
    }
    student.total = total

  }


  stuArr = []
  // 对象转数组
  i = 0
  for (var index in stuScore) {
    student = stuScore[index];
    stuArr.push(student)
    i++
  }

  stuArr.sort(function numberorder(a, b) {
    return   b.total - a.total;
  })
  for (let i = 0; i < stuArr.length; i++) {

    stuArr[i].index = i + 1
  }

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
    const style = new xlsx.Style();
    style.align.h = 'center';
    style.align.v = 'center';
    Cell1.style = style;
    Cell2.style = style;
  }


  {
    //标题
    const Row = sheet.addRow();
    const Cell1 = Row.addCell();
    Cell1.value = '学号';

    const Cell2 = Row.addCell();
    Cell2.value = '姓名';

    const Cell3 = Row.addCell();
    Cell3.value = '数据库原理';

    const Cell4 = Row.addCell();
    Cell4.value = '操作系统';

    const Cell5 = Row.addCell();
    Cell5.value = '数据结构';

    const Cell6 = Row.addCell();
    Cell6.value = '总分';

    const Cell7 = Row.addCell();
    Cell7.value = '排名';

    const style = new xlsx.Style();
    style.align.h = 'center';
    Cell1.style = style;
    Cell2.style = style;
    Cell3.style = style;
    Cell4.style = style;
    Cell5.style = style;
  }

  for (let i = 0; i < stuArr.length; i++) {
    student = stuArr[i];
    const studentRow = sheet.addRow();

    const s_num = studentRow.addCell();
    s_num.value = index

    const s_name = studentRow.addCell();
    s_name.value = student.s_name


    scores = student.scores
    for (let i = 0; i < scores.length; i++) {
      const s_grade = studentRow.addCell();
      s_grade.value = scores[i].grade
    }


    const s_total = studentRow.addCell();
    s_total.value = student.total

    const s_index = studentRow.addCell();
    s_index.value = student.index


  }


  total1 = 0
  total2 = 0
  total3 = 0
  total4 = 0
  for (let i = 0; i < stuArr.length; i++) {


    student = stuArr[i];
    scores = student.scores

    total1 += scores[0].grade
    total2 += scores[1].grade
    total3 += scores[2].grade
    total4 += student.total

  }

  ava1 = total1 * 1.0 / stuArr.length
  ava2 = total2 * 1.0 / stuArr.length
  ava3 = total3 * 1.0 / stuArr.length
  ava4 = total4 * 1.0 / stuArr.length
  //平均分
  {
    const Row = sheet.addRow();
    const Cell1 = Row.addCell();
    Cell1.value = '平均分';

    const _ = Row.addCell();

    const avac1 = Row.addCell();
    avac1.value = ava1

    const avac2 = Row.addCell();
    avac2.value = ava2

    const avac3 = Row.addCell();
    avac3.value = ava3

    const avac4 = Row.addCell();
    avac4.value = ava4
  }


  class_name = '软件一班'
  saveName = 'service/source/' + class_name + '' + '成绩' + '.xlsx'
  reName = class_name + '' + '成绩' + '.xlsx'

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


module.exports = router;
