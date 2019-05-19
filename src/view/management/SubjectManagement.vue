<template>
  <div>
    <Button type="primary" @click="addClick()">添加课程</Button>
    <div style="margin-top: 20px;">
      <Table stripe border :columns="columns" :data="data"></Table>
    </div>
    <Modal ref="dialogModel"
           v-model="dialogModel"
           cancel-text="取消"
           @on-cancel="cancel"
           @on-ok="ok"
           v-if="mode === 0" ok-text="添加" title="添加课程">

      <Form ref="formData" :model="formData" :rule="formValidate" :label-width="120" @submit.native.prevent>
        <Form-Item label="课程名称" prop="sub_name">
          <Input v-model="formData.sub_name"></Input>
        </Form-Item>
      </Form>
    </Modal>


    <Modal ref="dialogModel"
           v-model="dialogModel"
           cancel-text="取消"
           @on-cancel="cancel"
           @on-ok="ok"
           v-else ok-text="修改" title="修改课程">

      <Form ref="formData" :model="formData" :rule="formValidate" :label-width="120">
        <Form-Item label="课程名称" prop="sub_name">
          <Input v-model="formData.sub_name"></Input>
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
        subjects: [],
        formValidate: {
          sub_name: [
            {required: true, message: '课程名称不能为空', trigger: 'blur'},
          ],
        },
        formData: {
          sub_name: '',
          sub_id: null,
        },
        columns: [
          {
            title: '课程名称',
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
                      this.delete_subject(params.row);
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




      delete_subject(row) {
        var self = this
        this.$Modal.confirm({
          title: '警告',
          content: '确定要删除 ' + row.sub_name + ' 课程吗？',
          onOk: () => {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/deleteSubjectInfo',
              data: {
                sub_id: row.sub_id
              }
            }).then(function (res) {
              if (res.data.status === 901) {//获取数据安排上去
                self.$Message.success('删除成功!');
                self.initData()

              } else {
                self.$Message.error('删除失败!');
              }
            });
          },
          onCancel: () => {

          }
        });


      },


      ok() {


        this.$refs['formData'].validate((valid) => {
          if (valid) {

            var self = this
            this.$http({
              method: 'post',
              url: '/api/PostSubjectInfo',
              data: {
                formData: self.formData
              }
            }).then(function (res) {
              if (res.data.status === 901) {//获取数据安排上去
                self.$Message.success('提交成功!');
                self.initData()
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
        self.data = []
        this.$http({
          method: 'get',
          url: '/api/loadSubject',
        }).then(function (res) {
          if (res.data.status == 901) {

            self.data = res.data.data.subjects
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
