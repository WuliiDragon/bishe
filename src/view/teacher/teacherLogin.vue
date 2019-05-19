<template>
  <div class="login">

    <Row class-name="login-row" type="flex" align="middle" :gutter="20">
      <Col span="9">
      </Col>
      <Col span="6">
        <div class="box">
          <p style="    font-size: 28px;">学生成绩管理系统</p>
          <p style="    font-size: 20px;">教师登录</p>
          <Input v-model="t_num" icon="person" placeholder="请输入工号" @on-enter="login"></Input>
          <Input v-model="t_pass" type="password" icon="key" @on-enter="login" value="pass" placeholder="请输入密码"
                 style="margin-top: 20px;"></Input>
          <Button type="success" long style="margin-top: 20px;" @click="login">登录</Button>
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
        t_num: '1001',
        t_pass: 'pass',
      }
    },
    methods: {
      login() {
        const self = this;
        const t_num = this.t_num;
        const t_pass = this.t_pass;
        if (!t_num || !t_pass) {
          this.$Message.warning('账号和密码不能为空');
          return;
        }


        this.$http({
          method: 'post',
          url: '/api/teacher_login_',
          data: {
            t_num: t_num,
            t_pass: t_pass,
          },
        }).then(function (res) {
          console.log(res.data.data)

          if (res.data.status == 901) {
            self.$Message.success('登录成功');

            self.$router.push({name: 'teacher_management', query: {t_id:res.data.data.t_id }});
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
