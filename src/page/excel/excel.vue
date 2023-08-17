<template>
<html>
  <!-- <div>
  <label for="file" id="upFile">上传文件</label>
  <input type="file" ref="upload" accept=".xls, .xlsx">
    <p id="fileName"></p>
  </div>-->
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

  <div>
    <el-table ref="tb" :data="tableData" border style="width: 100%" class="table">
      <el-table-column type="selection" fixed prop="ID" label="ID" width="100"></el-table-column>
      <!-- <el-table-column prop="NAME" label="用户姓名" width="120"></el-table-column>
      <el-table-column prop="WORK" label="工作内容" width="330"></el-table-column>
      <el-table-column prop="FUTURE" label="发展方向" width="330"></el-table-column>-->
      <!-- excel template : #	Result	Protocol	Host	URL	Body	Caching	Content-Type	RequestMethod	Head -->
      <!-- <el-table-column prop="Result" label="Result" width="80"></el-table-column> -->
      <el-table-column prop="Protocol" label="Protocol" width="100"></el-table-column>
      <el-table-column prop="Host" label="Host" width="100"></el-table-column>
      <el-table-column prop="URL" label="URL" width="200"></el-table-column>
      <!-- <el-table-column prop="Body" label="Body" width="330"></el-table-column>
      <el-table-column prop="Caching" label="Caching" width="330"></el-table-column>-->
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
      apiUrl: "#",
      apiUrlForSubmit: "http://127.0.0.1:8000/api/persons/excel",
      apiUrlForDB: "http://127.0.0.1:8000/api/persons/insertDB",
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      form: ""
    };
  },
  components: {
    DbModal
  },
  mounted() {
    this.$refs.upload.$el.addEventListener("change", e => {
      //绑定监听表格导入事件
      //this.getCustomers(this.readExcel(e));
      this.readExcel(e);
      //this.submitUpload(e);
    });
  },
  methods: {
    changePage: function(currentPage) {
      this.currentPage = currentPage;
      this.getCustomers();
    },
    submitUpload(e) {
      //this.$refs.upload.submit();
      this.$http.post(
          this.apiUrlForSubmit,
          {data:this.outputs},
          // {headers: {
          //     "Content-type": "application/json",
          //     "Accept": "application/json"
          //   }
          // }
        )
        .then(response => {
          for(var i = 0 ; i < this.tableData.length ; i++){
            this.tableData[i].ResponseData=response.data[i].responseData;
            this.tableData[i].FinalTestResult=response.data[i].finalTestResult;
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    submitDB(e) {
      //this.$refs.upload.submit();
      console.log
      this.$http.post(
          this.apiUrlForDB,
          {
            data:this.outputs
          },
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
    readExcel(e) {
      //表格导入
      var that = this;
      const files = e.target.files;
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          that.outputs = []; //清空接收数据
          for (var i = 0; i < ws.length; i++) {
            var sheetData = {
              ID: ws[i].ID,
              // Result: ws[i].Result,
              Protocol: ws[i].Protocol,
              Host: ws[i].Host,
              URL: ws[i].URL,
              //Body: ws[i].Body,
              // Caching: ws[i].Caching,
              ContentType: ws[i].ContentType,
              RequestMethod: ws[i].RequestMethod,
              Head: ws[i].Head,
              ResponseData: ws[i].ResponseData,
              FinalTestResult: ws[i].FinalTestResult
            };
            that.outputs.push(sheetData);
          }
          this.$refs.upload.value = "";
          this.getCustomers(that.outputs);
          //return this.outputs.pop(sheetData);
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
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