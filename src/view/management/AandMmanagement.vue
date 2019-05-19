<template>
  <div>
    <Button type="primary" @click="addClick()">添加学院</Button>
    <div style="margin-top: 20px;">
      <Table stripe border :columns="columns" :data="data"></Table>
    </div>
    <Modal ref="dialogModel"
           v-model="dialogModel"
           cancel-text="取消"
           @on-cancel="cancel"
           @on-ok="ok"
           v-if="mode === 0" ok-text="添加" title="添加学院"
    >

      <Form ref="formData" :model="formData" :rule="formValidate" :label-width="120" @submit.native.prevent>
        <Form-Item label="学院名称" prop="academy_name">
          <Input v-model="formData.academy_name"></Input>
        </Form-Item>
      </Form>
    </Modal>
    <Modal ref="dialogModel"
           v-model="dialogModel"
           cancel-text="取消"
           @on-cancel="cancel"
           @on-ok="ok"
           v-else ok-text="修改" title="修改学院"
    >

      <Form ref="formData" :model="formData" :rule="formValidate" :label-width="120">
        <Form-Item label="学院名称" prop="academy_name">
          <Input v-model="formData.academy_name"></Input>
        </Form-Item>
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mode: 0,
        dialogModel: false,
        data: [],
        academies: [],
        all_major: [],
        formValidate: {
          academy_name: [
            {required: true, message: '学院名称不能为空不能为空', trigger: 'blur'},
          ],
        },
        formData: {
          academy_name: '',
          academy_id: null,
        },
        columns: [
          {
            title: '学院名称',
            key: 'academy_name',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.academy_name);
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
                      this.ModificationAcademy(params.row);
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
                      //this.remove(params.index);
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
      }
    },
    created() {

      this.initData()
    }
    ,
    methods: {
      ok() {


        this.$refs['formData'].validate((valid) => {
          console.log('===========')
          if (valid) {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/PostAcademyInfo',
              data: {
                formData: self.formData
              }
            }).then(function (res) {
              if (res.data.status === 901) {//获取数据安排上去
                self.$Message.success('提交成功!');
                self.$router.push('/show_all_student')

              } else {
                self.$Message.error('提交失败!');
              }
            });


          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      cancel() {

        this.$Message.info('取消');
      },
      initData() {
        var self = this
        this.$http({
          method: 'get',
          url: '/api/loadSelectInfo',
        }).then(function (res) {
          if (res.data.status == 901) {

            console.log(res.data.data.academy)
            self.data = res.data.data.academy
            //self.all_major = res.data.data.major
            // for (var i = 0; i < self.academies.length; i++) {
            //   self.academiesMap[self.academies[i].academy_id] = self.academies[i].academy_name
            // }
            // for (var i = 0; i < self.all_major.length; i++) {
            //   self.all_majorMap[self.all_major[i].major_id] = res.data.data.major[i].major_name
            // }
            // self.handleListApproveHistory();

          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });


      },
      ModificationAcademy(row) {
        this.mode = 1
        this.dialogModel = true
        this.formData = row
      },
      addClick() {
        this.mode = 0
        this.dialogModel = true
        this.formData.academy_name = ''
        this.formData.academy_id = null
      }
    }
  }
</script>

<style scoped>

</style>
