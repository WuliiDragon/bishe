<template>
  <div class="login">
    <Row class-name="login-row" type="flex" align="middle" :gutter="20">
      <Col span="9">
      </Col>
      <Col span="6">

        <div class="box">
          <p style="    font-size: 28px;">学生成绩管理系统</p>
          <p style="    font-size: 20px;">教务管理员登录</p>
          <Form ref="formData" :model="formData" :rules="rules" label-position="right" :label-width="80"
                @submit.native.prevent>
            <Form-item label="工号" prop="r_id">
              <Input v-model="formData.r_id" placeholder="工号" style="width: 200px" icon="person" ></Input>
            </Form-item>

            <Form-item label="学号" prop="r_pass">
              <Input v-model="formData.r_pass" placeholder="密码" style="width: 200px" type="password" icon="key" ></Input>
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
          r_id: '13445235',
          r_pass: 'passpass',
        },

        rules: {//表单校验规则
          r_id: [
            {required: true, message: '工号不能为空', trigger: 'change'},
            {type: 'string', min: 4, max: 8, message: "请输入8位工号", trigger: 'change'}

          ],
          r_pass: [
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
              url: '/api/root_login',
              data: {
                formData: self.formData
              }
            }).then(function (res) {
              if (res.data.status === 901) {//获取数据安排上去
                self.$Message.success('登录成功!');
                self.$router.push({name: 'root_index'});
              } else {
                self.$Message.error('登录失败!');
              }
            });


          } else {
            this.$Message.error('请输入正确的工号密码!');
          }
        })
      },

      login() {
        const self = this;
        const r_id = this.r_id;
        const r_pass = this.r_pass;
        if (!r_id || !r_pass) {
          this.$Message.warning('账号和密码不能为空');
          return;
        }
        this.$http({
          method: 'post',
          url: '/api/root_login',
          data: {
            r_id: r_id,
            r_pass: r_pass,
          },
        }).then(function (res) {
          console.log(res.data.status)

          if (res.data.status == 901) {
            self.$Message.success('登录成功');
            self.$router.push({name: 'root_index'});
          } else {
            self.$Message.warning('账户密码错误');
            return;
          }

        });
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
