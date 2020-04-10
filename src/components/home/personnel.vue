<template>
	<div class="personnel">
		<el-container>
			<el-header style="display: flex;justify-content: space-between;">
				<div class="header-left">
					<div class="select1">
						<span class="mg10Cls">角色</span>
						<el-select v-model="roleValue" placeholder="请选择角色">
							<el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="input1">
						<span class="mg10Cls">人员</span>
						<el-input v-model="personnel" @keyup.native.enter="searchClick" placeholder="请输入人员"></el-input>
					</div>
					<div class="select3">
						<span class="mg10Cls">部门</span>
						<el-select v-model="deptValue" placeholder="请选择部门">
							<el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="select2">
						<span class="mg10Cls">日期</span>
						<el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
						 value-format="yyyy-MM-dd" :unlink-panels="true">
						</el-date-picker>
					</div>
				</div>
				<div class="header-right globalSearchBtnBg">
					<p class="search" @click="searchClick">检索</p>
				</div>
			</el-header>
			<el-main>
				<template>
					<el-table :data="tableData" stripe style="width: 100%" max-height="670" border v-loading="loading">
						<el-table-column label="姓名" class-name="openDetailLinkCls">
							<template slot-scope="scope">
								<span class="nameCls" v-if="scope.row.name !== '总计'" @click="openDetailDialog(scope.row)" style="cursor: pointer;">{{scope.row.name}}</span>
								<span class="" v-else style="cursor: pointer;">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="CO" label="多媒稿件">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.CO || 0}}</span>
								<span v-else>{{scope.row.CO || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="TX" label="文字稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.TX || 0}}</span>
								<span v-else>{{scope.row.TX || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="PO" label="图片稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.PO || 0}}</span>
								<span v-else>{{scope.row.PO || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="GR" label="图表稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.GR || 0}}</span>
								<span v-else>{{scope.row.GR || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="GA" label="图集稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.GA || 0}}</span>
								<span v-else>{{scope.row.GA || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="VD" label="视频稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.VD || 0}}</span>
								<span v-else>{{scope.row.VD || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="AU" label="音频稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.AU || 0}}</span>
								<span v-else>{{scope.row.AU || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="LV" label="直播稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.LV || 0}}</span>
								<span v-else>{{scope.row.LV || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="HR" label="链接稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.HR || 0}}</span>
								<span v-else>{{scope.row.HR || 0}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="WX" label="微信稿">
							<template slot-scope="scope">
								<span v-if="scope.row.name == '总计'" style="color: #C93931;">{{scope.row.WX || 0}}</span>
								<span v-else>{{scope.row.WX || 0}}</span>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<div class="table-bottom">
					<!--<el-button type="primary" :disabled="tableData.length == 0" @click="exportUserExcel">导出Excel</el-button>-->
					<el-dropdown @command="exportOperation">
						<el-button type="primary" size="medium" :disabled="isEmpty">导出Excel</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="currentpage">导出当前页</el-dropdown-item>
							<el-dropdown-item command="all">导出所有</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<paging :total="pageTotal" :currentPage.sync="currentPage" :pageSize="pageSize"></paging>
				</div>
			</el-main>
		</el-container>

		<!-- 人员详情弹框 -->
		<el-dialog
			title="云稿库稿件统计"
			custom-class="commonHeader personDetailModalCls"
			@open="openPersonDetailFunc"
			:top="cloudManuScriptCss"
			:visible.sync="personDetailDialog">
			<div style="text-align: right;padding-bottom:15px;">
				<el-date-picker
					v-model="cloudManuScriptDateVal"
					size="small"
					type="daterange"
					align="right"
					unlink-panels
					:clearable="true"
					range-separator="至"
					value-format="yyyy-MM-dd"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:picker-options="pickerOptions"
					@change="cloudManuScriptDateChange">
				</el-date-picker>
			</div>
			<div style="height: 500px;">
				<el-table :data="personDetailTableData" stripe style="" border max-height="500" v-loading="detailLoading">
					<el-table-column property="fullTitle" label="标题" show-overflow-tooltip></el-table-column>
					<el-table-column property="selectedUsers" label="选用人" show-overflow-tooltip></el-table-column>
					<el-table-column property="createTime" label="时间"></el-table-column>
				</el-table>
			</div>

			<div class="" style="padding-top: 20px;">
				<!--<el-button type="primary" size="small" @click="exportCloudManuscriptExcel">导出Excel</el-button>-->
				<el-dropdown @command="exportCloudManuscriptOperation">
					<el-button type="primary" size="small" :disabled="personDetailTableData.length == 0">导出Excel</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="currentpage">导出当前页</el-dropdown-item>
						<el-dropdown-item command="all">导出所有</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<detailPaging :total="detailPageTotal" :detailCurrentPage.sync="detailCurrentPage" :pageSize="detailPageSize"></detailPaging>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import axios from "axios";
	import detailPaging from "@/components/common/detailPage";

	export default {
		name: "personnel",
		components: {
			detailPaging
		},
		data() {
			return {
				roleValue: '记者', //角色下拉框value
				personnel: '', //人员
				dateRange: [this.commonFunc.formatDate(Date.now() - 86400000 * 30), this.commonFunc.formatDate(Date.now())], //时间范围
				roleOptions: [{
						value: "记者",
						label: "记者"
					},
					{
						value: "编辑",
						label: "编辑"
					}
				], //角色下拉框
				// 部门下拉框
				deptOptions: [],
				deptValue: '',
				loading: false, //表格加载
				currentPage: 1,
				pageSize: 10,
				pageTotal: 0,
				tableData: [],
			  	isEmpty:false,
				county: '',
				//  人员详情弹框
				personDetailDialog: false,
				personDetailRow: '',
				personDetailTableData: [],
				detailLoading: false,
				detailPageTotal: 0,
				detailCurrentPage: 1,
				detailPageSize: 10,
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				cloudManuScriptDateVal:[this.commonFunc.formatDate(Date.now() - 86400000 * 30), this.commonFunc.formatDate(Date.now())],
				cloudManuScriptCss:'10vh'
			}
		},
		created() {
			let urlPar = this.commonFunc.parseUrlParam(window.location.href);
			this.county = urlPar["county"];
			if (this.county == "puyang") {
				this.roleOptions = [{
					value: "编辑",
					label: "编辑"
				}, ];
				this.roleValue = "编辑";
				this.deptOptions = [{
					value: '5cc57ea80cf247209d2bb3e3',
					label: '濮阳县'
				}];
				this.deptValue = '5cc57ea80cf247209d2bb3e3';
			} else {
				this.roleOptions = [{
						value: "记者",
						label: "记者"
					},
					{
						value: "编辑",
						label: "编辑"
					}
				];
				this.roleValue = "记者";
				this.deptValue = '';
			}
		},
		mounted() {
			if (this.county == "puyang") {
				this.getUserStatistic()
			} else {
				this.queryDeptList();
			}
		},
		watch: {
			//切换页码
			currentPage(newval, oldval) {
				if (newval) {
					this.getUserStatistic()
				}
			},
			detailCurrentPage(newval, oldval) {
				if (newval) {
					this.queryPersonDetailData()
				}
			},
		},
		methods: {
			// 打开人员详情弹框
			openDetailDialog(row) {
				this.personDetailRow = row;
				this.personDetailDialog = true;
			},
			// 打开回调
			openPersonDetailFunc() {
				//每次打开默认一个月
				this.cloudManuScriptDateVal = [this.commonFunc.formatDate(Date.now() - 86400000 * 30), this.commonFunc.formatDate(Date.now())],
				this.detailCurrentPage = 1;
				this.queryPersonDetailData();
			},
			// 日期选择改变事件
			cloudManuScriptDateChange(){
				this.detailCurrentPage = 1;
				this.queryPersonDetailData();
			},
			// 详情表格数据
			async queryPersonDetailData() {
				this.detailLoading = true;
				try {
					let params = {
						uuid: this.personDetailRow.uuid,
						page: this.detailCurrentPage - 1,
						size: this.detailPageSize,
						startDate: this.cloudManuScriptDateVal && this.cloudManuScriptDateVal.length > 0 ? this.cloudManuScriptDateVal[0] : '',
						endDate: this.cloudManuScriptDateVal && this.cloudManuScriptDateVal.length > 0 ? this.cloudManuScriptDateVal[1] : ''
					};

					Object.keys(params).forEach(function(keyval){
						if(params[keyval] === ''){
							delete params[keyval]
						}
					})

					const res = await this.api.queryReporterCloudManucript(params);
					if (res.success) {
						this.detailLoading = false;
						if(res.data.length > 0){
							this.personDetailTableData = res.data[0].content;
							this.detailPageTotal = res.data[0].totalElements
						}else{
							this.personDetailTableData = [];
							this.detailPageTotal = 0
						}

						/* this.$message({
							type: "success",
							message: res.message
						}); */
					} else {
						this.detailLoading = false;
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
		  	//云稿库详情导出
          	exportCloudManuscriptOperation(type){
              let sizeParam = type=="currentpage"?this.detailPageSize:this.detailPageTotal;
              this.exportCloudManuscriptExcel(sizeParam);
			},
			// 详情表格导出
			exportCloudManuscriptExcel(par) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let useUrl = this.api.getUrl();
				axios({
					method: "post",
					url: useUrl + 'export/exportReporterManuscript',
					data: {
						uuid: this.personDetailRow.uuid,
						page: this.detailCurrentPage - 1,
						size: par,
						startDate: this.cloudManuScriptDateVal && this.cloudManuScriptDateVal.length > 0 ? this.cloudManuScriptDateVal[0] : '',
						endDate: this.cloudManuScriptDateVal && this.cloudManuScriptDateVal.length > 0 ? this.cloudManuScriptDateVal[1] : ''
					},
					responseType: "arraybuffer"
				}).then(response => {
					this.commonFunc.exportExcel(response, "云稿库稿件统计.xls", this);
					loading.close()
				}).catch(error => {})
			},
			/* ------end----------- */
			// 查询部门下拉框
			async queryDeptList() {
				this.loading = true;
				try {
					const res = await this.api.getDeptList();
					if (res.success) {
						if (res.data[0].data) {
							let dataS = res.data[0].data;
							let arr = [];
							dataS.forEach(function(item, index) {
								arr.push({
									label: item.name,
									value: item.uuid
								})
							});

							this.deptOptions = arr;
							this.deptValue = arr.length > 0 ? arr[0].value : '';
							this.getUserStatistic();
						}
					}
				} catch (e) {
					console.log(e);
				}
			},
			//统计部门下发稿件量数量
			async getUserStatistic() {
				this.loading = true;
				try {
					let params = {
						//groupId: this.roleValue == '记者' ? '5d4426dbe4b00e18f9cd4b9d' : ' 5d4426efe4b00e18f9cd4b9f', //铁门关id
						groupId: this.deptValue,
						roleName: this.roleValue, //角色
						userName: this.personnel.trim(), //人员
						page: this.currentPage - 1,
						size: this.pageSize,
						startDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : '',
						endDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[1] : ''
					};
					/*if(this.county == "puyang"){
                      params.groupId = '5cc57ea80cf247209d2bb3e3';
					}else{
                      params.groupId = this.deptValue;
					}*/
					const res = await this.api.getUserStatistic(params);
					if (res.success) {
						this.loading = false;
						this.tableData = res.data[0].data.page.content;
						this.isEmpty = this.tableData.length == 0?true:false;
						this.tableData.push(res.data[0].data.total);
						this.pageTotal = res.data[0].data.page.totalElements
						/* this.$message({
							type: "success",
							message: res.message
						}); */
					} else {
						this.loading = false;
                      	this.tableData = [];
                      	this.isEmpty = true;
                      	this.pageTotal = 0;
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			searchClick() {
				this.currentPage = 1;
				this.getUserStatistic()
			},
		  	//导出操作  type:currentPage当前页，type:all所有
		  	exportOperation(type){
			  let sizeParam = type=="currentpage"?this.pageSize:this.pageTotal;
			  this.exportUserExcel(sizeParam);
			},
			// 统计用户下发稿件量数量
			exportUserExcel(par) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let useUrl = this.api.getUrl();
				axios({
					method: "post",
					url: useUrl + 'export/exportUserExcel',
					data: {
						//groupId: '5d4426dbe4b00e18f9cd4b9d', //铁门关id
						groupId: this.deptValue,
						roleName: this.roleValue, //角色
						userName: this.personnel, //人员
						page: this.currentPage - 1,
						size: par,
						startDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : '',
						endDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[1] : ''
					},
					responseType: "arraybuffer"
				}).then(response => {
					this.commonFunc.exportExcel(response, "人员统计.xls", this);
					loading.close()
				}).catch(error => {})
			},
		}
	}
</script>

<style lang="less">
	.img-col {
		padding: 2px 0;
	}

	/* 人员详情弹框 */
	.personDetailModalCls {
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
		}

		/* 详情弹框表格样式 表格高度固定,最后一行显示 */
		.el-table {
			tbody {
				>tr:last-child {
					td {
						border-bottom: 1px solid #d9d9d9;
					}
				}
			}
		}
	}

	.personnel {
		font-size: 14px;
		font-family: MicrosoftYaHei;
		font-weight: 400;

		.el-header {
			background: rgba(255, 255, 255, 1);
			padding: 15px 28px;

			.mg10Cls {
				margin-right: 10px;
			}

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

				.el-select {
					width: 100px;

					input {
						background-position: 79px center;
					}

					i {
						display: none;
					}
				}

				div.select3 {
					/* width: 17%; */
					margin-right: 20px;

					.el-select {
						width: 170px;

						input {
							background-position: 150px center;
						}
					}
				}
			}

			.header-left {
				display: flex;
				align-items: center;
				flex-direction: row;
				justify-content: start;
				/* width: 80%; */

				.input1,
				.select1 {
					display: flex;
					align-items: center;
					margin-right: 20px;
				}

				.select1 {
					/* width: 12%; */
				}

				.input1 {
					/* width: 14%; */
				}

				.select2 {
					/* width: 30%; */
					display: flex;
					align-items: center;
					margin-right: 20px;
				}

				span {
					color: rgba(26, 26, 26, 1);
					width: 35px;
				}
			}

			.header-right {
				width: 74px;
				height: 30px;
				/*background:rgba(201,57,49,1);*/
				border-radius: 2px 2px 2px 2px;
				cursor: pointer;
				text-align: center;

				.search {
					color: #fff;
					line-height: 30px;
				}
			}
		}

		.el-main {
			padding: 22px 28px;
			background: rgba(255, 255, 255, 1);
			margin-top: 10px;

			.table-bottom>button {
				width: 90px;
				padding: 0;

				span {}
			}

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

			td.openDetailLinkCls {
				span.nameCls:hover {
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
					margin-right: 20px;
				}

				button:nth-of-type(2) {
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
				/*width: 70px;
				height: 30px;*/
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

	}
</style>
