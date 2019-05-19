<template>
  <div style="margin-top: 20px;width:500px;">
    <h1 align="center"> 现在录入{{paras.class_name}}的{{paras.sub_name}}成绩</h1>
    <Table style="margin-top: 20px; align: center;" stripe border :columns="columns" :data="data"></Table>
    <Button style="margin-top: 20px" type="primary" @click="submit">提交</Button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        studentInfoMap: {},
        studentInfo: [],
        scoreInfo: [],
        paras: this.$route.params.data,
        curSum: 0,
        columns: [
          {
            title: '学生姓名',
            key: 's_name',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.s_name);
            }
          },
          {
            title: '成绩',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Input', {
                  props: {
                    value: this.data[params.index].grade,
                    autosize: true
                  }, on: {
                    'on-blur': (event) => {

                      if (parseInt(event.target.value)) {
                        this.data[params.index].grade = parseInt(event.target.value)
                      } else {
                        this.data[params.index].grade = 0
                        this.$Message.warning('请输入数字哦');
                      }
                      if (this.data[params.index].grade < 0 || this.data[params.index].grade > 100) {
                        this.data[params.index].grade = 0
                        this.$Message.warning('输入正确的分数哦');
                      }
                    }
                  }
                }),
              ]);
            }
          }
        ],
      }

    },


    methods: {

      reFormData() {

        for (var i in this.studentInfo) {

          var item = {}

          item.id = this.studentInfo[i].id
          item.s_name = this.studentInfo[i].s_name
          item.sub_id = this.paras.sub_id
          item.teacher_id = this.paras.teacher_id
          item.score_id = null
          item.grade = null

          for (var j in this.scoreInfo) {
            if (this.studentInfo[i].id === this.scoreInfo[j].id) {
              item.score_id = this.scoreInfo[j].score_id
              item.grade = this.scoreInfo[j].grade
            }
          }
          this.data.push(item)

        }
        console.log(this.data)
      }
      ,
      loadAllScore() {
        var self = this
        this.$http({
          method: 'post',
          url: '/api/loadAllScore',
          data: {
            class_id: this.paras.class_id,
            sub_id: this.paras.sub_id
          }
        }).then(function (res) {
          if (res.data.status == 901) {

            self.scoreInfo = res.data.data
            self.reFormData()

          } else {
            self.$Message.warning('获取信息失败');
          }
        });

      }
      ,
      //根据class_id获取所有人
      loadAllStudentByClass() {
        var self = this
        this.$http({
          method: 'post',
          url: '/api/loadAllStudentByClass',
          data: {
            class_id: this.paras.class_id,
          }
        }).then(function (res) {
          if (res.data.status == 901) {

            self.studentInfo = res.data.data

            self.loadAllScore()
          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });
      }
      ,

      submit() {
        var self = this
        if (!this.checkData()) {
          self.$Message.warning('数据不完整');
          return
        }
        this.$http({
          method: 'post',
          url: '/api/postStudentScore',
          data: {
            data: this.data
          }
        }).then(function (res) {
          if (res.data.status == 901) {
            self.$router.push({name: 'teacher_management', query: {t_id: self.t_id}});

            self.$Message.warning('增录信息成功');

          } else {
            self.$Message.warning('获取信息失败');
          }
        });

      }
      ,
      checkData() {
        for (var i = 0; i < this.data.length; i++) {
          const item = this.data[i]
          if (item.grade === 0 || item.grade === '' || item.grade === undefined) {
            return false
          }

        }
        return true
      }
      ,
    },
    created() {
      this.loadAllStudentByClass()
    }
    ,
  }
</script>

<style scoped>

</style>
