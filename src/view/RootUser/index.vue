<template>

  <div class="layout">
    <Layout>
      <Header>


        <div class="layout-logo">
          <h1 class="titleNames">张老师</h1>
        </div>

        <Button type="primary" style="margin-left: 1100px;    margin-top: -60px" @click="logout()">
          退出系统
        </Button>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="/show_all_student" theme="light" width="auto" :open-names="['1']" @on-select="routeTo">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                学生信息管理
              </template>
              <MenuItem name="/show_all_student" >查看管理学生</MenuItem>
              <MenuItem name="/add_student">添加学生</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                教师信息管理
              </template>
              <MenuItem name="/show_all_teacher">查看教师信息</MenuItem>
              <MenuItem name="/add_teacher">添加教师</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                学院专业管理
              </template>
              <MenuItem name="/a_and_m_management">学院管理</MenuItem>
              <MenuItem name="/major_management">专业管理</MenuItem>
              <MenuItem name="/class_management">班级管理</MenuItem>
              <MenuItem name="/subject_management">课程管理</MenuItem>

            </Submenu>

          </Menu>
        </Sider>

        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

          <router-view/>

        </Content>

      </Layout>
    </Layout>
  </div>

</template>

<script>
  export default {
    methods: {
      logout() {
        this.routeTo('/')
      },
      mounted() {
        this.routeTo('/show_all_student')
      },
      routeTo(e) {
        if (e === '/add_student' || e === '/add_teacher') {//添加学生模式
          this.$router.push({path: e, query: {mode: 0}})
        } else {
          this.$router.push(e)

        }

      }
    }
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

  .titleNames{
    color: white;
    margin-top: -17px;
  }
  .layout-logo {
    width: 600px;
    height: 30px;

    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }


</style>
