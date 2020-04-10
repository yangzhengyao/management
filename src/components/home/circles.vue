<template>
  <div class="circles">
    <el-container>
      <el-header>
        <div>
          <span>*</span>
          <span>前8个圈子将会在app导航栏中显示</span>
        </div>
          <div class="globalSearchBtnBg" @click="addcircles">新建圈子</div>
         <div class="globalHistoryDeleteBtnBg" @click="openDeleteHistory" style="margin-right: 20px;" >删除历史</div>
      </el-header>
      <el-main>
        <template>
          <el-table
			:data="tableData"
			row-key="themeId"
			row-class-name="el-dragRowCls"
			stripe
			style="width: 100%"
            max-height="700"
            v-loading="loading"
			border>
            <el-table-column type="index" label="序号"  width="60"></el-table-column>
            <el-table-column prop="themeName" label="圈子名称"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="blogCount" label="动态数"></el-table-column>
            <el-table-column prop="synopsis" label="圈子简介" show-overflow-tooltip></el-table-column>
            <el-table-column prop="topicPic" label="圈子头像">
	            <template slot-scope="scope">
								<el-image
									style="width: 30px;height: 30px;"
									:src="scope.row.topicPic"
									fit="cover">
									<div slot="error" class="image-slot" style="margin-top: 5px;">
										<i class="el-icon-picture-outline" style="font-size: 24px;"></i>
									</div>
								</el-image>
							</template>
            </el-table-column>
            <el-table-column prop="background" label="圈子背景">
              <template slot-scope="scope">
								<el-image
									style="width: 110px;height: 30px;"
									:src="scope.row.background"
									fit="cover">
									<div slot="error" class="image-slot" style="margin-top: 5px;">
										<i class="el-icon-picture-outline" style="font-size: 24px;"></i>
									</div>
								</el-image>
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
            <el-table-column prop="state" label="状态">
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
                <button @click="editCircles(scope.row)">修改</button>
                <button class="deleteCls" @click="deleteCircles(scope.row)">删除</button>
                <button class="logBtnCls" @click="open_operationLog(scope.row)">日志</button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-dialog :visible.sync="dialogVisible" custom-class="newCircleCls" :title="modalTitle" @close="closeModal" width="30%">
        <div>
          <el-form :model="circlesForm" ref="circlesForm" label-width="95px" class="demo-ruleForm">
            <el-form-item
              label="圈子名称："
              prop="themeName"
              :rules="[
                { required: true, message: '请输入圈子名称', trigger: 'blur' }]"
            >
              <el-input v-model="circlesForm.themeName" placeholder="限10个字" maxlength="10" class="w400"></el-input>
            </el-form-item>
            <el-form-item label="圈子简介：" prop="synopsis">
              <el-input type="textarea" :rows="5" v-model="circlesForm.synopsis" ref="modal_synopsis"  placeholder="限50个字" maxlength="50" class="w400"></el-input>
            </el-form-item>
            <el-form-item
              label="圈子头像："
              prop="topicPic"
              :rules="[
                { required: true, message: '请上传圈子头像', trigger: 'blur' }]"
            >
              <el-upload
                class="avatar-uploader"
                :action="commonUploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="circlesForm.topicPic" :src="circlesForm.topicPic" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="imgtips">120px*120px</span>
            </el-form-item>
            <el-form-item
              label="圈子背景："
              prop="background"
              :rules="[
                { required: true, message: '请上传圈子背景', trigger: 'blur' }]"
            >
              <el-upload
                class="avatar-uploader"
                :action="commonUploadUrl"
                :show-file-list="false"
                :on-success="handleBackgroundSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="circlesForm.background" :src="circlesForm.background" class="avatar avatar1" />
                <i v-else class="el-icon-plus avatar-uploader-icon avatar-uploader-icon1"></i>
              </el-upload>
              <span class="imgtips">750px*220px</span>
            </el-form-item>
              <el-form-item
                      label="圈子导航："
                      prop="pictureUrl"
                      :rules="[
                { required: true, message: '请上传圈子导航', trigger: 'blur' }]"
              >
                  <el-upload
                          class="avatar-uploader"
                          :action="commonUploadUrl"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess2"
                          :before-upload="beforeAvatarUpload"
                  >
                      <img v-if="circlesForm.pictureUrl" :src="circlesForm.pictureUrl" class="avatar avatar2" />
                      <i v-else class="el-icon-plus avatar-uploader-icon avatar-uploader-icon2"></i>
                  </el-upload>
                  <span class="imgtips">268px*140px</span>
              </el-form-item>
            <el-form-item>
              <el-button class="unusualBtnCls" @click="dialogVisible = false">取消</el-button>
              <el-button class="unusualBtnCls" type="primary" @click="insertNewTheme('circlesForm')">确定</el-button>
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
import { mapState,mapGetters, mapMutations } from 'vuex';
import Sortable from 'sortablejs'
import operationLog from '@/components/home/modalComponents/operationLog';
import deleteHistoryLog from '@/components/home/modalComponents/deleteHistoryLog';

export default {
  name: "CommentCheck",
  components: {
    operationLog,
    deleteHistoryLog
  },
  data() {
    return {
      	circlesForm:{
          themeName:'',
          synopsis:'',
          topicPic:'',
          background:'',
          pictureUrl:''
			},
      textarea:"",
      value: "",
      input: "",
      value1: "",
      tableData: [],
      loading:false,
      checked: false,
      state: true,
      radio: "2",
      currentPage: 1,
			pageSize: 10,
			total: 10,
      dialogVisible:false,
      //上传地址--红旗共用
      commonUploadUrl:this.api.getHongqiUploadUrl(),
      modalTitle:'新建圈子',
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
  computed: {
		...mapGetters([
			'appId',
		])
	},
  methods: {
    //圈子名称校验
    validateCirclename(rule, value, callback){
      if (value === '' || value == null) {
        callback(new Error('请输入话题名称！'));
      } else {
        if ( value.length > 255 ) {
          callback(new Error('圈子名称长度不得超过255！'));
        }
        callback();
      }
    },
    //圈子简介校验
    validateCircledesc(rule, value, callback){
      if (value === '' || value == null) {
        callback();
      } else {
        if ( value.length > 255 ) {
          callback(new Error('圈子简介长度不得超过255！'));
        }
        callback();
      }
    },
    //行拖拽
	rowDrop() {
		const tbody = document.querySelector('.circles .el-table__body-wrapper tbody');
		const _this = this;
		Sortable.create(tbody, {
			animation: 150,  // 毫秒，排序时移动物品的动画速度，`0`则表示无动画。
			ghostClass: "sortable-ghost-class",  //拖放时，提前预设DOM节点的class名称，可在此class下定义相应的样式
			onEnd({ newIndex, oldIndex }) {
				const currRow = _this.tableData.splice(oldIndex, 1)[0];
				_this.tableData.splice(newIndex, 0, currRow);
				_this.updateCircleFunc();
			}
		})
	},
    stopBubble(event) {
      event.stopPropagation();
    },
    swapItem(index1, index2) { //交换位置
      this.tableData[index1] = this.tableData.splice(index2, 1, this.tableData[index1])[0];
    },
    goTop(index) { //置顶
      if(index == 0){
        this.$message({
          type: "warning",
          message: "到顶了！"
        });
        return
      }
      this.tableData.unshift(this.tableData.splice(index,1)[0]);
      this.updateCircleFunc();
    },
    goUp(index) { //上移
      if(index == 0){
        this.$message({
          type: "warning",
          message: "到顶了！"
        });
        return
      }
      this.swapItem(index,index-1);
      this.updateCircleFunc();
    },
    goDown(index) { //下移
      if(index == this.tableData.length-1){
        this.$message({
          type: "warning",
          message: "到底了！"
        });
        return
      }
      this.swapItem(index,index+1);
      this.updateCircleFunc();
    },
    goBottom(index){ //置底
       if(index == this.tableData.length-1){
         this.$message({
           type: "warning",
           message: "到底了！"
         });
        return
      }
      this.tableData.push(this.tableData.splice(index,1)[0]);
	  this.updateCircleFunc();
    },
	// 调用接口更新圈子排序
	async updateCircleFunc(){
		try {
		  const res = await this.api.updateSortTheme(this.tableData);
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
    //上传头像
     handleAvatarSuccess(res, file) {
        this.circlesForm.topicPic= res.data[0];
    },
     //上传背景
    handleBackgroundSuccess(res, file) {
        this.circlesForm.background=res.data[0];
    },
    //上传导航
    handleAvatarSuccess2(res, file) {
      this.circlesForm.pictureUrl = res.data[0];
    },
    //上传图片规则限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
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
    //关闭弹框
    closeModal(){
      if (this.$refs["circlesForm"] !== undefined) {
        this.$refs["circlesForm"].resetFields();
      }
    },
    // 获取圈子列表
    async getThemeList() {
      this.loading = true;
      try{
        const res = await this.api.getTheme({
          appInfoId:this.appId,
        });
        this.loading = false;
        this.tableData = res.data;
        this.total = res.total;
      }catch(e){
        console.log(e)
      }
    },
    // 新建
    addcircles(){
	  this.modalTitle = '新建圈子';
      this.dialogVisible = true;
      this.isEditFlag = false;
      // 清空数据
      this.circlesForm = {
        //弹框表单
        themeName:'',
        synopsis:'',
        topicPic:'',
        background:'',
        pictureUrl:''
      };
    },
    ///提交
     insertNewTheme(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.submitFunc();
        }else{
          this.$message.error("校验失败！");
          return;
        }
      });
      /*if (!this.circlesForm.themeName) {
        this.$message.error("圈子名称必须填写!");
        return;
      }*/
    },
    async submitFunc(){
      try {
        this.circlesForm.appInfoId = this.appId;
        this.circlesForm.createId = 1; //-todo,写死的数据
        let res;
        if (this.isEditFlag) {
          res = await this.api.updateTheme(this.circlesForm);
        } else {
          res = await this.api.insertTheme(this.circlesForm);
        }
        if (res.success) {
          this.$message({
            type: "success",
            message: res.message
          });
          this.getThemeList();
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
    // 删除圈子
    deleteCircles(rowData){
	    this.$confirm("确定删除此圈子吗？", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
      })
      .then(async () => {
					this.loading = true;
					try {
						const res = await this.api.deleteTheme({
							appInfoId: this.appId,
							themeId:rowData.themeId,
						});
						if (res.success) {
							this.$message({
								type: "success",
								message: "操作成功!"
              });
              this.getThemeList();
						}else{
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
    //修改圈子
    async editCircles(data) {
      this.modalTitle = '修改圈子';
      this.isEditFlag = true;
      try {
        const res = await this.api.getThemeById({
          appInfoId: this.appId,
          themeId: data.themeId
        });
        if (res.success) {
          this.dialogVisible = !this.dialogVisible;
          this.circlesForm = res.data[0];
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
    /*修改状态 */
    changeStatus(index,data){
	     if (data.status == 1) {
        this.$confirm("确定要禁止此圈子吗？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            try {
              const res = await this.api.updateStatusTheme({
                appInfoId: this.appId,
                themeId: data.themeId,
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
        this.$confirm("确定要显示此圈子吗？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            try {
              const res = await this.api.updateStatusTheme({
                appInfoId: this.appId,
                themeId: data.themeId,
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
    //操作日志弹框
    open_operationLog(row){
      this.operationLogModal = true;
      this.operationlog_rowData = row;
      this.Operationlog_fromMark = "circle";
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
      this.fromPage = "circle";
    },
    deleteHistoryLog_parentMethod(param) {
      this.deleteHistoryLogModal = param.deleteHistoryLogModal;
    },
    sycncRefresh_parentMethod(){
      // 刷新列表
      this.getThemeList();
    },
    /* ----------删除历史弹框end ---------*/
  },
  mounted() {
	this.rowDrop();
    this.getThemeList()
  }
};
</script>

<style lang="less">
.circles {
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
      div:nth-of-type(3) {
          float: right;
          margin-top: 15px;
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
        color:#FFFFFF;
        border: 1px solid rgba(217, 217, 217, 1);
      }

      button:nth-of-type(1) {
        background: rgba(201, 57, 49, 1);
        margin-right: 10px;
      }
      button.deleteCls {
          background: #B3B3B3;
          margin-right: 10px;
          /* margin-left: 15px; */
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
   .newCircleCls{
       &.el-dialog{
           width: 600px;
           /*height: 600px;*/
           background:rgba(255,255,255,1);
           box-shadow:0px 5px 10px 0px rgba(0, 0, 0, 0.5);
           border-radius:10px;
       }
       .el-dialog__title{
           font-size:20px;
           font-family:Microsoft YaHei;
           font-weight:400;
           color:rgba(26,26,26,1);
       }
       .el-dialog__header .el-icon-close{
           font-size: 20px;
           color: rgba(26,26,26,1);
           font-weight: 400;
       }
       .el-dialog__header{
           border-bottom: 1px solid rgba(217,217,217,1);
       }
       .el-dialog__body{
           padding: 15px 20px
       }

       .el-dialog__footer{
           padding: 0px 20px 20px;
       }
   }

  .el-input__inner,.el-textarea__inner{
    background:rgba(245,245,245,1);
  }
  .el-form-item__content{
    line-height: 0px;
  }
  .el-form-item__label{
    padding: 0px;
    font-size: 16px;
  }
  .unusualBtnCls.el-button{
    background:rgba(179,179,179,1);
     border-color:rgba(179,179,179,1);
  }
 .el-form-item:last-child {
    margin-bottom: 0;
    > div {
      float: right;
      // margin-right: -70px;
      margin-top: 40px;
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
  .unusualBtnCls.el-button--primary{
    background:rgba(201,57,49,1);
    border-color:rgba(201,57,49,1);
  }
   .unusualBtnCls.el-button span{
     color: #fff;
   }
   .avatar-uploader {
  display: inline-block;
  vertical-align: -2px;
  }
  .avatar-uploader .el-upload {
    border: 1px solid  #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background:rgba(245,245,245,1);
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  .avatar1{
   width:240px;
   height:70px;
   background:rgba(245,245,245,1);
   display: block;
  }
.avatar-uploader-icon1 {
    width: 240px;
    height: 70px;
    line-height: 70px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;

}
.imgtips {
  color: rgba(179, 179, 179, 1);
  font-size: 12px;
  margin-left: 6px;
}
  .w400{
    width: 400px;
  }
}
.avtarPic{
    // position: relative;
    top: -5px;
    left: 90px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(179,179,179,1);
  }
  .avtarPicL{
    left: 250px;
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
