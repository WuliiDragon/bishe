<template>
  <div>
    <div style="margin-top: 20px;">
      <Table stripe border :columns="columns" :data="data"></Table>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        data: [],
        columns: [
          {
            title: '班级',
            key: 'class_name',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.class_name);
            }
          },
          {
            title: '所授课程',
            key: 'sub_name',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.sub_name);
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
                }, '查看成绩'),
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
                      this.insert(params.index);
                    }
                  }
                }, '增录成绩')
              ]);
            }
          }
        ],
        data: [],
        t_id: this.$route.query.t_id
      }
    },
    created() {
      this.initData()
    },


    methods: {

      insert(index) {
        console.log(this.data[index])
        this.$router.push({
          name: 'insert_score_by_teacher',
          params: {
            data: this.data[index]
          }
        })

      },
      show(index) {
        this.$router.push({
          name: 'show_class_grade_info',
          params: {
            data: this.data[index]
          }
        })

      },

      initData() {
        var self = this
        //不论是何种模式，都要获取当前的学院这专业
        this.$http({
          method: 'post',
          url: '/api/loadClassInfoByTeacher',
          data: {
            t_id: this.t_id
          }
        }).then(function (res) {
          if (res.data.status == 901) {
            self.data = res.data.data
          } else {
            self.$Message.warning('获取信息失败');
          }
        });
      },
    }

  }
</script>
<style scoped>
</style>
