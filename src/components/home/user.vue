<template>
    <div class="user">
        <el-container>
            <el-header>
                <div class="header1">
                    <span>昵称</span>
                    <el-input v-model="nickName" placeholder="请输入昵称" @keyup.native.enter="queryList('initPage')"
                              class="userName"></el-input>
                </div>
                <div class="header3">
                    <span>手机号</span>
                    <el-input v-model.trim="phoneNumber" placeholder="请输入手机号" @keyup.native.enter="queryList('initPage')"
                              class="phone"></el-input>
                </div>
                <div class="header6">
                    <p class="globalHistoryDeleteBtnBg" @click="openDeleteHistory" style="margin-right: 20px;" >删除历史</p>
                    <p class="search globalSearchBtnBg" @click="queryList('initPage')">检索</p>
                </div>
            </el-header>
            <el-main>
                <template>
                    <el-table
                            v-loading="loading"
                            :data="tableData"
                            stripe
                            style="width: 100%"
                            max-height="670"
                            border
                            id="useTableId"
                            ref="userTable">
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="personName" label="昵称" show-overflow-tooltip></el-table-column>
                        <el-table-column label="头像">
                            <template slot-scope="scope">
                                <el-image
                                        style="width: 30px;height: 30px;margin-top: 6px;"
                                        :src="scope.row.imgurl"
                                        fit="cover">
                                    <div slot="error" class="image-slot" style="margin-top: 5px;">
                                        <i class="el-icon-picture-outline" style="font-size: 24px;"></i>
                                    </div>
                                </el-image>
                                <!-- <img src="../../assets/img/home/头像.png" alt style="width: 30px;height: 30px" /> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号"></el-table-column>
                        <!-- {{parseThirdbinding(scope.row)}} -->
                        <el-table-column label="第三方绑定" class-name="thirdBindingCls">
                            <template slot-scope="scope">
                                <i v-if="scope.row.types==null||scope.row.types===''" title="其他"
                                   class="iconfont iconqita"></i>
                                <i v-if="scope.row.types&&scope.row.types.indexOf('0')>0"
                                   class="iconfont iconshouji"></i>
                                <i v-if="scope.row.types&&scope.row.types.indexOf('1')>0"
                                   class="iconfont iconosm-qq"></i>
                                <i v-if="scope.row.types&&scope.row.types.indexOf('2')>0"
                                   class="iconfont iconosm-weixin"></i>
                                <i v-if="scope.row.types&&scope.row.types.indexOf('3')>0"
                                   class="iconfont iconosm-weibo"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="insertTime" label="注册时间"></el-table-column>
                        <!-- 0：正常；1：禁言；2：已删除 -->
                        <el-table-column label="禁言状态">
                            <template slot-scope="scope">
                                <el-switch
                                        :value="scope.row.userStatus==1"
                                        active-color="#CAA267"
                                        inactive-color="#FFFFFF"
                                        @click.native="stopBubble"
                                        @change="openForbid(scope.$index,scope.row)"
                                ></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <button @click="editUser(scope.row)">修改</button>
                                <button class="deleteCls" @click="deleteUser(scope.row)">删除</button>
                                <button class="logBtnCls" @click="open_operationLog(scope.row)">日志</button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <div>
                    <paging :total="total" :currentPage.sync="currentPage" :pageSize="pageSize"></paging>
                </div>
            </el-main>
        </el-container>

        <el-dialog
                title="修改"
                :visible.sync="showEditDialog"
                custom-class="edituserCls"
                @opened="editModalOpenedFunc"
                @open="openFunc"
                width="600px">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="60px" label-position="right"
                     class="editUserForm">
                <el-form-item label="昵称:" prop="modal_nickName">
                    <el-input v-model="form.modal_nickName" style="width: calc(100% - 100px);"></el-input>
                    <span class="initBtn" style="" @click="initNick">初始化</span>
                </el-form-item>
                <el-form-item label="头像:" class="avatorForm">
                    <!-- <el-upload
                        ref="upload"
                        class="avatorUpload"
                        action="http://hongqi.wengetech.com:9001/activities/fileUpload"
                        name="file"
                        list-type="picture-card"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-exceed="handleExceed"
                        :limit="1"
                        :file-list="defaultFileList"
                        style="width: 108px;display: inline-block;">
                        <i class="el-icon-plus"></i>
                    </el-upload> -->

                    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                        <template v-if="item.status === 'success'">
                            <img :src="item.url">
                            <!-- <span :title="item.name">{{item.name}}</span> -->
                            <div class="demo-upload-list-cover">
                                <i class="el-icon-delete" style="font-size: 20px;" @click="handleRemove(item)"></i>
                            </div>
                        </template>
                        <template v-else>
                            <el-progress style="line-height: 108px;" :text-inside="true" :stroke-width="24"
                                         :percentage="item.percentage" status="success"></el-progress>
                        </template>
                    </div>
                    <el-upload
                            class="avatorUpload"
                            name="file"
                            :action="commonUploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-change="handleChange"
                            :before-upload="beforeAvatarUpload"
                            :on-exceed="handleExceed"
                            :limit="1"
                            :file-list="uploadList"
                            style="">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span class="initBtn" style="margin-top: 90px;" @click="initAvator">初始化</span>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('all','ruleForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 操作日志弹框 -->
        <operationLog :operationLogModal="operationLogModal" :operationlog_rowData="operationlog_rowData" :Operationlog_fromMark="Operationlog_fromMark" @operationlog_childEvent="operationLog_parentMethod"></operationLog>
        <!-- 删除历史弹框 -->
        <deleteHistoryLog :deleteHistoryLogModal="deleteHistoryLogModal"
                          :deleteHistoryRow="deleteHistoryRow"
                          :fromPage="fromPage"
                          @deleteHistoryLog_childEvent="deleteHistoryLog_parentMethod"
                          @sycncRefresh_childEvent="sycncRefresh_parentMethod"></deleteHistoryLog>
    </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import operationLog from '@/components/home/modalComponents/operationLog';
  import deleteHistoryLog from '@/components/home/modalComponents/deleteHistoryLog';

  export default {
    name: "user",
    components: {
      operationLog,
      deleteHistoryLog
    },
    data() {
      /* var validatePass = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请输入密码'));
          } else {
              if (this.ruleForm.checkPass !== '') {
                  this.$refs.ruleForm.validateField('checkPass');
              }
              callback();
          }
      }; */
      return {
        imageurl: "",
        // 保存时要传的url
        sendImageUrl: "",
        // 默认文件列表
        //uploadList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        uploadList: [],
        form: {
          modal_nickName: ""
        },
        rules: {
          modal_nickName: [
            { required: true, message: "请输入昵称", trigger: "blur" }
          ]
          /* checkPass: [
              { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
              { validator: checkAge, trigger: 'blur' }
          ] */
        },
        options: [
          {
            value: "选项1",
            label: "黄金糕"
          },
          {
            value: "选项2",
            label: "双皮奶"
          },
          {
            value: "选项3",
            label: "蚵仔煎"
          },
          {
            value: "选项4",
            label: "龙须面"
          },
          {
            value: "选项5",
            label: "北京烤鸭"
          }
        ],
        nickName: "",  //昵称
        phoneNumber: "",  //手机号
        value1: "",
        tableData: [],
        checked: false,
        state: true,
        radio: "2",
        loading: false,
        currentPage: 1,
        pageSize: 10,
        total: 10,
        showEditDialog: false, //弹框标记
        currentData: "",  //行数据
        // 默认头像
        defaultImg: "http://hongqi.wengegroup.com:8888/group1/M00/00/11/wKgBe12Jk1SAZX1lAAANEPuKHRA650.png",
        //上传地址--红旗共用
        commonUploadUrl:this.api.getHongqiUploadUrl(),
        //日志弹框
        operationLogModal:false,
        operationlog_rowData:'',
        Operationlog_fromMark:'',  //点击来源
        //删除历史弹框
        deleteHistoryLogModal:false,
        deleteHistoryRow:'',
        fromPage:'',
      };
    },
    computed: {
      ...mapGetters([
        "appId"
      ])
    },
    methods: {
      /* -----上传头像start -----------*/
      handleAvatarSuccess(res, file, fileList) {
        //this.imageurl = URL.createObjectURL(file.raw);
        if (res.success) {
          this.sendImageUrl = res.data[0];
          file.url = res.data[0];
        }
        this.uploadList = fileList;
      },
      beforeAvatarUpload(file) {
        let imgStr_reg = /\.(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG|GIF|gif)$/;
        //截取格式后缀
        let formatIndex = file.name.lastIndexOf(".");
        let waitingForVertification = file.name.slice(formatIndex);
        const check = imgStr_reg.test(waitingForVertification);
        if (!check) {
          this.$message.error("上传头像图片只能是 JPG、PNG 等图片格式!");
        }

        return check;

        /* const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M; */
      },
      handleExceed(file, filelist) {
        //本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件
        this.$message.warning(`上传头像限制选择 1 个文件，请删除后再上传`);
      },
      handleRemove(file) {
        const fileList = this.uploadList;
        this.uploadList.splice(fileList.indexOf(file), 1);
      },
      handleChange(file, fileList) {
        this.uploadList = fileList;
      },
      /* -----上传头像end -----------*/
      //打开弹框
      openFunc() {
        // 清空
        this.uploadList = [];
        this.sendImageUrl = "";
        // 行数据
        this.form.modal_nickName = this.currentData.personName;
        let arr = [];
        if (this.currentData.imgurl) {
          arr = [{
            name: "",
            url: this.currentData.imgurl,
            status: "success"
          }];
        } else {
          arr = [];
        }
        this.uploadList = arr;
      },
      // 动画完成后打开
      editModalOpenedFunc() {
        if (this.uploadList.length > 0) {
          $(".avatorUpload").hide();
        } else {
          $(".avatorUpload").show();
        }
      },
      //点击初始化昵称按钮
      initNick() {
        this.form.modal_nickName = (this.currentData.personName ? this.currentData.personName : "") + (this.currentData.autoId ? this.currentData.autoId : "");
      },
      // 点击初始化头像按钮
      initAvator() {
        this.uploadList = [{
          name: "",
          url: this.defaultImg,
          status: "success"
        }];
        // 默认头像赋值 传值用
        this.sendImageUrl = this.defaultImg;
      },
      stopBubble() {
        event.stopPropagation();
      },
      parseThirdbinding(data) {
        switch (data.type) {
          case 0:
            return "手机用户";
          case 1:
            return "qq";
          default:
            return "";
        }
      },
      async saveFunc() {
        try {
          let params = {
            autoId: this.currentData.autoId,
            personName: this.form.modal_nickName,
            imgurl: this.sendImageUrl
          };
          const res = await this.api.updateBanned(params);
          if (res.success) {
            this.showEditDialog = false;
            this.queryList();
            this.$message({
              type: "success",
              message: res.message
            });
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        } catch (e) {
          console.log(e);
        }
      },
      // 点击提交按钮
      submitForm(par, formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveFunc();
          } else {
            this.$message({
              message: "校验失败",
              type: "warning"
            });
            return false;
          }
        });
      },
      // 修改用户
      editUser(rowData) {
        this.currentData = rowData;
        this.showEditDialog = true;
      },
      // 删除用户
      deleteUser(rowData) {
        this.$confirm("确定删除此用户吗？", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" })
          .then(async () => {
            this.loading = true;
            try {
              const res = await this.api.banned({
                userStatus: "2",  //已删除
                autoId: rowData.autoId
              });
              if (res.success) {
                this.queryList();
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
              } else {
                this.loading = false;
                this.$message({
                  type: "error",
                  message: "操作失败!"
                });
              }
            } catch (e) {
              console.log(e);
            }
          })
          .catch(() => {
            return;
          });
      },
      //  禁言状态开关
      openForbid(index, data) {
        //0：正常；1：禁言；2：已删除
        let obj = {
          titleStr: "",
          usedstatus: ""
        };

        if (data.userStatus == 1) {
          obj.titleStr = "确定要开放此用户吗？";
          obj.usedstatus = "0";
        } else {
          obj.titleStr = "确定要禁言此用户吗？";
          obj.usedstatus = "1";
        }

        this.$confirm(obj.titleStr, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            this.loading = true;
            try {
              const res = await this.api.updateBanned({
                userStatus: obj.usedstatus,
                autoId: data.autoId
              });
              if (res.success) {
                //this.tableData[index].status = obj.usedstatus;
                this.queryList();
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
              } else {
                this.loading = false;
                this.$message({
                  type: "error",
                  message: "操作失败!"
                });
              }
            } catch (e) {
              console.log(e);
            }
          })
          .catch(() => {
            return;
          });
      },
      // 查询用户列表
      async queryList(par) {
        this.loading = true;
        if (par == "initPage") {
          this.currentPage = 1;
        }

        try {
          const res = await this.api.queryUser({
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            personName: this.nickName.trim(),
            mobile: this.phoneNumber
          });
          this.loading = false;
          /* res.data.forEach(function(item,index){
              if( item.commentUser&&item.commentUser.userStatus == 1 ){
                  item.banned = true
              }else{
                  item.banned = false;
              }
          }) */
          this.tableData = res.data;
          this.total = res.total;
        } catch (e) {
          console.log(e);
        }
      },
      //操作日志弹框
      open_operationLog(row){
        this.operationLogModal = true;
        this.operationlog_rowData = row;
        this.Operationlog_fromMark = "user";
      },
      operationLog_parentMethod(param) {
        this.operationLogModal = param.operationLogModal;
        //仅在点击确定关闭弹框关闭时
        /* if( param.clickmark == "confirm" ){
          //刷新列表
          this.querySubscriptionList();
        } */
      },
      //删除历史弹框--start
      openDeleteHistory(row){
        this.deleteHistoryLogModal = true;
        this.deleteHistoryRow = row;
        this.fromPage = "user";
      },
      deleteHistoryLog_parentMethod(param) {
        this.deleteHistoryLogModal = param.deleteHistoryLogModal;
      },
      sycncRefresh_parentMethod(){
        // 刷新列表
        this.queryList("initPage");
      },
      /* ----------删除历史弹框end ---------*/
    },
    mounted() {
      this.queryList();
    },
    watch: {
      currentPage(newval, oldval) {
        if (newval) {
          this.queryList();
        }
      },
      //监听文件列表
      uploadList(val) {
        if (val.length > 0) {
          $(".avatorUpload").hide();
        } else {
          $(".avatorUpload").show();
        }
      }
    }
  };
</script>

<style lang="less">
    .user {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        .el-header {
            background: rgba(255, 255, 255, 1);
            display: flex;
            align-items: center;
            padding: 15px 28px;
            justify-content: space-between;
            div {
                display: inline-block;
                > span {
                    margin-right: 10px;
                }
                span {
                    color: rgba(26, 26, 26, 1);
                }
                .el-input__inner {
                    height: 30px;
                    border: 1px solid rgba(217, 217, 217, 1);
                    border-radius: 3px;
                    /* margin-left: 10px; */
                    margin-top: 5px;
                }
                .el-select {
                    width: 100px;
                    input {
                        background-position: 79px center;
                    }
                    i {
                        display: none;
                    }
                }
                .userName {
                    width: 180px;
                }
                .phone {
                    width: 300px;
                }
                .date-input {
                    position: relative;
                    top: 10px;
                }
                .el-date-editor {
                    background: url("../../assets/img/home/data.png") no-repeat 210px center;
                    width: 240px;
                    i {
                        display: none;
                    }
                    input {
                        width: 80px;
                        height: 15px;
                    }
                    input:nth-of-type(1) {
                        position: absolute;
                        top: 8px;
                        left: 10px;
                    }
                    input:nth-of-type(2) {
                        position: absolute;
                        top: 8px;
                        right: 52px;
                    }
                    .el-range-separator {
                        position: absolute;
                        top: -1px;
                        left: 91px;
                        padding: 0;
                    }
                }
                .search {
                    width: 74px;
                    height: 30px;
                    /*background: rgba(201, 57, 49, 1);*/
                    border-radius: 3px;
                    text-align: center;
                    line-height: 30px;
                    color: rgba(255, 255, 255, 1);
                    cursor: pointer;
                    display: inline-block;
                }
            }
            .header1 {
                /*margin: 0 44px 0 28px;*/
            }
            .header2 {
                margin-right: 130px;
            }
            .header3 {
                /*margin-right: 30px;*/
            }
            .header6 {
                margin-left: 52.9%;
            }
        }
        .el-main {
            padding: 22px 28px;
            background: rgba(255, 255, 255, 1);
            margin-top: 10px;
            .el-table {
                margin-bottom: 20px;
            }
            .el-table--border {
                border-right: 1px solid #d9d9d9;
                border-bottom: 1px solid #d9d9d9;
            }
            tr {
                height: 48px;
            }
            th {
                background: rgba(246, 246, 246, 1);
                color: rgba(26, 26, 26, 1);
            }
            td {
                color: rgba(102, 102, 102, 1);
            }

            .el-table--striped .el-table__body tr.el-table__row--striped td {
                background: rgba(245, 247, 252, 1);
            }
            .el-table tbody .el-table__row--striped:hover > td,
            .el-table tbody tr:hover > td {
                background: rgba(227, 238, 255, 1);
            }
            th,
            td {
                display: table-cell !important; //解决表格边框错乱问题
                border: 1px solid #d9d9d9;
                border-bottom: 0;
                border-right: 0;
                padding: 0;
                .cell {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                button {
                    width: 42px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    border: 1px solid rgba(217, 217, 217, 1);
                    border-radius: 10px;
                    font-size: 11px;
                    color: #FFFFFF;
                    cursor: pointer;
                    background: #fff;
                }
                button:nth-of-type(1) {
                    background: rgba(201, 57, 49, 1);
                    margin-right: 15px;
                }
                button.deleteCls {
                    background: #B3B3B3;
                    margin-right: 15px;
                    /* margin-left: 15px; */
                }
                button.logBtnCls {
                    border-color: #c93931;
                    color: #c93931;
                }
                .jiantou {
                    margin-right: 22px;
                }
                .jiantou4 {
                    margin-right: 0;
                }
            }
            .el-switch__core:after {
                border: 1px solid rgba(217, 217, 217, 1);
                box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);
                top: 0;
            }
            .el-radio__input.is-checked .el-radio__inner {
                background: rgba(202, 162, 103, 1);
                border-color: rgba(202, 162, 103, 1);
            }
            .el-radio__input.is-checked + .el-radio__label {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
            }
            .foot-check {
                margin-left: 17px;
            }
            button {
                width: 70px;
                height: 30px;
                border-radius: 3px;
                border: 0;
                outline: none;
                /*color: rgba(255, 255, 255, 1);*/
            }
            .btn-pass {
                background: rgba(202, 162, 103, 1);
                margin-right: 12px;
                margin-left: 15px;
            }
            .btn-nopass {
                background: rgba(201, 57, 49, 1);
            }
        }

        /* 上传控件样式 */
        .avatorUpload {
            width: 108px;
            display: inline-block;
            height: 108px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
        }
        .avatorUpload .el-upload {

            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        /*.avatorUpload .el-upload:hover {
            border-color: #409EFF;
        }*/
        .avatorUpload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 108px;
            height: 108px;
            line-height: 108px;
            text-align: center;
        }
        .avatar {
            width: 108px;
            height: 108px;
            display: block;
        }

        .demo-upload-list {
            display: inline-block;
            text-align: center;
            width: 108px;
            height: 108px;
            line-height: 108px;
            border: 1px solid transparent;
            border-radius: 4px;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
            float: left;
        }

        .demo-upload-list img {
            width: 108px;
            height: 108px;
        }

        .demo-upload-list span {
            width: 110px;
            height: 30px;
            display: inline-block;
            text-align: center;
            position: absolute;
            bottom: -26px;
            left: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            line-height: 30px;
            white-space: nowrap;
        }

        .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, .6);
        }

        .demo-upload-list:hover .demo-upload-list-cover {
            display: block;
        }

        .demo-upload-list-cover i {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }

    }

    .el-message-box {
        width: 320px;
        height: 200px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        color: rgba(38, 38, 38, 1);
        .el-message-box__status,
        .el-message-box__header {
            display: none;
        }
        .el-message-box__content {
            padding-bottom: 48px;
            padding-top: 52px;
        }
        .el-message-box__message {
            text-align: center;
        }
        .el-message-box__btns {
            text-align: center;
            padding: 0;
            button {
                width: 80px;
                height: 34px;
                background: rgba(235, 235, 235, 1);
                border: 1px solid rgba(217, 217, 217, 1);
                border-radius: 3px;
            }
            button:nth-of-type(2) {
                background: rgba(201, 57, 49, 1);
            }
        }
    }
</style>
