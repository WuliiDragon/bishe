<template>


  <div style="margin-top: 20px;">

    <Tabs value="paikeTab" type="card" @on-click="changeTab">
      <TabPane label="排课" name="paikeTab">
        <Form ref="formData" :model="formData" :rules="rules" label-position="right" :label-width="80"
              @submit.native.prevent>

          <Form-item label="课程" prop="sub_id">
            <Select v-model="formData.sub_id" placeholder="˙选择课程" style="width: 200px">
              <Option v-for="(item, index) in subjects" :value="item.sub_id" :key="item.sub_id">
                {{item.sub_name}}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="班级" prop="class_id">
            <Select v-model="formData.class_id" placeholder="选择班级" style="width: 200px">
              <Option v-for="(item, index) in classes" :value="item.class_id" :key="item.class_id">
                {{item.class_name}}
              </Option>
            </Select>
          </Form-item>
          <Form-item>
            <Button type="primary" @click="submit('formData')">提交</Button>
          </Form-item>
        </Form>
      </TabPane>
      <TabPane label="管理" name="guanliTab">
        <div style="margin-top: 20px;">
          <Table stripe border :columns="columns" :data="data"></Table>
        </div>
      </TabPane>
    </Tabs>


  </div>


</template>

<script>
  export default {
    data() {
      return {
        classes: [],
        subjects: [],
        teacher_id: null,
        teacher_name: null,
        formData: {
          class_id: null,
          sub_id: null,
          teacher_id: null,
          tcs_id: null,
        },


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
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
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
                      this.show(params.index);
                    }
                  }
                }, '删除'),
              ]);
            }
          }
        ],
        rules: {//表单校验规则
          class_id: [
            {required: true, message: '班级不能为空', trigger: 'change', type: 'number'}

          ],
          sub_id: [
            {required: true, message: '专业不能为空', trigger: 'blur', type: 'number'}
          ]
        },


      }
    },
    mounted() {
      this.teacher_id = this.$route.query.t_id
      this.formData.teacher_id = this.$route.query.t_id
      this.teacher_name = this.$route.query.t_name

      this.initData()//初始化数据
    },
    methods: {


      changeTab(name) {
        if (name === 'guanliTab') {
          var self = this
          //不论是何种模式，都要获取当前的学院这专业
          this.$http({
            method: 'post',
            url: '/api/loadClassInfoByTeacher',
            data :{
              t_id: this.teacher_id
            }
          }).then(function (res) {
            if (res.data.status == 901) {
              self.data = res.data.data
            } else {
              self.$Message.warning('获取信息失败');
            }
          });
        }
      },
      initData() {
        var self = this
        //不论是何种模式，都要获取当前的学院这专业
        this.$http({
          method: 'get',
          url: '/api/loadClassAndSubject',
        }).then(function (res) {
          if (res.data.status == 901) {
            self.classes = res.data.data.classes
            self.subjects = res.data.data.subjects
          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });

      },

      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            var self = this


            this.$http({
              method: 'post',
              url: '/api/PostSubjectClass',
              data: {
                formData: self.formData
              }
            }).then(function (res) {


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
