<template>
  <div class="login">
    <Row class-name="login-row" type="flex" align="middle" :gutter="20">
      <Col span="9">
      </Col>
      <Col span="6">

        <div class="box">
          <p style="    font-size: 28px;">学生成绩系统</p>
          <p style="    font-size: 20px;">学生登录</p>
          <Form ref="formData" :model="formData" :rules="rules" label-position="right" :label-width="80"
                @submit.native.prevent>
            <Form-item label="工号" prop="r_id">
              <Input v-model="formData.s_num" placeholder="学号" style="width: 200px" icon="person"></Input>
            </Form-item>

            <Form-item label="学号" prop="r_pass">
              <Input v-model="formData.s_pass" placeholder="密码" style="width: 200px" type="password" icon="key"></Input>
            </Form-item>

            <Form-item>
              <Button type="success" long style="margin-top: 20px;" @click="submit('formData')">登录</Button>
            </Form-item>
          </Form>
        </div>

      </Col>
      <Col span="9">

      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formData: {
          s_num: '2511160433',
          s_pass: 'passpass',
        },

        rules: {//表单校验规则
          s_num: [
            {required: true, message: '学号不能为空', trigger: 'change'},
          ],
          s_pass: [
            {required: true, message: '密码必填', trigger: 'change'},
            {type: 'string', min: 6, max: 18, message: "请输入6-18位密码", trigger: 'change'}
          ]
        },
      }
    },
    methods: {

      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/student_login',
              data: {
                formData: self.formData
              }
            }).then(function (res) {
              console.log(res)
              if (res.data.status === 901) {//获取数据安排上去
                self.$Message.success('登录成功!');
                
                self.$router.push({name: 'student_grade', query: {s_id: res.data.data.id}});
              } else {
                self.$Message.error('登录失败!');
              }
            });
          } else {
            this.$Message.error('请输入正确的学号密码!');
          }
        })
      },
    },
  }
</script>


<style>
  .login {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .login .login-row {
    margin-top: 100px;
  }

  .login .welcome {
    width: 100%;
  }

  .login .welcome img {
    width: 100%;
  }

  .login .box {
    width: 100%;
    padding: 20px;
    border: 1px solid #5cadff;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
  }

  .login .box p {
    font-size: 14px;
    text-align: center;
    margin-bottom: 20px;
  }
</style>
