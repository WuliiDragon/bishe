<template>

  <div class="layout">
    <Layout>
      <Header>
        <Button type="primary" style="margin-left: 1100px;" @click="logout()">
          退出系统
        </Button>
        <div class="layout-logo">
          <h1 class="titleNames">李老师</h1>
        </div>


      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu theme="light" width="auto" :open-names="['1']" active-name="/show_class_and_teacher"
                @on-select="routeTo">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                查看
              </template>
              <MenuItem name="show_class_and_teacher">查看班级</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">

          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <router-view/>
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
        t_id: this.$route.query.t_id
      }
    },
    mounted() {
    },

    methods: {
      routeTo(e) {
        this.$router.push({name: e, query: {t_id: this.t_id}})
      },
      logout() {

        this.routeTo('teacher_login')


      }
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
    width: 100px;
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
