<template>
  <div>

    <Col>
      <Row style="padding:20px 20px 20px 20px;">

        <Button type="primary" shape="circle" icon="ios-download" @click="exportExcel"> 导出表格到本地</Button>


      </Row>
    </Col>
    <Col>
      <Row>
        <Col span="10">
          <canvas id="myChart2" width="400px" height="400px" style="padding:20px 20px 20px 20px;"></canvas>
        </Col>
        <Col span="2">
          <div>

            <h1></h1>
          </div>
        </Col>

        <Col span="10">
          <canvas id="myChart3" width="400px" height="400px" style="padding:20px 20px 20px 20px;"></canvas>
        </Col>
      </Row>
    </Col>
  </div>
</template>

<script>
  import Chart from 'chart.js';

  export default {
    data() {
      return {
        paras: this.$route.params.data,
        labels: [],
        data: [],
        grades: [],
        backgroundColor: [],
        borderColor: []
      }
    },

    mounted() {
      this.loadGeade()

    },


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
      exportExcel() {
        var self = this

        this.$http({
          method: 'post',
          url: '/api/getExcel',
          data: {
            class_id: this.paras.class_id,
            sub_id: this.paras.sub_id
          },
        }).then(function (res) {
          self.downloadByIframe('http://localhost:3000/' + res.data.fileUrl)

          // if (res.data.status == 901) {
          //
          // } else {
          //   self.$Message.warning('获取班级信息失败失败');
          // }
        });


      }
      ,

      loadGeade() {
        var self = this

        this.$http({
          method: 'post',
          url: '/api/getScoresBySubject',
          data: {
            subject_id: this.paras.sub_id
          }
        }).then(function (res) {

          if (res.data.status == 901) {
            const grades = res.data.data

            for (var i = 0; i < grades.length; i++) {
              self.grades.push(grades[i].grade)
            }
            self.classicGrade()

          } else {
            self.$Message.warning('获取班级信息失败失败');
          }
        });

      }
      ,

      classicGrade() {

        for (var i = 0; i <= 4; i++) {
          this.data[i] = 0
        }

        for (var i = 0; i < this.grades.length; i++) {
          const grade = this.grades[i]
          // this.labels = ['30以下', '30-60', '60-70', '70-80', '80-90', '90-100']
          if (grade < 0 || grade > 100) {
            continue
          }
          if (grade > 0 && grade <= 30) {
            this.data[0] += 1
          }

          if (grade > 30 && grade <= 60) {
            this.data[1]++
          }

          if (grade > 60 && grade <= 70) {
            this.data[2]++
          }
          if (grade > 70 && grade <= 80) {
            this.data[3]++
          }
          if (grade > 80 && grade <= 90) {
            this.data[4]++
          }

          if (grade > 90 && grade <= 100) {
            this.data[5]++
          }
        }

        console.log(this.data)
        this.init()
      }
      ,


      init() {
        label: '成绩分布比例',

          this.labels = ['30以下', '30-60', '60-70', '70-80', '80-90', '90-100']
        //this.data = [1, 5, 23, 12, 4, 2]
        this.backgroundColor = [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
          this.borderColor = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ]

        var ctx = document.getElementById('myChart2').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: [{
              label: '成绩分布图',
              data: this.data,
              borderWidth: 1,
              backgroundColor: this.backgroundColor,
              borderColor: this.borderColor
            }],

          },
          options: {
            scaleFontSize: 30,

            scales: {}
          }
        });


        var ctx3 = document.getElementById('myChart3').getContext('2d');
        var myChart3 = new Chart(ctx3, {
          type: 'pie',
          data: {
            labels: this.labels,
            datasets: [{
              label: '成绩分布图',
              labelSize: 100,
              borderWidth: 1,
              data: this.data,
              backgroundColor: this.backgroundColor,
              borderColor: this.borderColor
            }]
          },
          options: {}
        });

      }
    }
  }
</script>

<style scoped>

</style>
