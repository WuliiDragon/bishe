<template>
  <div>
    <Row>
      <Col span="6">
        <Input search enter-button placeholder="请输入检索信息"/>
      </Col>

      <Col span="3">
        <Dropdown style="margin-left: 20px" @on-click="changeSize">
          <Button type="primary">
            单页显示数目
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name='10'>10条</DropdownItem>
            <DropdownItem name='15'>15条</DropdownItem>
            <DropdownItem name='18'>18条</DropdownItem>
            <DropdownItem name='20'> 20条</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
    </Row>
    <div style="margin-top: 20px;">
      <Table stripe border :columns="columns" :data="data"></Table>
    </div>
    <div style="margin-top: 20px;">
      <Page :total="dataCount" :page-size="currPageSize" show-total class="paging" @on-change="changepage"></Page>
    </div>

  </div>

</template>

<script>
  export default {
    data() {
      return {
        currPage: 1,
        currPageSize: 10,
        dataCount: 0,
        data: [],


        academyName: '学院',
        majorName: '专业',
        type: 0,
        typeId: 0,
        columns: [
          {
            title: '工号',
            key: 't_num',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.t_num);
            }
          },
          {
            title: '姓名',
            key: 's_name',
            align: "center",

            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.t_name);
            }
          },
          {
            title: '操作',
            key: 'action',

            width: 500,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '15px',
                    'font-size': 'larger'
                  },
                  on: {
                    click: () => {
                      this.RouterToModificationTeacher(params.row);
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                  },
                  style: {
                    marginRight: '15px',
                    'font-size': 'larger'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'success',
                  },
                  style: {
                    marginRight: '15px',
                    'font-size': 'larger'
                  },
                  on: {
                    click: () => {
                      this.ClassSubjectTeacher(this.data[params.index]);
                    }
                  }
                }, '排课')
              ]);
            }
          }
        ],
      }
    },
    created() {
      this.handleListApproveHistory()
    },


    methods: {
      handleListApproveHistory() {//0:全部学生，1：学院，2：专业
        const self = this;
        this.$http({
          method: 'post',
          url: '/api/loadAllTeacher',
          data: {
            page: self.currPage,
            pageSize: self.currPageSize,
          }
        }).then(function (res) {
          self.dataCount = res.data.count
          self.data.splice(0, self.data.length);
          self.data = res.data.data
          if (self.dataCount === 0) {
            self.data = []
          }
        })
      },

      changeSize(name) {
        this.currPageSize = parseInt(name)
        this.handleListApproveHistory()
      },


      changepage(index) {
        const self = this;
        self.currPage = index;
        this.handleListApproveHistory()
      },

      ClassSubjectTeacher(row) {

        console.log(row)
        this.$router.push({path: '/set_class_subject_teacher', query: {t_num: row.t_num,t_id: row.t_id}})
      },


      remove(index) {

        var self = this
        this.$Modal.confirm({
          title: '警告',
          content: '确定要删除 ' + self.data[index].s_name + ' 同学吗？',
          onOk: () => {
            this.$http({
              method: 'post',
              url: '/api/DeleteStudentInfo',
              data: {
                id: self.data[index].id
              }
            }).then(function (res) {
              if (res.data.status == 901) {
                self.handleListApproveHistory()

              } else {
                self.$Message.warning('删除信息失败失败');
              }
            })
          },
          onCancel: () => {

          }
        });


      },
      RouterToModificationTeacher(row) {
        this.$router.push({path: '/add_teacher', query: {mode: 1, t_num: row.t_num}})
      },

    }

  }
</script>

<style scoped>

</style>
