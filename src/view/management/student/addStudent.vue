<template>
  <div style="margin-top: 20px;">
    <Form ref="formData" :model="formData" :rules="rules" label-position="right" :label-width="80"
          @submit.native.prevent>
      <Form-item label="姓名" prop="s_name">
        <Input v-model="formData.s_name" placeholder="请输入姓名" style="width: 200px"></Input>
      </Form-item>

      <Form-item label="学号" prop="s_num">
        <Input v-model="formData.s_num" placeholder="请输入学号" style="width: 200px"></Input>
      </Form-item>


      <Form-item label="学院" prop="academy_id">
        <Select v-model="formData.academy_id" placeholder="学院" style="width: 200px"
                @on-change='select_academy(formData.academy_id,1)'>
          <Option v-for="(item, index) in academies" :value="item.academy_id" :key="item.academy_id">
            {{item.academy_name}}

          </Option>
        </Select>
      </Form-item>

      <Form-item label="专业" prop="major_id">
        <Select v-model="formData.major_id" placeholder="专业" style="width: 200px"
                @on-change='select_major(formData.major_id,1)'>
          <Option v-for="(item, index) in major" :value="item.major_id" :key="item.major_id">{{item.major_name}}
          </Option>
        </Select>
      </Form-item>
      <Form-item label="班级" prop="class_id">
        <Select v-model="formData.class_id" placeholder="班级" style="width: 200px">
          <Option v-for="(item, index) in classes" :value="item.class_id" :key="item.class_id">{{item.class_name}}
          </Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button v-if="mode === 0" type="primary" @click="submit('formData')">提交</Button>
        <Button v-else type="primary" @click="submit('formData')">修改</Button>
        <Button v-if="mode === 0" type="primary" @click="submit('formData')">重置</Button>
      </Form-item>

    </Form>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        mode: 0,//模式 0：为添加学生 1：修改学生

        academies: [],//学院
        major: [],//当前院的专业
        classes: [],

        //左右专业
        all_major: [],
        all_classes: [],

        formData: {//提交的数据与表单内容息息相关
          academy_id: null,
          major_id: null,
          class_id: null,

          s_name: '李四',
          s_num: '1402120'
        },


        rules: {//表单校验规则
          s_name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'},
          ],
          academy_id: [
            {required: true, message: '学院不能为空', trigger: 'change', type: 'number'}
          ],
          major_id: [
            {required: true, message: '专业不能为空', trigger: 'change', type: 'number'}
          ],
          class_id: [
            {required: true, message: '班级不能为空', trigger: 'change', type: 'number'}
          ],
          s_num: [
            {required: true, message: '学号必填', trigger: 'change'},
            {type: 'string', min: 9, max: 11, message: "请输入9-10位学号", trigger: 'change'}
          ]
        },
      }

    },
    mounted() {
      this.mode = this.$route.query.mode//确定模式
      this.initData()//初始化数据
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

            self.all_classes = res.data.data.class
            //加载学生
            self.loadStudent()
          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });

      },

      loadStudent() {
        var self = this

        if (self.mode == 0) {//添加学生


        } else if (self.mode == 1) {//修改学生需要获取学生的详细信息
          var s_num = this.$route.query.s_num
          this.$http({
            method: 'post',
            url: '/api/loadStudentInfo',
            data: {
              s_num: s_num
            }
          }).then(function (res) {
            if (res.data.status == 901) {//获取数据安排上去
              self.formData = res.data.data.student
              self.select_academy(self.formData.academy_id, 0)
            } else {
              self.$Message.warning('获取学生信息失败失败');
            }
          });
        }

      },
      select_major(major_id, type) {

        var self = this
        // if (type === 1) {
        //   self.formData.major_id = null
        //   // self.formData.class_id = null
        // }
        console.log(major_id)

        self.classes.splice(0, self.classes.length);
        for (let i = 0; i < self.all_classes.length; i++) {
          var item = self.all_classes[i]
          if (item.major_id == major_id) {
            self.classes.push(item)
          }
        }


      },

      select_academy(academy_id, type) {//0： 表示初始化不需要吧专业置为0，1：切花学院时需要把专业置为0
        var self = this
        if (type === 1) {
          self.formData.major_id = 0
        }

        self.major.splice(0, self.major.length);
        for (let i = 0; i < self.all_major.length; i++) {
          var item = self.all_major[i]
          if (item.academy_id == academy_id) {
            self.major.push(item)
          }
        }
      },

      submit(name) {
        this.$refs[name].validate((valid) => {
          console.log(this.major)
          if (valid) {
            var self = this
            this.$http({
              method: 'post',
              url: '/api/PostStudentInfo',
              data: {
                formData: self.formData
              }
            }).then(function (res) {

              console.log(res.data.status)

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
    }
  }
</script>

<style scoped>

</style>

