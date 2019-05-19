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
      <Col span="4">
        <Dropdown style="margin-left: 20px" @on-click="fetchStudentByAcademyId">
          <Button type="primary">
            {{this.academyName }}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem v-for="item in academies" :name=item.academy_id :key=item.academy_id>{{item.academy_name}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
      <Col span="3">
        <Dropdown style="margin-left: 20px" @on-click="fetchStudentByMajorId">
          <Button type="primary">
            {{this.majorName }}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem v-for="item in majors" :name=item.major_id :key=item.major_id>{{item.major_name}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
      <Col span="3">

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


        academies: [],
        all_major: [],
        all_class: [],

        majors: [],

        academyName: '学院',
        majorName: '专业',
        academiesMap: {},//学院map
        all_majorMap: {},
        classMap: {},
        type: 0,
        typeId: 0,


        columns: [
          {
            title: '学号',
            key: 's_num',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.s_num);
            }
          },
          {
            title: '姓名',
            key: 's_name',
            align: "center",

            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.s_name);
            }
          },
          {
            title: '学院',
            key: 'academy_id',
            align: "center",

            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, this.academiesMap[params.row.academy_id]);
            }
          },
          {
            title: '专业',
            key: 'major_id',
            align: "center",

            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, this.all_majorMap[params.row.major_id]);
            }
          },
          {
            title: '班级',
            key: 'class_id',
            align: "center",

            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, this.classMap[params.row.class_id]);
            }
          },
          {
            title: '操作',
            key: 'action',

            width: 300,
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
                      this.RouterToModificationStudent(params.row);
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
                      this.show(params.index);
                    }
                  }
                }, '查看成绩')
              ]);
            }
          }
        ],
        data: [],
      }
    },
    created() {

      this.initData()
    },


    methods: {
      initData() {
        var self = this
        //不论是何种模式，都要获取当前的学院这专业
        this.$http({
          method: 'get',
          url: '/api/loadSelectInfo',
        }).then(function (res) {
          if (res.data.status == 901) {

            self.academies = res.data.data.academy
            self.all_major = res.data.data.major
            self.all_class = res.data.data.class
            for (var i = 0; i < self.academies.length; i++) {
              self.academiesMap[self.academies[i].academy_id] = self.academies[i].academy_name
            }
            for (var i = 0; i < self.all_major.length; i++) {
              self.all_majorMap[self.all_major[i].major_id] = res.data.data.major[i].major_name
            }
            for (var i = 0; i < self.all_class.length; i++) {
              self.classMap[self.all_class[i].class_id] = self.all_class[i].class_name
            }
            self.handleListApproveHistory();

          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });

      },

      changeSize(name) {
        this.currPageSize = parseInt(name)
        this.handleListApproveHistory()
      },

      handleListApproveHistory() {//0:全部学生，1：学院，2：专业
        const self = this;
        console.log(self.currPage)
        this.$http({
          method: 'post',
          url: '/api/student_list',
          data: {
            page: self.currPage,
            pageSize: self.currPageSize,
            type: self.type,
            typeId: self.typeId,
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
      changepage(index) {
        const self = this;
        self.currPage = index;
        self.handleListApproveHistory()
      },

      fetchStudentByAcademyId(index) {

        this.currPage = 1
        this.dataCount = 0
        this.type = 1
        this.typeId = index
        this.academyName = this.academiesMap[index + '']


        this.majors.splice(0, this.majors.length);
        for (var i = 0; i < this.all_major.length; i++) {
          var item = this.all_major[i]
          if (item.academy_id === index) {
            this.majors.push(item)
          }
        }
        this.handleListApproveHistory()

      },

      fetchStudentByMajorId(index) {
        this.currPage = 1
        this.dataCount = 0
        this.type = 2
        this.typeId = index
        this.majorName = this.all_majorMap[index + '']
        this.handleListApproveHistory()
      },


      RouterToModificationStudent(row) {
        this.$router.push({path: '/add_student', query: {mode: 1, s_num: row.s_num}})
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


      }
    }

  }
</script>

<style scoped>

</style>
