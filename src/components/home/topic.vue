<template>
    <div class="topic">
        <el-container>
            <el-header>
                <div>
                    <span>*</span>
                    <span>前8个话题将会在app导航栏中显示</span>
                </div>
                <div class="globalSearchBtnBg" @click="addTopic">新建话题</div>
                <div class="globalHistoryDeleteBtnBg" @click="openDeleteHistory" style="margin-right: 20px;" >删除历史</div>
            </el-header>
            <el-main>
                <template>
                    <el-table
                            :data="tableData"
                            row-key="topicId"
                            row-class-name="el-dragRowCls"
                            stripe
                            style="width: 100%"
                            max-height="700"
                            border
                            v-loading="loading">
                        <el-table-column prop="number" label="序号" width="50">
                            <template slot-scope="scope">{{scope.$index+1}}</template>
                        </el-table-column>
                        <el-table-column prop="topicName" label="话题名称"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"></el-table-column>
                        <el-table-column prop="blogCount" label="动态数"></el-table-column>
                        <el-table-column prop="synopsis" label="话题简介" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="topicPic" label="话题头像">
                            <template slot-scope="scope">
                                <img :src="scope.row.topicPic" alt style="width: 30px;height: 30px"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="background" label="话题背景">
                            <template slot-scope="scope">
                                <img :src="scope.row.background" alt style="width: 110px;height: 30px"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="排序">
                            <template slot-scope="scope">
                                <el-tooltip content="置顶" placement="top">
                                    <img
                                            src="../../assets/img/home/top.png"
                                            alt
                                            class="jiantou"
                                            @click="goTop(scope.$index)"
                                    />
                                </el-tooltip>
                                <el-tooltip content="上移" placement="top">
                                    <img
                                            src="../../assets/img/home/up.png"
                                            alt
                                            class="jiantou"
                                            @click="goUp(scope.$index)"
                                    />
                                </el-tooltip>
                                <el-tooltip content="下移" placement="top">
                                    <img
                                            src="../../assets/img/home/down.png"
                                            alt
                                            class="jiantou"
                                            @click="goDown(scope.$index)"
                                    />
                                </el-tooltip>
                                <el-tooltip content="置底" placement="top">
                                    <img
                                            src="../../assets/img/home/bottom.png"
                                            alt
                                            class="jiantou jiantou4"
                                            @click="goBottom(scope.$index)"
                                    />
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态">
                            <template slot-scope="scope">
                                <el-switch
                                        :value="scope.row.status==1"
                                        active-color="#CAA267"
                                        inactive-color="#FFFFFF"
                                        @click.native="stopBubble"
                                        @change="changeStatus(scope.$index,scope.row)"
                                ></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation" label="操作">
                            <template slot-scope="scope">
                                <button @click="editTopic(scope.row)">修改</button>
                                <button class="deleteCls" @click="deleteTopic(scope.$index,scope.row)">删除</button>
                                <button class="logBtnCls" @click="open_operationLog(scope.row)">日志</button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-main>
            <el-dialog :visible.sync="dialogVisible" :title="modalTitle" custom-class="newTopicCls" @close="closeModal" width="600px">
                <div>
                    <el-form :model="topicForm" ref="topicForm" label-width="90px" class="demo-ruleForm">
                        <!--:rules="[
                        { required: true, validator: validateTopicname, trigger: 'change' }]"-->
                        <el-form-item
                                label="话题名称"
                                prop="topicName"
                                :rules="[
                { required: true, message: '请输入话题名称', trigger: 'blur' }]"
                        >
                            <el-input v-model="topicForm.topicName" placeholder="限40个字" maxlength="40"></el-input>
                        </el-form-item>
                        <!--:rules="[{ required: false, validator: validateTopicdesc, trigger: 'change' }]"-->
                        <el-form-item label="话题简介" prop="synopsis">
                            <el-input type="textarea" placeholder="限255个字" v-model="topicForm.synopsis" maxlength="255"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="话题头像"
                                prop="topicPic"
                                :rules="[
                { required: true, message: '请上传话题头像', trigger: 'change' }]"
                        >
                            <el-upload
                                    class="avatar-uploader"
                                    :action="commonUploadUrl"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                            >
                                <img v-if="topicForm.topicPic" :src="topicForm.topicPic" class="avatar"/>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <span class="imgtips">120px*120px</span>
                        </el-form-item>
                        <el-form-item
                                label="话题背景"
                                prop="background"
                                :rules="[
                { required: true, message: '请上传话题背景', trigger: 'change' }]"
                        >
                            <el-upload
                                    class="avatar-uploader"
                                    :action="commonUploadUrl"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess1"
                                    :before-upload="beforeAvatarUpload"
                            >
                                <img v-if="topicForm.background" :src="topicForm.background" class="avatar avatar1"/>
                                <i v-else class="el-icon-plus avatar-uploader-icon avatar-uploader-icon1"></i>
                            </el-upload>
                            <span class="imgtips">750px*220px</span>
                        </el-form-item>
                        <el-form-item
                                label="话题导航"
                                prop="pictureUrl"
                                :rules="[
                { required: true, message: '请上传话题导航', trigger: 'change' }]"
                        >
                            <el-upload
                                    class="avatar-uploader"
                                    :action="commonUploadUrl"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess2"
                                    :before-upload="beforeAvatarUpload"
                            >
                                <img v-if="topicForm.pictureUrl" :src="topicForm.pictureUrl" class="avatar avatar2"/>
                                <i v-else class="el-icon-plus avatar-uploader-icon avatar-uploader-icon2"></i>
                            </el-upload>
                            <span class="imgtips">268px*140px</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="submitTopic('topicForm')">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </el-container>

        <!-- 操作日志弹框 -->
        <operationLog :operationLogModal="operationLogModal"
                      :operationlog_rowData="operationlog_rowData"
                      :Operationlog_fromMark="Operationlog_fromMark"
                      @operationlog_childEvent="operationLog_parentMethod"></operationLog>
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
  import Sortable from "sortablejs";
  import operationLog from '@/components/home/modalComponents/operationLog';
  import deleteHistoryLog from '@/components/home/modalComponents/deleteHistoryLog';

  export default {
    name: "CommentCheck",
    components: {
      operationLog,
      deleteHistoryLog
    },
    computed: {
      ...mapGetters(["appId"])
    },
    data() {
      return {
        loading: false, //表格遮罩
        tableData: [],
        dialogVisible: false,
        topicForm: {
          //弹框表单
          topicName: "",
          synopsis: "",
          topicPic: "",
          background: "",
          pictureUrl: ""
        },
        //上传地址--红旗共用
        commonUploadUrl: this.api.getHongqiUploadUrl(),
        modalTitle: "新建话题",
        isEditFlag: false, //区分是新增还是修改
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
    methods: {
      //话题名称校验
      validateTopicname(rule, value, callback){
        if (value === '' || value == null) {
          callback(new Error('请输入话题名称！'));
        } else {
          if ( value.length > 40 ) {
            callback(new Error('话题名称长度不得超过40！'));
          }
          callback();
        }
      },
      //话题简介校验
      validateTopicdesc(rule, value, callback){
        if (value === '' || value == null) {
          callback();
        } else {
          if ( value.length > 255 ) {
            callback(new Error('话题简介长度不得超过255！'));
          }
          callback();
        }
      },
      //行拖拽
      rowDrop() {
        const tbody = document.querySelector(".topic .el-table__body-wrapper tbody");
        const _this = this;
        Sortable.create(tbody, {
          animation: 150,  // 毫秒，排序时移动物品的动画速度，`0`则表示无动画。
          ghostClass: "sortable-ghost-class",  //拖放时，提前预设DOM节点的class名称，可在此class下定义相应的样式
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.tableData.splice(oldIndex, 1)[0];
            _this.tableData.splice(newIndex, 0, currRow);
            _this.updateTopicFunc();
          }
        });
      },
      stopBubble(event) {
        event.stopPropagation();
      },
      swapItem(index1, index2) {
        //交换位置
        this.tableData[index1] = this.tableData.splice(
          index2,
          1,
          this.tableData[index1]
        )[0];
      },
      async goTop(index) {
        //置顶
        if (index == 0) {
          this.$message({
            type: "warning",
            message: "到顶了！"
          });
          return;
        }
        this.tableData.unshift(this.tableData.splice(index, 1)[0]);
        this.updateTopicFunc();
      },
      async goUp(index) {
        //上移
        if (index == 0) {
          this.$message({
            type: "warning",
            message: "到顶了！"
          });
          return;
        }
        this.swapItem(index, index - 1);
        this.updateTopicFunc();
      },
      async goDown(index) {
        //下移
        if (index == this.tableData.length - 1) {
          this.$message({
            type: "warning",
            message: "到底了！"
          });
          return;
        }
        this.swapItem(index, index + 1);
        this.updateTopicFunc();
      },
      async goBottom(index) {
        //置底
        if (index == this.tableData.length - 1) {
          this.$message({
            type: "warning",
            message: "到底了！"
          });
          return;
        }
        this.tableData.push(this.tableData.splice(index, 1)[0]);
        this.updateTopicFunc();
      },
      // 调用接口更新话题顺序
      async updateTopicFunc() {
        try {
          const res = await this.api.updateTopicSort(this.tableData);
          if (res.success) {
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
      //查询全部话题
      async getTopicList() {
        try {
          this.loading = true;
          const res = await this.api.getTopic({
            appInfoId: this.appId
          });
          this.tableData = res.data;
          this.loading = false;
        } catch (e) {
          console.log(e);
          this.loading = false;
        }
      },
      //更改状态
      changeStatus(index, data) {
        if (data.status == 1) {
          this.$confirm("确定要禁止此条话题吗？", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              try {
                const res = await this.api.auditTopic({
                  appInfoId: this.appId,
                  topicId: data.topicId,
                  status: 0
                });
                if (res.success) {
                  this.tableData[index].status = "0";
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                } else {
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
        } else {
          this.$confirm("确定要显示此条话题吗？", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              try {
                const res = await this.api.auditTopic({
                  appInfoId: this.appId,
                  topicId: data.topicId,
                  status: 1
                });
                if (res.success) {
                  this.tableData[index].status = "1";
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                } else {
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
        }
      },
      //删除话题
      deleteTopic(index, data) {
        this.$confirm("确定要删除此条话题吗？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            try {
              const res = await this.api.deleteTopic({
                appInfoId: this.appId,
                topicId: data.topicId
              });
              if (res.success) {
                this.getTopicList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
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
      //上传图片
      handleAvatarSuccess(res, file) {
        this.topicForm.topicPic = res.data[0];
      },
      // 上传图片
      handleAvatarSuccess1(res, file) {
        this.topicForm.background = res.data[0];
      },
      //上传图片
      handleAvatarSuccess2(res, file) {
        this.topicForm.pictureUrl = res.data[0];
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isPng = file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPng) {
          this.$message.error("上传头像图片只能是 JPG/png 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return (isJPG || isPng) && isLt2M;
      },
      //新建话题
      addTopic() {
        this.modalTitle = "新建话题";
        // 清空数据
        this.topicForm = {
          //弹框表单
          topicName: "",
          synopsis: "",
          topicPic: "",
          background: "",
          pictureUrl: ""
        };
        this.dialogVisible = true;
        this.isEditFlag = false;
      },
      //修改话题
      async editTopic(data) {
        this.modalTitle = "修改话题";
        this.isEditFlag = true;
        try {
          const res = await this.api.getTopicById({
            appInfoId: this.appId,
            topicId: data.topicId
          });
          if (res.success) {
            this.dialogVisible = !this.dialogVisible;
            this.topicForm = res.data[0];
          } else {
            this.$message({
              type: "error",
              message: "获取信息失败!"
            });
          }
        } catch (e) {
          console.log(e);
        }
      },
      //关闭弹框
      closeModal(){
        if (this.$refs["topicForm"] !== undefined) {
          this.$refs["topicForm"].resetFields();
        }
      },
      //提交话题
      async submitTopic(formName) {
        /*if (!this.topicForm.topicName) {
          this.$message.error("话题名称必须填写!");
          return;
        }*/
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.submitFunc();
          }else{
            this.$message.error("校验失败！");
            return;
          }
        });
      },
      async submitFunc(){
        try {
          this.topicForm.appInfoId = this.appId;
          this.topicForm.createId = 1; //-todo,写死的数据
          let res;
          if (this.isEditFlag) {
            res = await this.api.updateTopic(this.topicForm);
          } else {
            res = await this.api.addTopic(this.topicForm);
          }
          if (res.success) {
            this.$message({
              type: "success",
              message: res.message
            });
            this.getTopicList();
            this.dialogVisible = !this.dialogVisible;
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
      //操作日志弹框
      open_operationLog(row){
        this.operationLogModal = true;
        this.operationlog_rowData = row;
        this.Operationlog_fromMark = "topic";
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
        this.fromPage = "topic";
      },
      deleteHistoryLog_parentMethod(param) {
        this.deleteHistoryLogModal = param.deleteHistoryLogModal;
      },
      sycncRefresh_parentMethod(){
        // 刷新列表
        this.getTopicList();
      },
      /* ----------删除历史弹框end ---------*/
    },
    mounted() {
      this.rowDrop();
      this.getTopicList();
    }
  };
</script>

<style lang="less">
    .topic {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        .el-header {
            background: rgba(255, 255, 255, 1);
            span:nth-of-type(1) {
                color: rgba(201, 57, 49, 1);
                margin-right: 7px;
            }
            span:nth-of-type(2) {
                color: rgba(51, 51, 51, 1);
            }
            div:nth-of-type(1) {
                float: left;
                line-height: 60px;
            }
            div:nth-of-type(2) {
                float: right;
                width: 86px;
                height: 30px;
                /*background: rgba(201, 57, 49, 1);*/
                border-radius: 3px 3px 3px 3px;
                color: rgba(255, 255, 255, 1);
                text-align: center;
                line-height: 30px;
                margin-right: 8px;
                margin-top: 15px;
                cursor: pointer;
            }
            div:nth-of-type(3) {
                float: right;
                margin-top: 15px;
            }
        }
        .newTopicCls{
            &.el-dialog {
                border-radius: 10px;
            }
            .el-dialog__header {
                border-bottom: 1px solid rgba(217, 217, 217, 1);
            }
            .el-dialog__title {
                color: rgba(26, 26, 26, 1);
                font-size: 20px;
            }
            .el-dialog__body {
                padding-right: 100px;
            }
        }


        .el-form-item__label {
            font-size: 16px;
            color: rgba(102, 102, 102, 1);
        }
        .el-input__inner,
        .el-textarea__inner {
            background-color: rgba(245, 245, 245, 1);
        }
        .el-form-item__content {
            line-height: 0;
        }
        .el-form-item:last-child {
            margin-bottom: 0;
            > div {
                float: right;
                margin-right: -70px;
            }
            button {
                width: 80px;
                height: 34px;
                padding: 9px 15px;
                background: rgba(179, 179, 179, 1);
                border: 1px solid rgba(179, 179, 179, 1);
                border-radius: 3px;
                color: #fff;
            }
            button:nth-of-type(2) {
                background: rgba(201, 57, 49, 1);
                border: 1px solid rgba(201, 57, 49, 1);
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
                background: rgba(246, 246, 246, 1) !important;
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
                    border-radius: 10px;
                    font-size: 11px;
                    background: #fff;
                    color: #FFFFFF;
                    border: 1px solid rgba(217, 217, 217, 1);
                }
                button:nth-of-type(1) {
                    background: rgba(201, 57, 49, 1);
                    margin-right: 10px;
                }
                button.deleteCls {
                    background: #B3B3B3;
                    margin-right: 10px;
                }
                button.logBtnCls {
                    border-color: #c93931;
                    color: #c93931;
                }

                .jiantou {
                    margin-right: 15px;
                    margin-top: 8px;
                    cursor: pointer;
                }
                .jiantou4 {
                    margin-right: 0;
                }
            }
            td:nth-of-type(4) .cell {
                color: rgba(201, 57, 49, 1);
            }
            td:nth-of-type(5) {
                text-align: left;
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
                color: rgba(255, 255, 255, 1);
                cursor: pointer;
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

    // 上传
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
    }

    .avatar {
        width: 80px;
        height: 80px;
        display: block;
    }

    .avatar1,
    .avatar-uploader-icon1 {
        width: 240px;
        height: 70px;
        line-height: 70px;
    }

    .avatar2,
    .avatar-uploader-icon2 {
        width: 168px;
        height: 88px;
        line-height: 88px;
    }

    .avatar-uploader {
        display: inline-block;
        vertical-align: -2px;
    }

    .imgtips {
        color: rgba(179, 179, 179, 1);
        font-size: 12px;
        margin-left: 6px;
    }

    .avatar-uploader .el-upload {
        background-color: rgba(245, 245, 245, 1);
    }

    .el-textarea textarea {
        height: 140px;
    }

</style>
