<template>
	<div class="active">
		<el-container>
			<el-header>
				<div class="header1">
					<span style="margin-right: 10px">状态</span>
					<el-select v-model="stateValue" placeholder="全部" @change="stateOptionsChange">
						<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="header6 globalSearchBtnBg">
					<p class="search" @click="createActive">新建活动</p>
				</div>
			</el-header>
			<el-main>
				<template>
					<el-table :data="tableData" stripe style="width: 100%" max-height="670" border v-loading="loading">
						<el-table-column label="序号" width="90">
							<template slot-scope="scope">
								{{ scope.$index + 1 + (currentPage - 1) * pageSize}}
							</template>
						</el-table-column>
						<el-table-column label="开始时间" width="180">
							<template slot-scope="scope">
								{{scope.row.startTime}}-<br>{{scope.row.endTime}}
							</template>
						</el-table-column>
						<el-table-column prop="name" label="活动名称" width="300" show-overflow-tooltip></el-table-column>
						<el-table-column prop="signUpEndTime" label="报名截止时间" width="170"></el-table-column>
						<el-table-column prop="perCost" label="费用"></el-table-column>
						<el-table-column label="人数">
							<template slot-scope="scope">
								{{scope.row.singUpNum}}/{{scope.row.singUpCeiling}}
								<span>查看</span>
							</template>
						</el-table-column>
						<el-table-column prop="activitiesZone" label="地点" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="titlePicUrl" label="活动配图">
							<template slot-scope="scope">
								<img :src="scope.row.titlePicUrl" alt="" style="width: 80px; height: 30px;border: 1px solid #B3B3B3;">
							</template>
						</el-table-column>
						<el-table-column prop="signUpStatus" label="报名状态">
							<template slot-scope="scope">
								<span>{{scope.row.signUpStatus == 1 ? '报名中' : '已结束'}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="开放状态">
							<template slot-scope="scope">
								<el-switch :value="scope.row.status == 0 ? true : false" active-color="#CAA267" inactive-color="#FFFFFF"
								 @change="changeStatus(scope.$index,scope.row)">
								</el-switch>
							</template>
						</el-table-column>
						<el-table-column prop="operation" label="操作">
							<template slot-scope="scope">
								<button @click="editClick(scope.row)">修改</button>
								<button @click="deleteClick(scope.row)">删除</button>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<div>
					<paging :total="pageTotal" :currentPage.sync="currentPage" :pageSize="pageSize"></paging>
				</div>
			</el-main>
		</el-container>

		<!-- 新建活动弹窗 -->
		<el-dialog :title="dialogTitle" :visible.sync="createDialog">
			<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px">

				<el-form-item label="活动名称" prop="name">
					<el-input v-model="createForm.name" autocomplete="off" style="width: 54%;"></el-input>
				</el-form-item>

				<el-form-item label="活动配图" prop="titlePicUrl">
					<el-upload class="avatar-uploader" :action="commonUploadUrl"
					 :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
						<img v-if="createForm.titlePicUrl" :src="createForm.titlePicUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="活动类型" prop="activitiesType">
					<el-select v-model="createForm.activitiesType" placeholder="请选择活动类型" @change="dialogOptionsChange" style="width: 54%;">
						<el-option v-for="item in dialogOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="活动时间" required>
					<el-col :span="6">
						<el-form-item prop="activitiesTime">
							<el-date-picker type="datetime" placeholder="活动时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							 v-model="createForm.activitiesTime" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>

				<el-form-item label="活动起始时间" required>
					<el-col :span="6">
						<el-form-item prop="startTime">
							<el-date-picker type="datetime" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							 :picker-options="pickerOptionsStart" v-model="createForm.startTime" @change="dateChangeBeginTime" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="1" style="text-align: center;">-</el-col>
					<el-col :span="6">
						<el-form-item prop="endTime">
							<el-date-picker type="datetime" placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							 :picker-options="pickerOptionsEnd" v-model="createForm.endTime" @change="dateChangeEndTime" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>

				<el-form-item label="报名截止时间" prop="signUpEndTime">
					<el-date-picker v-model="createForm.signUpEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
					 placeholder="报名截止时间" style="width: 25%;">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="费用" prop="perCost">
					<el-input v-model.number="createForm.perCost" autocomplete="off" style="width: 25%;"></el-input>
				</el-form-item>

				<el-form-item label="地点" prop="activitiesZone">
					<el-input v-model="createForm.activitiesZone" autocomplete="off" style="width: 54%;"></el-input>
				</el-form-item>

				<el-form-item label="人数" prop="singUpCeiling">
					<el-input v-model.number="createForm.singUpCeiling" autocomplete="off" style="width: 25%;"></el-input>
				</el-form-item>

				<el-form-item label="活动介绍" prop="content">
					<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请输入内容" v-model="createForm.content">
					</el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('createForm')">取 消</el-button>
				<el-button type="primary" @click="submitForm('createForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "active",
		components: {},
		data() {
			return {
				pickerOptionsStart: {
					disabledDate: time => {
						if (this.createForm.endTime) {
							return (
								time.getTime() > new Date(this.createForm.endTime).getTime()
							)
						} else {
							// 不能大于当前日期
							// return time.getTime() > Date.now()
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: time => {
						if (this.createForm.startTime) {
							return (
								time.getTime() < new Date(this.createForm.startTime).getTime()
							)
						} else {
							// return time.getTime() < Date.now()
						}
					}
				},
				loading: false, //表格加载
				stateOptions: [{
						value: "",
						label: "全部"
					},
					{
						value: "1",
						label: "报名中"
					},
					{
						value: "0",
						label: "已结束"
					}
				],
				dialogOptions: [{
						value: "1",
						label: "志愿者活动"
					},
					{
						value: "2",
						label: "主持人评选活动"
					},
					{
						value: "3",
						label: "招工活动"
					}
				],
				stateValue: '', //状态下拉框value
				dialogTitle: '新建活动',
				currentPage: 1,
				pageSize: 10,
				pageTotal: 0,
				tableData: [],
				createDialog: false, //创建活动弹窗
				createForm: {
					name: '', //活动名称
					titlePicUrl: '', //活动配图
					activitiesType: '', //活动类型
					activitiesTime: '', //活动时间
					startTime: '', //开始时间
					endTime: '', //结束时间
					signUpEndTime: '', //报名截至时间
					perCost: '', //费用
					activitiesZone: '', //地点
					singUpCeiling: '', //人数
					content: '' //活动内容
				},
				currentRow: {}, //当前选中修改的row数据
				createRules: {
					name: [{
							required: true,
							message: '请输入活动名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 10,
							message: '长度最多 10 个字符',
							trigger: 'blur'
						}
					],
					titlePicUrl: [{
						required: true,
						message: '请选择活动配图',
						trigger: 'change'
					}],
					activitiesType: [{
						required: true,
						message: '请选择活动类型',
						trigger: 'change'
					}],
					activitiesTime: [{
						type: 'string',
						required: true,
						message: '请选择活动时间',
						trigger: 'change'
					}],
					startTime: [{
						type: 'string',
						required: true,
						message: '请选择开始时间',
						trigger: 'change'
					}],
					endTime: [{
						type: 'string',
						required: true,
						message: '请选择结束时间',
						trigger: 'change'
					}],
					signUpEndTime: [{
						type: 'string',
						required: true,
						message: '请选择报名截至时间',
						trigger: 'change'
					}],
					perCost: [{
						required: true,
						type: 'number',
						min: 0,
						message: '请输入不小于0的费用',
						trigger: 'blur'
					}],
					activitiesZone: [{
						required: true,
						message: '请输入地点',
						trigger: 'blur'
					}],
					singUpCeiling: [{
						required: true,
						type: 'number',
						min: 0,
						message: '请输入不小于0人数',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '请填写活动内容',
						trigger: 'blur'
					}]
				},
               	//上传地址--红旗共用
              	commonUploadUrl:this.api.getHongqiUploadUrl()
			}
		},
		mounted() {
			this.queryActivities()
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.queryActivities();
				}
			}
		},
		methods: {
			//根据条件查询活动信息
			async queryActivities() {
				this.loading = true
				try {
					let params = {
						pageNo: this.currentPage,
						pageSize: this.pageSize
					};
					if(this.stateValue!==""){
						params.signUpIsEnd = this.stateValue;
					}
					const res = await this.api.queryActivities(params);
					if (res.success) {
						this.loading = false
						this.pageTotal = res.total
						this.tableData = res.data
						/* this.$message({
							type: "success",
							message: res.message
						}); */
					} else {
						this.loading = false
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			//添加活动
			async addActivities() {
				this.loading = true
				try {
					let params = {
						name: this.createForm.name, //活动名称
						titlePicUrl: this.createForm.titlePicUrl, //活动配图
						activitiesType: this.createForm.activitiesType, //活动类型
						activitiesTime: this.createForm.activitiesTime, //活动时间
						startTime: this.createForm.startTime, //开始时间
						endTime: this.createForm.endTime, //结束时间
						signUpEndTime: this.createForm.signUpEndTime, //报名截至时间
						perCost: this.createForm.perCost, //费用
						activitiesZone: this.createForm.activitiesZone, //地点
						singUpCeiling: this.createForm.singUpCeiling, //人数
						content: this.createForm.content //活动内容
					}
					let res = null
					if (this.dialogTitle == '修改活动') {
						params.id = this.createForm.id
						res = await this.api.updateActivities(params);
					} else {
						res = await this.api.addActivities(params);
					}
					if (res.success) {
						let that = this;
						setTimeout(function(){
							that.loading = false
							that.$message({
								type: "success",
								message: res.message
							});
							// 添加成功后重新查询
							that.currentPage = 1
							that.queryActivities()
						},1500)
					} else {
						this.loading = false
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			//下拉框切换触发查询
			stateOptionsChange(val) {
				this.stateValue = val
				this.currentPage = 1
				this.queryActivities()
			},
			//弹窗下拉框切换赋值
			dialogOptionsChange(val) {
				this.createForm.activitiesType = val
			},
			// 开放状态改变
			changeStatus(index, data) {
				if (data.status == 0) {
					let params = data
					this.$confirm("确定要禁止此条开放状态吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							try {
								params.status = 1
								const res = await this.api.updateActivities(params);
								if (res.success) {
									this.tableData[index].status = 1;
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
					let params = data
					this.$confirm("确定要打开此条的开放状态吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							try {
								params.status = 0
								const res = await this.api.updateActivities(params);
								if (res.success) {
									this.tableData[index].status = 0;
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
			// 修改按钮点击
			editClick(row) {
				this.createDialog = true
				this.dialogTitle = '修改活动'
				this.currentRow = this.commonFunc.deepClone(row)
				this.createForm = this.currentRow
			},
			// 删除按钮点击
			deleteClick(data) {
				this.$confirm("确定要删除吗？", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(async () => {
					this.loading = true
					try {
						const res = await this.api.deleteActivities({
							id: data.id
						});
						if (res.success) {
							let that = this;
							setTimeout(function(){
								that.loading = false;
								that.$message({
									type: "success",
									message: res.message
								});
								that.currentPage = 1
								that.queryActivities()
							},1500)
						} else {
							this.$message({
								type: "error",
								message: res.message
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
			// 点击新建活动
			createActive(formName) {
				this.resetForm('createForm') //清空表单
				this.createDialog = true
				this.dialogTitle = '新建活动'
			},
			// 上传回调，判断
			handleSuccess(res, file) {
				this.createForm.titlePicUrl = res.data[0]
			},
			beforeUpload(file) {
				const isJPG = file.type.split('/')[0] == 'image'
				const isLt2M = file.size / 1024 / 1024 < 2

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!')
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!')
				}
				return isJPG && isLt2M;
			},
			// 点击取消关闭弹窗，清空表单
			resetForm(formName) {
				this.createDialog = false
				if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			},
			// 提交表单，并验证
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log(this.createForm)
						this.createDialog = false
						this.addActivities()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 开始时间改变时触发
			dateChangeBeginTime(val) {
				this.createForm.startTime = val;
			},
			// 结束时间改变时触发
			dateChangeEndTime(val) {
				this.createForm.endTime = val;
			}
		}
	}
</script>

<style lang="less">
	.img-col {
		padding: 2px 0;
	}

	.active {
		font-size: 14px;
		font-family: MicrosoftYaHei;
		font-weight: 400;

		.el-header {
			background: rgba(255, 255, 255, 1);
			padding: 15px 28px;
			display: flex;
			justify-content: space-between;

			div {
				display: inline-block;

				.el-input__inner {
					height: 30px;
					border: 1px solid rgba(217, 217, 217, 1);
					border-radius: 3px;
					margin-left: 10px;
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
			}

			.header1 {
				/*margin: 0 1500px 0 28px;*/

				span {
					color: rgba(26, 26, 26, 1);
				}
			}

			.header6 {
				width: 86px;
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
					color:#FFFFFF;
					cursor: pointer;
					background: #fff;
				}
				button:nth-of-type(1) {
					background: rgba(201, 57, 49, 1);
					margin-right: 20px;
				}
				button:nth-of-type(2){
					background: #B3B3B3;
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
			margin-top: 1vh !important;

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
