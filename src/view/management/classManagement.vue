<template>
  <div>
    <Button type="primary" @click="addClick()">添加班级</Button>
    <div style="margin-top: 20px;">
      <Table stripe border :columns="columns" :data="data"></Table>
    </div>


    <Modal ref="dialogModel"
           v-model="dialogModel"
           cancel-text="取消"
           @on-cancel="cancel"
           @on-ok="ok"
           :ok-text="mode === 0?'添加':'修改'"
           :title="mode === 0?'添加班级':'修改班级'">
      <Form ref="formData" :model="formData" :rule="formValidate" :label-width="120" @submit.native.prevent>

        <Form-item label="专业" prop="major_id">
          <Select v-model="formData.major_id" placeholder="˙专业" style="width: 200px"
                  @on-change='select_major(formData.major_id)'>
            <Option v-for="(item, index) in all_major" :value="item.major_id" :key="item.major_id">
              {{item.major_name}}
            </Option>
          </Select>
        </Form-item>


        <Form-Item label="班级名称名称" prop="class_name">
          <Input v-model="formData.class_name"></Input>
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

        all_major: [],
        all_majorMap: {},

        formValidate: {
          major_name: [
            {required: true, message: '班级名称不能为空不能为空', trigger: 'blur'},
          ],
          major_id: [
            {required: true, message: '专业不能为空', trigger: 'change', type: 'number'}
          ],
        },


        formData: {
          class_name: '',
          major_id: null,
          class_id: null,
        },
        columns: [
          {
            title: '班级名称',
            key: 'class_name',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.class_name);
            }
          },
          {
            title: '专业名称',
            key: 'major_name',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, this.all_majorMap[params.row.major_id]);
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
                      this.ModificationClass(params.row);
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
                      this.remove(params.row);
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
                      this.getExcel(params.row);
                    }
                  }
                }, '导出成绩')
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
      downloadByIframe(url) {
        var iframe = document.getElementById("myIframe");
        if (iframe) {
          iframe.src = url;
        } else {
          iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = url;
          iframe.id = "myIframe";
          document.body.appendChild(iframe);
        }
      },
      getExcel(row) {

        var self = this

        this.$http({
          method: 'post',
          url: '/api/getClassExcel',
          data: {
            class_id: row.class_id
          }
        }).then(function (res) {
          if (res.data.status == 901) {
            self.downloadByIframe('http://localhost:3000/' + res.data.fileUrl)


          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });

      },

      remove(row) {


        var self = this
        this.$Modal.confirm({
          title: '警告',
          content: '确定要删除 ' + row.class_name + ' 班级吗？',
          onOk: () => {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/deleteClassInfo',
              data: {
                class_id: row.class_id
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

      select_major(major_id) {
        this.formData.major_id = major_id
      },
      ok() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/PostClassInfo',
              data: {
                formData: self.formData
              }
            }).then(function (res) {
              if (res.data.status === 901) {//获取数据安排上去
                self.$Message.success('提交成功!');
                self.initData()
              } else {
                self.$Message.error('提交失败!');
                self.initData()
              }
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },

      cancel() {
        this.$Message.info('取消');

        this.formData = {}
      },
      initData() {
        var self = this

        this.$http({
          method: 'get',
          url: '/api/loadSelectInfo',
        }).then(function (res) {
          if (res.data.status == 901) {


            self.all_major = res.data.data.major
            self.data = res.data.data.class
            console.log(res.data.data)
            for (var i = 0; i < self.all_major.length; i++) {
              self.all_majorMap[self.all_major[i].major_id] = res.data.data.major[i].major_name
            }

          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });


      },
      ModificationClass(row) {
        console.log(row)
        this.mode = 1
        this.dialogModel = true
        this.formData = row
      },
      addClick() {
        this.mode = 0
        this.dialogModel = true

        this.formData.class_name = ''
        this.formData.class_id = null
        this.formData.major_id = null
      }
    }
  }
</script>

<style scoped>

</style>
