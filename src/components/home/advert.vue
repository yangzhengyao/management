<template>
	<div class="advert">
		<el-container>
			<el-header style="display: flex;justify-content: space-between;">
				<div class="header-left">
					<div class="select1">
						<span>广告位</span>
						<el-select v-model="stateValue1" placeholder="全部" @change="stateOptionsChange1">
							<el-option v-for="item in stateOptions1" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="select1">
						<span style="width: 60px;">发布状态</span>
						<el-select v-model="stateValue2" placeholder="全部" @change="stateOptionsChange2">
							<el-option v-for="item in stateOptions2" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="header-right" style="">
					<p class="globalHistoryDeleteBtnBg" @click="openDeleteHistory" style="margin-right: 20px;">删除历史</p>
					<p class="search globalSearchBtnBg" @click="createAdvert">新建广告</p>
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

						<el-table-column prop="adsenseName" label="广告位" width="250"></el-table-column>

						<el-table-column prop="advertExplain" label="广告说明" show-overflow-tooltip></el-table-column>

						<el-table-column label="配图">
							<template slot-scope="scope">
								<img :src="scope.row.imgPath" style="vertical-align: middle;" width="30" height="30" />
							</template>
						</el-table-column>

						<el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>

						<el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>

						<el-table-column prop="pubState" label="发布状态" width="180">
							<template slot-scope="scope">
								{{scope.row.pubState == 0 ? '未发布' : scope.row.pubState == 1 ? '已发布' : '已结束'}}
							</template>
						</el-table-column>

						<el-table-column prop="pubState" label="开放状态" width="180">
							<template slot-scope="scope">
								<el-switch :value="scope.row.pubState == 1 ? true : false" active-color="#CAA267" inactive-color="#FFFFFF"
								 @change="changeStatus(scope.$index,scope.row)" disabled v-if="scope.row.pubState == 0 && (Date.parse(new Date()) <= Date.parse(scope.row.startTime) || Date.parse(new Date()) >= Date.parse(scope.row.endTime))">
								</el-switch>
								<el-switch :value="scope.row.pubState == 1 ? true : false" active-color="#CAA267" inactive-color="#FFFFFF"
								 @change="changeStatus(scope.$index,scope.row)" v-else-if="scope.row.pubState == 0 && Date.parse(new Date()) > Date.parse(scope.row.startTime) && Date.parse(new Date()) < Date.parse(scope.row.endTime)">
								</el-switch>
								<el-switch :value="scope.row.pubState == 1 ? true : false" active-color="#CAA267" inactive-color="#FFFFFF"
								 @change="changeStatus(scope.$index,scope.row)" disabled v-else-if="Date.parse(new Date()) < Date.parse(scope.row.startTime) || Date.parse(new Date()) > Date.parse(scope.row.endTime)">
								</el-switch>
								<el-switch :value="scope.row.pubState == 1 ? true : false" active-color="#CAA267" inactive-color="#FFFFFF"
								 @change="changeStatus(scope.$index,scope.row)" v-else>
								</el-switch>
							</template>
						</el-table-column>

						<el-table-column prop="operation" label="操作" width="200">
							<template slot-scope="scope">
								<button @click="editClick(scope.row)">修改</button>
								<button @click="deleteClick(scope.row)">删除</button>
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

		<!-- 新建广告弹窗 -->
		<el-dialog :title="dialogTitle" :visible.sync="createDialog" custom-class="commonHeader" :top="editAdvertTopCss">
			<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px">

				<el-form-item label="广告位" prop="adsenseId">
					<el-select v-model="createForm.adsenseId" placeholder="请选择活动类型" @change="dialogOptionsChange" style="width: 54%;">
						<el-option v-for="item in dialogOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="配图" prop="imgPath">
					<div class="flex-end">
						<el-upload class="avatar-uploader" :action="commonUploadUrl"
						 :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
							<img v-if="createForm.imgPath" :src="createForm.imgPath" :class="createForm.adsenseId == 1 ? 'avatar1' : createForm.adsenseId == 2 ? 'avatar2' : createForm.adsenseId == 3 ? 'avatar3' : createForm.adsenseId == 4 ? 'avatar4' : 'avatar'">
							<i v-else :class="createForm.adsenseId == 1 ? 'el-icon-plus avatar-uploader-icon1' : createForm.adsenseId == 2 ? 'el-icon-plus avatar-uploader-icon2' : createForm.adsenseId == 3 ? 'el-icon-plus avatar-uploader-icon3' : createForm.adsenseId == 4 ? 'el-icon-plus avatar-uploader-icon4' : 'el-icon-plus avatar-uploader-icon'"></i>
						</el-upload>
						<span class="tag-span" v-if="createForm.adsenseId == 1">
							为匹配全类型手机，图片大小（19：9；<br>
							1520*720）。重要内容请放置到安全区内。
						</span>
						<span class="tag-span" v-if="createForm.adsenseId == 2">
							图片比例（16：9）
						</span>
						<span class="tag-span" v-if="createForm.adsenseId == 3">
							图片比例（16：9）
						</span>
						<span class="tag-span" v-if="createForm.adsenseId == 4">
							图片大小（690px*220px）
						</span>
					</div>
				</el-form-item>

				<el-form-item label="广告链接" prop="advertUrl">
					<el-input v-model="createForm.advertUrl" autocomplete="off" style="width: 54%;" placeholder="请输入链接"></el-input>
				</el-form-item>
				<el-form-item label="广告日期" required>
					<el-col :span="6">
						<el-form-item prop="startTime">
							<el-date-picker type="datetime" placeholder="开始日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							 :picker-options="pickerOptionsStart" v-model="createForm.startTime" @change="dateChangeBeginTime" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="1" style="text-align: center;">至</el-col>
					<el-col :span="6">
						<el-form-item prop="endTime">
							<el-date-picker type="datetime" placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							 :picker-options="pickerOptionsEnd" v-model="createForm.endTime" @change="dateChangeEndTime" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>

				<el-form-item label="广告说明" prop="advertExplain">
					<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="这是一段广告说明" v-model="createForm.advertExplain">
					</el-input>
				</el-form-item>

				<el-form-item label="启动时长" style="width:40%" prop="residenceTime" v-if="createForm.adsenseId == 1">
					<el-input type="age" v-model="createForm.residenceTime" placeholder="启动时长,单位：s" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="图片类型" prop="picType" v-if="createForm.adsenseId == 3">
					<el-radio v-model="createForm.picType" label="1">大图</el-radio>
					<el-radio v-model="createForm.picType" label="2">小图</el-radio>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('createForm')">取 消</el-button>
				<el-button type="primary" @click="submitForm('createForm')">确 定</el-button>
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
	import operationLog from '@/components/home/modalComponents/operationLog';
	import deleteHistoryLog from '@/components/home/modalComponents/deleteHistoryLog';

	export default {
		name: "advert",
		components: {
			operationLog,
			deleteHistoryLog
		},
		data() {
			//正整数校验
			const validatepoInteger = (rule, value, callback) => {
			  let reg = /^[1-9]\d*$/g;
			  if (value === '' || value == null) {
			    callback(new Error('请输入启动时长，单位：s！'));
			  } else {
			    if ( !reg.test(value) ) {
			      callback(new Error('请输入正整数！'));
			    }
			    callback();
			  }
			};
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
				stateValue1: '', //广告位下拉框value
				stateValue2: '', //发布状态下拉框value
				stateOptions1: [{
						value: "",
						label: "全部"
					}
				],
				stateOptions2: [{
						value: "",
						label: "全部"
					},
					{
						value: "1",
						label: "已发布"
					},
					{
						value: "0",
						label: "未发布"
					},
					{
						value: "-1",
						label: "已结束"
					}
				],
				loading: false, //表格加载
				currentPage: 1,
				pageSize: 10,
				pageTotal: 0,
				tableData: [],
				dialogTitle: '新建广告',
				editAdvertTopCss:'5vh',
				createDialog: false,
				createForm: {
					adsenseId: 1, //广告位
					imgPath: '', //配图
					advertUrl: '', //广告链接
					startTime: '', //开始时间
					endTime: '', //结束时间
					advertExplain: '', //广告说明
					picType: '1', //图片种类
					residenceTime:'', // 启动时长
				},
				createRules: {
					adsenseId: [{
						required: true,
						message: '请选择广告位类型',
						trigger: 'change'
					}],
					imgPath: [{
						required: true,
						message: '请选择广告配图',
						trigger: 'change'
					}],
					advertUrl: [{
						required: false,
						message: '请输入广告链接',
						trigger: 'blur'
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
					advertExplain: [{
						required: true,
						message: '请填写广告内容',
						trigger: 'blur'
					}],
					residenceTime: [{
						required: true,
						validator:validatepoInteger,
						trigger: "change"
					}],
				},
				currentRow: {}, //当前选中修改的row数据
				dialogOptions: [],
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
			}
		},
		mounted() {
			this.selectAdsense()
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.selectAdvertByParam()
				}
			}
		},
		methods: {
			// 广告位列表
			async selectAdsense() {
				/*const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)',
                    text:"拼命加载中",
                  	customClass:"fullLoadingCls"
				});*/
				try {
					const res = await this.api.selectAdsense();
					if (res.success) {
						//loading.close()
						res.data.forEach((item) => {
							let obj = {
								value: item.adsenseId,
								label: item.adsenseName
							}
							this.stateOptions1.push(obj)
							this.dialogOptions.push(obj)
						})
						// 查询列表
						this.selectAdvertByParam()
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
			// 广告列表
			async selectAdvertByParam() {
				this.loading = true
				try {
					let params = {
						pageNo: this.currentPage,
						pageSize: this.pageSize
					};
					//广告位
					if (this.stateValue1 != "") {
						params.adsenseId = this.stateValue1;
					}
					//发布状态
					if (this.stateValue2 != "") {
						params.pubState = this.stateValue2;
					}
					const res = await this.api.selectAdvertByParam(params);
					if (res.success) {
						this.loading = false
						this.pageTotal = res.total
						this.tableData = res.data
						this.tableData.forEach((item) => {
							item.picType += ''
						})
						/* this.$message({
							type: "success",
							message: res.message
						}); */
					} else {
						this.tableData = []
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
			// 新增广告
			async insertAdvert() {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				try {
					let params = {
						advertExplain: this.createForm.advertExplain,
						advertUrl: this.createForm.advertUrl,
						imgPath: this.createForm.imgPath,
						startTime: this.createForm.startTime,
						endTime: this.createForm.endTime,
						adsenseId: '1',
					};
					//如果是启动页  加启动时长
					if(params.adsenseId == '1'){
						params.residenceTime = parseInt(this.createForm.residenceTime);
					}
					//图片类型
					if (this.createForm.adsenseId == 3) {
						params.picType = this.createForm.picType
					}
					let res = null
					if (this.dialogTitle == '修改广告') {
						params.advertId = this.createForm.advertId
						res = await this.api.updateAdvertById(params);
					} else {
						res = await this.api.insertAdvert(params);
					}
					if (res.success) {
						loading.close();
						this.createDialog = false;
                      	this.$message({
							type: "success",
							message: res.message
                      	});
						// 刷新列表
						this.currentPage = 1;
						this.selectAdvertByParam()

					} else {
						loading.close();
						//this.createDialog = false
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 广告位切换触发
			stateOptionsChange1(val) {
				this.stateValue1 = val
				// 刷新列表
				this.currentPage = 1
				this.selectAdvertByParam()
			},
			// 发布状态切换触发
			stateOptionsChange2(val) {
				this.stateValue2 = val
				// 刷新列表
				this.currentPage = 1
				this.selectAdvertByParam()
			},
			// 修改按钮
			editClick(row) {
				this.createDialog = true;
				this.dialogTitle = '修改广告';
				this.currentRow = this.commonFunc.deepClone(row);
				this.createForm = this.currentRow
			},
			// 删除按钮
			deleteClick(data) {
				this.$confirm("确定要删除吗？", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(async () => {
					this.loading = true
					try {
						const res = await this.api.updateAdvertByStatus({
							advertId: data.advertId
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
								that.selectAdvertByParam()
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
			//操作日志弹框
			open_operationLog(row){
				this.operationLogModal = true;
				this.operationlog_rowData = row;
				this.Operationlog_fromMark = "adLog";
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
				this.fromPage = "ad";
			},
			deleteHistoryLog_parentMethod(param) {
				this.deleteHistoryLogModal = param.deleteHistoryLogModal;
			},
			sycncRefresh_parentMethod(){
				//刷新广告列表
				// 刷新列表
				this.currentPage = 1;
				this.selectAdvertByParam()
			},
			/* ----------删除历史弹框end ---------*/
			// 发布按钮点击
			changeStatus(index, data) {
				if (data.pubState == 0 || data.pubState == -1) {
					let params = {
						advertId: data.advertId,
						pubState: 1
					}
					this.$confirm("确定要打开此条开放状态吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							try {
								params.pubState = 1
								const res = await this.api.updateAdvertByPubState(params);
								if (res.success) {
									this.tableData[index].pubState = 1;
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
					let params = {
						advertId: data.advertId,
						pubState: -1
					}
					this.$confirm("确定要禁止此条的开放状态吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							try {
								params.pubState = -1
								const res = await this.api.updateAdvertByPubState(params);
								if (res.success) {
									this.tableData[index].pubState = -1;
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
			// 点击新建广告，修改广告
			createAdvert(formName) {
				this.resetForm('createForm'); //清空表单
				this.createForm = {
					adsenseId: 1,
					picType: '1',
					imgPath: '', //配图
					advertUrl: '', //广告链接
					startTime: '', //开始时间
					endTime: '', //结束时间
					advertExplain: '', //广告说明
                  	residenceTime:'', // 启动时长
				};
				this.currentRow = {};
				this.createDialog = true;
				this.dialogTitle = '新建广告'
			},
			//弹窗下拉框切换赋值
			dialogOptionsChange(val) {
				this.createForm.adsenseId = val
			},
			// 上传回调，判断
			handleSuccess(res, file) {
				this.createForm.imgPath = res.data[0];
			},
			beforeUpload(file) {
				const isJPG = file.type.split('/')[0] == 'image'
				// const isLt2M = file.size / 1024 / 1024 < 2

				if (!isJPG) {
					this.$message.error('请上传图片!')
				}
// 				if (!isLt2M) {
// 					this.$message.error('上传头像图片大小不能超过 2MB!')
// 				}
				// return isJPG && isLt2M;
				return isJPG;
			},
			// 开始时间改变时触发
			dateChangeBeginTime(val) {
				this.createForm.startTime = val;
			},
			// 结束时间改变时触发
			dateChangeEndTime(val) {
				this.createForm.endTime = val;
			},
			// 点击取消关闭弹窗，清空表单
			resetForm(formName) {
				this.createForm = {}
				this.createDialog = false
				if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			},
			// 提交表单，并验证
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.insertAdvert()
						// this.addActivities()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
		}
	}
</script>

<style lang="less">
	.img-col {
		padding: 2px 0;
	}

	.flex-end {
		display: flex;
		align-items: flex-end;
	}

	.advert {
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
					/*margin-left: 10px;*/
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
				width: 80%;

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
					width: 45px;
				}
			}

			.header-right {
				.search {
					width: 93px;
					height: 30px;
					/*background: rgba(201, 57, 49, 1);*/
					border-radius: 3px 3px 3px 3px;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 30px;
					cursor: pointer;
					display: inline-block;
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
				padding: 0;

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
					background: #B3B3B3;
					margin-right: 10px;
				}
				button:nth-of-type(3){
					/* color: #666666; */
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
					border: 1px solid #d9d9d9;
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

				.avatar-uploader-icon1 {
					font-size: 28px;
					color: #8c939d;
					width: 134px;
					height: 240px;
					line-height: 240px;
					text-align: center;
				}

				.avatar-uploader-icon2 {
					font-size: 28px;
					color: #8c939d;
					width: 160px;
					height: 90px;
					line-height: 90px;
					text-align: center;
				}

				.avatar-uploader-icon3 {
					font-size: 28px;
					color: #8c939d;
					width: 160px;
					height: 90px;
					line-height: 90px;
					text-align: center;
				}

				.avatar-uploader-icon4 {
					font-size: 28px;
					color: #8c939d;
					width: 282px;
					height: 90px;
					line-height: 90px;
					text-align: center;
				}

				.tag-span {
					line-height: 26px;
					position: relative;
					top: -10px;
					font-size: 12px;
					color: #B3B3B3;
					margin-left: 14px;
				}

				.avatar1 {
					width: 134px;
					height: 240px;
					display: block;
				}

				.avatar2 {
					width: 160px;
					height: 90px;
					display: block;
				}

				.avatar3 {
					width: 160px;
					height: 90px;
					display: block;
				}

				.avatar4 {
					width: 282px;
					height: 90px;
					display: block;
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
