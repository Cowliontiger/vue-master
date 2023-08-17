<template>
<html>
  <!-- <div>
  <label for="file" id="upFile">上传文件</label>
  <input type="file" ref="upload" accept=".xls, .xlsx">
    <p id="fileName"></p>
  </div>-->
      <!--
  <div class="upload">
    <el-upload
      class="upload-demo"
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
    >

      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" prop="submitUpload" type="success" @click="submitUpload">上传到服务器</el-button>
      <el-button style="margin-left: 10px;" size="small" prop="submitDB" type="infor"  @click="submitDB">存放到数据库</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xls或者xlsx文件，且不超过500M</div>
    </el-upload>
  </div>
  -->

  <div class="update-PWD">
     <el-form ref="ruleForm" label-width="0px" class="demo-ruleForm">
          <el-form-item ref="cronJob" label="定时任务设置" label-width="110px">
            <el-col :span="12">
            <el-input v-model="cronValue"
              type="text"
              size="small"
              placeholder="例如:“0 15 10 * * ?” 每天上午10:15触发" value="0 15 10 * * ?"></el-input>
            </el-col>
<el-button style="margin-left: 10px;" size="small" prop="submitUpload" type="success" @click="submitCron">启动</el-button>
<el-button style="margin-left: 10px;" size="small" prop="submitUpload" type="primary" @click="submitResumeCron">恢复</el-button>
<el-button style="margin-left: 10px;" size="small" prop="submitUpload" type="infor" @click="submitCronInfo">详情</el-button>
<el-button style="margin-left: 10px;" size="small" prop="submitUpload" type="primary" @click="submitCronModify">修改</el-button>
<el-button style="margin-left: 10px;" size="small" prop="submitUpload" type="warning" @click="submitCronPauseAll">暂停</el-button>
<el-button style="margin-left: 10px;" size="small" prop="submitUpload" type="danger" @click="submitCronDelete">删除</el-button>
<p v-show="isShow"><font size=1><b>{{tips}}</b></font></p>
          </el-form-item>
        </el-form>
  </div>

     


  <div>
    <el-table ref="tb" :data="tableData" border style="width: 100%" class="table">
      <el-table-column type="selection" fixed prop="ID" label="ID" width="100"></el-table-column>
      <el-table-column prop="Protocol" label="Protocol" width="100"></el-table-column>
      <el-table-column prop="Host" label="Host" width="100"></el-table-column>
      <el-table-column prop="URL" label="URL" width="200"></el-table-column>
      <el-table-column prop="ContentType" label="ContentType" width="200"></el-table-column>
      <el-table-column prop="RequestMethod" label="RequestMethod" width="100"></el-table-column>
      <el-table-column prop="Head" label="Head" width="200"></el-table-column>
      <el-table-column prop="ResponseData" label="ResponseData" width="330"></el-table-column>
      <el-table-column prop="FinalTestResult" label="FinalTestResult" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.FinalTestResult==='测试通过'" style="color: green">测试通过</span>
          <span v-else-if="scope.row.FinalTestResult==='测试不通过'" style="color: red">测试不通过</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="Operation" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="editItem(scope.$index, tableData)" type="text" size="large">测试</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      class="pagination"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      v-on:current-change="changePage"
    ></el-pagination>-->
    <!-- <db-modal :dialogFormVisible="dialogFormVisible" :form="form" v-on:canclemodal="dialogVisible"></db-modal> -->
  </div>
</html>
</template>

<script>
import DbModal from "../DB/DbModal.vue";
import Bus from "../../eventBus";
import XLSX from "xlsx";
import { mapState, mapActions } from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      fileList: [],
      outputs: [],
      tableData: [],
      apiUrl: "http://127.0.0.1:8000/api/persons/testPlan",
      apiCronUrl: "http://127.0.0.1:8000/api/persons/start",
      apiCronResumeUrl: "http://127.0.0.1:8000/api/persons/resume",
      apiCronModifyUrl: "http://127.0.0.1:8000/api/persons/modify",
      apiCronPauseAllUrl: "http://127.0.0.1:8000/api/persons/pauseAll",
      apiCronDeleteUrl: "http://127.0.0.1:8000/api/persons/delete",
      apiCronInfoUrl: "http://127.0.0.1:8000/api/persons/info",
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      form: "",
      cronValue: "",
      tips: "",
                  btnText:"隐藏",

            isShow:true
    };
  },
  components: {
    DbModal
  },
  mounted() {
    this.readTestCase();
    setInterval(() => {
      this.readTestCase()
    }, 60000)
    // this.$refs.upload.$el.addEventListener("change", e => {
    //   //绑定监听表格导入事件
    //   //this.getCustomers(this.readExcel(e));
    //   this.readExcel(e);
    //   //this.submitUpload(e);
    // });
  },
  methods: {
    changePage: function(currentPage) {
      this.currentPage = currentPage;
      this.getCustomers();
    },
    submitCron() {
      //this.$refs.upload.submit();
      this.$http.post(
          this.apiCronUrl,
          {
            data:this.cronValue
          },
          {headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            }
          }
        )
        .then(response => {
          // for(var i = 0 ; i < this.tableData.length ; i++){
          //   this.tableData[i].ResponseData=response.data[i].responseData;
          //   this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          // }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    submitResumeCron() {
      //this.$refs.upload.submit();
      this.$http.get(
          this.apiCronResumeUrl,
          {
            data:this.cronValue
          },
          {headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            }
          }
        )
        .then(response => {
          // for(var i = 0 ; i < this.tableData.length ; i++){
          //   this.tableData[i].ResponseData=response.data[i].responseData;
          //   this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          // }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    submitCronInfo() {
      //this.$refs.upload.submit();
      this.$http.get(
          this.apiCronInfoUrl,
          {
            data:this.cronValue
          },
          {headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            }
          }
        )
        .then(response => {
          console.log(response.data);
                          this.isShow = !this.isShow
                this.tips=response.data;
                if(this.isShow){

                    this.btnText = "隐藏"

                }else{

                    this.btnText = "显示"

                }
          //this.tips=response.data;
          // for(var i = 0 ; i < this.tableData.length ; i++){
          //   this.tableData[i].ResponseData=response.data[i].responseData;
          //   this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          // }
          
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    submitCronModify() {
      //this.$refs.upload.submit();
      this.$http.post(
          this.apiCronModifyUrl,
          {
            data:this.cronValue
          },
          {headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            }
          }
        )
        .then(response => {
          // for(var i = 0 ; i < this.tableData.length ; i++){
          //   this.tableData[i].ResponseData=response.data[i].responseData;
          //   this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          // }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
      submitCronPauseAll() {
      //this.$refs.upload.submit();
      this.$http.get(
          this.apiCronPauseAllUrl,
          {
            data:this.cronValue
          },
          {headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            }
          }
        )
        .then(response => {
          // for(var i = 0 ; i < this.tableData.length ; i++){
          //   this.tableData[i].ResponseData=response.data[i].responseData;
          //   this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          // }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    submitCronDelete() {
      //this.$refs.upload.submit();
      this.$http.get(
          this.apiCronDeleteUrl,
          {
            data:this.cronValue
          },
          {headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            }
          }
        )
        .then(response => {
          // for(var i = 0 ; i < this.tableData.length ; i++){
          //   this.tableData[i].ResponseData=response.data[i].responseData;
          //   this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          // }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    readTestCase() {
      this.$http
        .get(this.apiUrl, {
          params: {
            //page: this.currentPage,
            //sex: this.sex,
            //email: this.email
          }
        })
        .then(response => {
          this.tableData = response.data;
          for(var i = 0 ; i < this.tableData.length ; i++){
            this.tableData[i].Protocol=response.data[i].protocol;
            this.tableData[i].URL=response.data[i].url;
            this.tableData[i].ContentType=response.data[i].contentType;
            this.tableData[i].RequestMethod=response.data[i].requestMethod;
            this.tableData[i].Head=response.data[i].head;
            this.tableData[i].ResponseData=response.data[i].responseData;
            this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          }
          // this.total = response.data.data.total;
          // this.pageSize = response.data.data.count;
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    getCustomers: function(tableData) {
      this.$axios
        .get(this.apiUrl, {
          params: {
            page: this.currentPage,
            sex: this.sex,
            email: this.email
          }
        })
        .then(response => {
          //this.tableData = response.data.data.results;
          this.tableData = tableData;
          //this.total = response.data.data.total;
          //this.pageSize = response.data.data.count;
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    editItem: function(index, row) {
      this.$refs.tb.toggleRowSelection(this.$refs.tb.data[index], true);
    }
  }
};
</script>

    <style>
label {
  position: relative;
  display: inline-block;
  background: #d0eeff;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1e88c7;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  cursor: pointer;
}
/*隐藏默认样式*/
input[id="file"] {
  margin-left: -2000px;
  height: 0;
}
</style>