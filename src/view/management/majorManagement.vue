<template>
  <div>
    <Button type="primary" @click="addClick()">添加专业</Button>
    <div style="margin-top: 20px;">
      <Table stripe border :columns="columns" :data="data"></Table>
    </div>


    <Modal ref="dialogModel"
           v-model="dialogModel"
           cancel-text="取消"
           @on-cancel="cancel"
           @on-ok="ok"
           :ok-text="mode === 0?'添加':'修改'"
           :title="mode === 0?'添加学院':'修改学院'">
      <Form ref="formData" :model="formData" :rule="formValidate" :label-width="120" @submit.native.prevent>

        <Form-item label="学院" prop="academy_id">
          <Select v-model="formData.academy_id" placeholder="学院" style="width: 200px"
                  @on-change='select_academy(formData.academy_id)'>
            <Option v-for="(item, index) in academies" :value="item.academy_id" :key="item.academy_id">
              {{item.academy_name}}
            </Option>
          </Select>
        </Form-item>

        <Form-Item label="专业名称" prop="major_name">
          <Input v-model="formData.major_name"></Input>
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
        academiesMap: {},//学院map
        all_majorMap: {},


        formValidate: {
          major_name: [
            {required: true, message: '学院名称不能为空不能为空', trigger: 'blur'},
          ],
          academy_id: [
            {required: true, message: '学院不能为空', trigger: 'change', type: 'number'}
          ],
        },


        formData: {
          major_name: '',
          major_id: null,
          academy_id: null,
        },
        columns: [
          {
            title: '专业名称',
            key: 'major_name',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, params.row.major_name);
            }
          },
          {
            title: '学院名称',
            key: 'academy_id',
            align: "center",
            render: (h, params) => {
              return h('span', {
                style: {'font-size': 'larger'},
              }, this.academiesMap[params.row.academy_id]);
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
                      this.ModificationMajor(params.row);
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
      select_academy(academy_id) {
        this.formData.academy_id = academy_id
      },
      ok() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/PostMajorInfo',
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


            self.academies = res.data.data.academy
            self.all_major = res.data.data.major
            self.data = self.all_major


            for (var i = 0; i < self.academies.length; i++) {
              self.academiesMap[self.academies[i].academy_id] = self.academies[i].academy_name
            }
            for (var i = 0; i < self.all_major.length; i++) {
              self.all_majorMap[self.all_major[i].major_id] = res.data.data.major[i].major_name
            }

          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });


      },
      ModificationMajor(row) {
        console.log(row)
        this.mode = 1
        this.dialogModel = true
        this.formData = row
      },
      addClick() {
        this.mode = 0
        this.dialogModel = true

        this.formData.major_name = ''
        this.formData.academy_id = null
        this.formData.major_id = null
      }
    }
  }
</script>

<style scoped>

</style>
