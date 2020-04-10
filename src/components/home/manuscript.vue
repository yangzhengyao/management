<template>
	<div class="manuscript">
		<el-container>
			<el-header style="display: flex;justify-content: space-between;">
				<div class="header-left">
					<div class="input1">
						<span>作者</span>
						<el-input v-model="author" @keyup.native.enter="search" placeholder="请输入作者"></el-input>
					</div>
					<div class="input1">
						<span>标题</span>
						<el-input v-model="title" @keyup.native.enter="search" placeholder="请输入标题"></el-input>
					</div>
					<div class="select1">
						<span>栏目</span>
						<el-select v-model="stateValue" placeholder="全部" @change="stateOptionsChange">
							<el-option v-for="(item,index) in stateOptions" :key="index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="select2">
						<span>日期</span>
						<el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
						 end-placeholder="结束日期" value-format="yyyy-MM-dd" :unlink-panels="true">
						</el-date-picker>
					</div>
				</div>
				<div class="header-right globalSearchBtnBg">
					<p class="search" @click="search">检索</p>
				</div>
				<div class="header-right globalSearchBtnBg" style="">
					<p class="search" @click="reset" style="">重置</p>
				</div>
			</el-header>
			<el-main>
				<template>
					<el-table :data="tableData" stripe style="width: 100%" max-height="670" border v-loading="loading">

						<el-table-column label="标题" class-name="openSourceLinkCls" show-overflow-tooltip>
							<template slot-scope="scope">
								<span class="titleCls" @click="openSouceManuscript(scope.row)">{{scope.row.title}}</span>
							</template>
						</el-table-column>

						<el-table-column prop="pubTime" label="日期" width="180"></el-table-column>

						<el-table-column prop="author" label="作者" width="180"></el-table-column>

						<el-table-column prop="columnName" label="栏目" width="180"></el-table-column>

<!-- 						<el-table-column prop="column" label="栏目" width="180">
							<template slot-scope="scope">
								<div class="table-big-column">
									<div>主:{{scope.row.column[0]}}</div>
									<div>副:{{scope.row.column[1]}}</div>
								</div>
							</template>
						</el-table-column> -->
						<!-- prop="readNum" -->
						<!--弥勒项目（appInfoId=21）真实量做隐藏，只显示修改量-->
						<template v-if="appId == 21">
							<el-table-column label="浏览量" width="180">
								<template slot-scope="scope">
									<span>{{scope.row.readNumFake || 0}}</span>
								</template>
							</el-table-column>

							<el-table-column label="分享量" width="180">
								<template slot-scope="scope">
									<span>{{scope.row.shareNum || 0}}</span>
								</template>
							</el-table-column>

							<el-table-column label="点赞量" width="180">
								<template slot-scope="scope">
									<span>{{scope.row.likeNum || 0}}</span>
								</template>
							</el-table-column>
						</template>
						<template v-else>
							<el-table-column label="浏览量（修改）" width="180">
								<template slot-scope="scope">
									<span>{{scope.row.readNum}}</span>
									<span>({{scope.row.readNumFake || 0}})</span>
								</template>
							</el-table-column>

							<el-table-column label="分享量（修改）" width="180">
								<template slot-scope="scope">
									<span>{{scope.row.shareNum}}</span>
									<span>({{scope.row.shareNumFake || 0}})</span>
								</template>
							</el-table-column>

							<el-table-column label="点赞量（修改）" width="180">
								<template slot-scope="scope">
									<span>{{scope.row.likeNum}}</span>
									<span>({{scope.row.likeNumFake || 0}})</span>
								</template>
							</el-table-column>
						</template>

						<el-table-column prop="weightNum" label="加权数" width="180" v-if="appId != 21"></el-table-column>

						<el-table-column prop="operation" label="操作" width="150" v-if="appId != 21">
							<template slot-scope="scope">
								<button @click="editClick(scope.row)">修改</button>
								<button @click="open_operationLog(scope.row)">日志</button>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<div>
					<paging :total="pageTotal" :currentPage.sync="currentPage" :pageSize="pageSize"></paging>
				</div>
			</el-main>
		</el-container>

		<!-- 修改稿件弹窗 -->
		<el-dialog :title="dialogTitle" :visible.sync="editDialog" width="30%" :top="editTopCss">
			<el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">

				<el-form-item label="浏览量" prop="readNum">
					<el-input v-model.number="editForm.readNum" autocomplete="off" @change="read_change" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>

				<el-form-item label="分享量" prop="shareNum">
					<el-input v-model.number="editForm.shareNum" autocomplete="off" style="width: 80%;" @change="share_change" placeholder="请输入"></el-input>
				</el-form-item>

				<el-form-item label="点赞量" prop="likeNum">
					<el-input v-model.number="editForm.likeNum" autocomplete="off" style="width: 80%;" @change="like_change" placeholder="请输入"></el-input>
				</el-form-item>

				<el-form-item label="加权数" prop="weightNum">
					<el-input v-model.number="editForm.weightNum" autocomplete="off" style="width: 80%;" @change="weight_change" placeholder="请输入"></el-input>
				</el-form-item>

			</el-form>
			<div class="remarks">
				<!-- （系数，用阅读、分享、点赞单词加权累计，例如系数为10，用<br>
				户产生一次阅读、分享、点赞行为累积量加10） -->
				（乘以系数，例如系数为10，APP用户单次阅读、分享、点赞行为<br>累积量加10）
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('editForm')">取 消</el-button>
				<el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 操作日志弹框 -->
		<operationLog :operationLogModal="operationLogModal" :operationlog_rowData="operationlog_rowData" :Operationlog_fromMark="Operationlog_fromMark" @operationlog_childEvent="operationLog_parentMethod"></operationLog>
	</div>
</template>

<script>
  	import {
		mapState,
		mapGetters,
		mapMutations
  	} from 'vuex'
	import operationLog from '@/components/home/modalComponents/operationLog';

	export default {
		name: "manuscript",
		components: {
			operationLog
		},
      	computed: {
			...mapGetters([
			  'appId',
			])
      	},
		data() {
		  //大于等于0的整数校验
          const validatePositiveInter = (rule, value, callback) => {
            let reg = /^[+]{0,1}(\d+)$/g;
            if (value === '' || value == null) {
              callback(new Error('请输入！'));
            } else {
              if ( !reg.test(value) ) {
                callback(new Error('输入格式不正确，请输入大于等于0的整数！'));
              }
              callback();
            }
          };
			return {
				author: '', //作者
				title: '', //标题
				stateValue: '', //栏目下拉框value
				dateRange: [], //时间范围
				stateOptions: [{
						value: "",
						label: "全部"
					}
				],
				loading: false, //表格加载
				currentPage: 1,
				currentRow: {},
				pageSize: 10,
				pageTotal: 0,
				tableData: [],
				editDialog: false, //修改弹窗
				dialogTitle: '修改', //修改弹窗标题
				editTopCss:'20vh',  //修改稿件高度
				editForm: {
					readNum: '',
					shareNum: '',
					likeNum: '',
					weightNum: ''
				},
				editCompare:{
					readNum: '',
					shareNum: '',
					likeNum: '',
					weightNum: ''
				},
				editRules: {
					readNum: [{
						required: true,
                      	validator: validatePositiveInter,
						trigger: 'change'
					}],
					shareNum: [{
						required: true,
                      	validator: validatePositiveInter,
						trigger: 'change'
					}],
					likeNum: [{
						required: true,
                      	validator: validatePositiveInter,
						trigger: 'change'
					}],
					weightNum: [{
						required: true,
                      	validator: validatePositiveInter,
						trigger: 'change'
					}]
				},
				// 浏览  分享  点赞 加权输入框的标记
				isChangeRead:false,
				isChangeShare:false,
				isChangeLike:false,
				isChangeWeight:false,
				//日志弹框
				operationLogModal:false,
				operationlog_rowData:'',
				Operationlog_fromMark:'',  //点击来源
			}
		},
		mounted() {
			this.getNewsColumn()
			this.getNewsChannelData()
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.getNewsChannelData()
				}
			}
		},
		methods: {
			//浏览量输入框改变事件
			read_change(val){
				this.isChangeRead = this.editCompare.readNum!=val?true:false
			},
			//分享量输入框改变事件
			share_change(val){
				this.isChangeShare = this.editCompare.shareNum!=val?true:false
			},
			//点赞量输入框改变事件
			like_change(val){
				this.isChangeLike = this.editCompare.likeNum!=val?true:false
			},
			//加权数输入框改变事件
			weight_change(val){
				this.isChangeWeight = this.editCompare.weightNum!=val?true:false
			},
			//打开稿件源链接
			openSouceManuscript(row){
				if(!row.url){
					this.$message({
						type: "error",
						message: "源链接不存在！"
					});
					return;
				}
				window.open(row.url,"_blank")
			},
			// 获取稿件列表
			async getNewsChannelData() {
				this.loading = true
				try {
					let params = {
						pageNum: this.currentPage-1,
						pageSize: this.pageSize,
						title: this.title,
						author: this.author,
						includedColumnIds: this.stateValue,
						startTime: this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : '',
						endTime: this.dateRange && this.dateRange.length > 0 ? this.dateRange[1] : ''
					}
					const res = await this.api.getNewsChannelData(params);
					if (res.success) {
                      	this.loading = false;
					  	if(res.data.length>0){
                          this.pageTotal = res.data[0].totalElements;
                          this.tableData = res.data[0].content.length>0?res.data[0].content:[]
						}else{
                          this.pageTotal = 0;
					  	  this.tableData = [];
						}

						/* this.$message({
							type: "success",
							message: res.message
						}); */
					} else {
						this.tableData = [];
                      	this.pageTotal = 0;
						this.loading = false;
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 修改数量
			async updateNumber(obj) {
				const loading = this.$loading({
				  lock: true,
				  text: 'Loading',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});
				try {
					let params = {
						readNumTimeIncrease: obj.readNum,
						shareNumFake: obj.shareNum,
						likeNumFake: obj.likeNum,
						weightNum: obj.weightNum,
						fake: 1,
						url: this.currentRow.url,
						urlMD5: this.currentRow.urlMD5,
						columnName: this.currentRow.columnName
					}
					if(this.isChangeRead){
						//修改前的阅读量
						params.originalReadNumFake = this.editCompare.readNum;
					}
					if(this.isChangeShare){
						//修改前的分享量
						params.originalShareNumFake = this.editCompare.shareNum;
					}
					if(this.isChangeLike){
						//修改前的点赞量
						params.originalLikeNumFake = this.editCompare.likeNum;
					}
					if(this.isChangeWeight){
						//修改前的加权数
						params.originalWeightNum = this.editCompare.weightNum;
					}

					const res = await this.api.updateNumber(params);
					if (res.success) {
						loading.close()
						this.$message({
							type: "success",
							message: res.message
						});
						this.currentPage = 1
						this.getNewsChannelData()
					} else {
						loading.close()
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 修改数量
			async getNewsColumn() {
				/*const loading = this.$loading({
				  lock: true,
				  text: 'Loading',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});*/
				try {
					const res = await this.api.getNewsColumn();
					if (res.success) {
						//loading.close()
						res.data.forEach((item) => {
							let obj = {
								value: item.uuid,
								label: item.fullName
							}
							this.stateOptions.push(obj)
						})
					} else {
						//loading.close()
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 检索按钮点击
			search() {
				this.currentPage = 1;
				this.getNewsChannelData()
			},
		  	//重置
          	reset(){
              this.title = '';
              this.author = '';
              this.stateValue = '';
              this.dateRange = [];
              this.search();
			},
			// 栏目切换触发
			stateOptionsChange() {

			},
			// 修改按钮
			editClick(data) {
				this.resetForm('editForm') //清空表单
				//重置change标记
				this.isChangeRead = false;
				this.isChangeShare = false;
				this.isChangeLike = false;
				this.isChangeWeight = false;

				this.editDialog = true
				this.dialogTitle = '修改'
				this.currentRow = data
				this.editForm = {
					readNum: data.readNumFake,
					shareNum: data.shareNumFake,
					likeNum: data.likeNumFake,
					weightNum: data.weightNum
				};
				//用于比较
				this.editCompare = {
					readNum: data.readNumFake,
					shareNum: data.shareNumFake,
					likeNum: data.likeNumFake,
					weightNum: data.weightNum
				}
			},
			// 查看按钮
			readClick() {

			},
			// 点击取消关闭弹窗，清空表单
			resetForm(formName) {
				this.editDialog = false
				if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			},
			// 提交表单，并验证
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.editDialog = false
						this.updateNumber(this.editForm)
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//操作日志弹框
			open_operationLog(row){
				this.operationLogModal = true;
				this.operationlog_rowData = row;
				this.Operationlog_fromMark = "manuscript";
			},
			operationLog_parentMethod(param) {
			  this.operationLogModal = param.operationLogModal;
			  //仅在点击确定关闭弹框关闭时
			  /* if( param.clickmark == "confirm" ){
			    //刷新列表
			    this.querySubscriptionList();
			  } */
			},
		}
	}
</script>

<style lang="less">
	.img-col {
		padding: 2px 0;
	}

	.manuscript {
		font-size: 14px;
		font-family: MicrosoftYaHei;
		font-weight: 400;

		.el-header {
			background: rgba(255, 255, 255, 1);
			padding: 15px 28px;

			div {
				.el-date-editor>i {
					font-size: 18px;
					color: #c93931;
					line-height: 22px;
				}

				.el-date-editor>span {
					line-height: 22px;
				}

				.el-input__inner {
					height: 30px;
					border: 1px solid rgba(217, 217, 217, 1);
					border-radius: 3px;
					margin-top: 5px;
				}

				div>span{
					margin-right: 10px;
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
			}

			.header-left {
				display: flex;
				align-items: center;
				flex-direction: row;
				justify-content: start;
				width: 89%;

				.input1,
				.select1 {
					width: 12%;
					display: flex;
					align-items: center;
					margin-right: 20px;
				}

				.select2 {
					width: 30%;
					display: flex;
					align-items: center;
					margin-right: 20px;
				}

				span {
					color: rgba(26, 26, 26, 1);
					width: 40px;
				}
			}

			.header-right {
				width: 74px;
				height: 30px;
				/*background: rgba(201, 57, 49, 1);*/
				border-radius: 3px 3px 3px 3px;
				color: rgba(255, 255, 255, 1);
				text-align: center;
				line-height: 30px;

				.search {
					cursor: pointer
				}
			}
		}

		.el-main {
			padding: 22px 28px;
			background: rgba(255, 255, 255, 1);
			margin-top: 10px;

			.el-table {
				margin-bottom: 20px;

				.el-table__row {
					td:nth-child(4) {
						// padding: 0 !important;
						// height: 48px !important;

// 						.cell {
// 							padding: 0;
// 							height: 48px;
// 						}
					}

					.table-big-column {
						display: flex;
						align-items: center;
						flex-direction: row;
						justify-content: center;

						div:nth-child(1) {
							border-right: 1px solid #d9d9d9;
						}

						div {
							width: 49.5%;
							line-height: 48px;
						}
					}
				}
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

			td.openSourceLinkCls{
				span.titleCls:hover{
					text-decoration: underline;
					cursor: pointer;
				}
			}

			.el-table--striped .el-table__body tr.el-table__row--striped td {
				background: rgba(245, 247, 252, 1);
			}

			.el-table tbody .el-table__row--striped:hover>td,
			.el-table tbody tr:hover>td {
				background: rgba(227, 238, 255, 1);
			}

			th,
			td {
				display: table-cell !important; //解决表格边框错乱问题
				border: 1px solid #d9d9d9;
				border-bottom: 0;
				border-right: 0;

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
					margin-right: 10px;
				}

				button:nth-of-type(2) {
					/* background: #B3B3B3; */
					border-color: #c93931;
					color: #c93931;
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

			.el-radio__input.is-checked+.el-radio__label {
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

		.el-dialog {
			border-radius: 10px;
			/* margin-top: 20vh !important;
			width: 30%; */

			.remarks {
				line-height: 22px;
				font-size: 14px;
				color: #B3B3B3;
				padding-left: 40px;
			}

			.el-dialog__header {
				border-bottom: 1px solid #D9D9D9;

				.el-dialog__title {
					color: #1A1A1A;
					font-size: 20px;
					font-weight: 400;
				}
			}

			.el-dialog__body {
				.avatar-uploader .el-upload {
					border: 1px dashed #d9d9d9;
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
					width: 178px;
					height: 178px;
					line-height: 178px;
					text-align: center;
				}

				.avatar {
					width: 140px;
					height: 140px;
					display: block;
				}
			}

			.dialog-footer {
				.el-button--default {
					width: 70px;
					height: 30px;
					background: #B3B3B3;
					border-radius: 3px;
					color: #fff;
					padding: 0;
					border-color: #B3B3B3;
				}

				.el-button--primary {
					width: 70px;
					height: 30px;
					background: #C93931;
					border-radius: 3px;
					color: #fff;
					padding: 0;
					border-color: #C93931;
				}
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
</style>
