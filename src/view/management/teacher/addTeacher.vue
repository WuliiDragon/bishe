<template>
  <div style="margin-top: 20px;">
    <Form ref="formData" :model="formData" :rules="rules" label-position="right" :label-width="80"
          @submit.native.prevent>
      <Form-item label="姓名" prop="t_name">
        <Input v-model="formData.t_name" placeholder="请输入姓名" style="width: 200px"></Input>
      </Form-item>

      <Form-item label="工号" prop="t_num">
        <Input v-model="formData.t_num" placeholder="请输入学号" style="width: 200px"
               :disabled="mode === 1 ? true : false "></Input>
      </Form-item>

      <Form-item>
        <Button v-if="mode === 0" type="primary" @click="submit('formData')">提交</Button>
        <Button v-else type="primary" @click="submit('formData')">修改</Button>
        <Button v-if="mode === 0" type="primary" @click="submit('formData')">重置</Button>
      </Form-item>

    </Form>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        mode: 0,
        formData: {//提交的数据与表单内容息息相关
          t_name: '李四',
          t_num: '1801',
          t_id: null
        },

        rules: {//表单校验规则
          t_name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'},
          ],
          t_num: [
            {required: true, message: '学号必填', trigger: 'blur'},
            {type: 'string', min: 4, max: 4, message: "请输入十位学号", trigger: 'change'}
          ]
        },
      }

    },
    mounted() {
      this.mode = this.$route.query.mode//确定模式
      this.initData()//初始化数据
    },


    methods: {
      initData() {
        var self = this
        var t_num = this.$route.query.t_num
        if (self.mode == 0) {//添加学生


        } else if (self.mode == 1) {//修改学生需要获取学生的详细信息
          this.$http({
            method: 'post',
            url: '/api/loadTeacherInfo',
            data: {
              t_num: t_num
            }
          }).then(function (res) {
            if (res.data.status == 901) {//获取数据安排上去
              self.formData = res.data.data.teacher

              console.log(self.formData)

            } else {
              self.$Message.warning('获取学生信息失败失败');
            }
          });
        }
      },


      submit(name) {

        console.log(this.formData)

        this.$refs[name].validate((valid) => {
          if (valid) {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/PostTeacherInfo',
              data: {
                formData: self.formData
              }
            }).then(function (res) {

              console.log(res.data.status)

              if (res.data.status === 901) {//获取数据安排上去
                self.$Message.success('提交成功!');
                self.$router.push('/show_all_teacher')

              } else {
                self.$Message.error('提交失败!');
              }
            });


          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>

