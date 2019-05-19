<template>

  <div class="layout">
    <Layout>
      <Header>
        <Button type="primary" style="margin-left: 900px;" @click="logout()">
          退出系统
        </Button>
        <div class="layout-logo">
          <h1 class="titleNames">学生信息管理系统</h1>
        </div>


      </Header>
      <Layout>

        <Layout :style="{padding: '0 24px 400px 20px'}">

          <Content :style="{padding: '24px', minHeight: '280px',}">
            <div style="padding: 10px;background: #f8f8f9 ">
              <Card title="成绩单" :padding="0" shadow style=" margin-left: 400px;width: 400px;">

                <CellGroup>
                  <Cell v-for="item in data" :title=item.title :extra=item.extra
                  />
                </CellGroup>

              </Card>
            </div>
          </Content>
        </Layout>


      </Layout>
    </Layout>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        data: [
          {
            title: '姓名',
            extra: '王翔'
          },
          {
            title: '学院',
            extra: '信息与工程学院'
          },
        ],
        s_id: this.$route.query.s_id
      }
    },


    methods: {

      fetchGrade() {
        var self = this
        this.$http({
          method: 'post',
          url: '/api/get_student_grade',
          data: {
            s_id: self.s_id
          }
        }).then(function (res) {
          console.log(res)
          if (res.data.status === 901) {//获取数据安排上去

          } else {
            self.$Message.error('登录失败!');
          }
        });


      },
      routeTo(e) {
        this.$router.push({name: e,})
      },
      logout() {
        this.routeTo('student_login')
      }
    },
    mounted() {
      this.fetchGrade()
    },
  }
</script>


<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background-color: blue;

    height: 100%;

  }

  .titleNames {
    color: white;
    margin-top: -17px;
  }

  .layout-logo {
    width: 300px;
    height: 30px;

    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }


  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }


</style>
