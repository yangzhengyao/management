<template>
	<div class="integral">
		<el-container>
			<el-header style="">
				<div class="header-left">
					<div class="select1">
						<span style="width: 30px;">昵称</span>
						<el-input v-model="nickName" style="width: 180px" @keyup.native.enter="filterSearch('initPage')" placeholder="请输入昵称"></el-input>
					</div>
					<div class="input1">
						<span style="">手机号</span>
						<el-input v-model="telephonenumber" style="width: 200px" @keyup.native.enter="filterSearch('initPage')"
						 placeholder="请输入手机号"></el-input>
					</div>
				</div>
				<div class="header-right">
					<p class="search globalSearchBtnBg" @click="filterSearch('initPage')">检索</p>
					<p class="search globalSearchBtnBg" style="margin-left: 20px" @click="resetList()">重置</p>
				</div>

			</el-header>
			<el-main>
				<template>
					<el-table :data="tableData" stripe style="width: 100%" max-height="670" border v-loading="loading">

						<el-table-column label="序号" width="80" type="index"></el-table-column>

						<el-table-column label="昵称" show-overflow-tooltip="" prop="personName"></el-table-column>

						<el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>

						<el-table-column label="历史积分" prop="expScore">
							<!-- <template slot-scope="scope">
                                <span>{{scope.row.province}}</span>
                                <span>{{scope.row.city}}</span>
                                <span>{{scope.row.county}}</span>
                            </template>-->
						</el-table-column>

						<el-table-column prop="expScore" label="可用积分" show-overflow-tooltip></el-table-column>

						<el-table-column label="积分趋势" class-name="detailCenterCls">
							<template slot-scope="scope">
								<span class="showDetailCls" @click="openTrendModal(scope.row)" style="line-height: 2.1;margin-right: 5px">近一月积分趋势</span>
								<span class="showDetailCls" @click="openTrendModal(scope.row)">
									<img src="../../assets/img/home/analysis.png" alt class="trendCls" />
								</span>
							</template>
						</el-table-column>

						<el-table-column prop="operation" label="操作" width="180" class-name="">
							<template slot-scope="scope">
								<button @click="openPointDialog('add',scope.row)">增加</button>
								<button @click="openPointDialog('reduce',scope.row)">减少</button>
								<!-- <button @click="deleteIntegral(scope.row)">删除</button> -->
							</template>
						</el-table-column>
					</el-table>
				</template>
				<div>
					<paging :total="pageTotal" :currentPage.sync="currentPage" :pageSize="pageSize"></paging>
				</div>
			</el-main>
		</el-container>

		<!--增加、减少积分-->
		<addIntegral :openDrawerMark="openDrawerMark" :rowData="rowData" :fromMark="fromMark" @childEvent="parentMethod"></addIntegral>
		<!--积分趋势-->
		<integralTrend :trendModalMark="trendModalMark" :trendRowData="trendRowData" @childTrendEvent="parentTrendMethod"></integralTrend>

	</div>
</template>

<script>
	import addIntegral from '@/components/home/modalComponents/integral/addIntegral';
	import integralTrend from '@/components/home/modalComponents/integral/integralTrend';

	export default {
		name: "integral",
		data() {
			return {
				nickName: "", //昵称
				telephonenumber: '', //手机号
				userIds: [], //用户ids
				stateValue: "", //状态下拉框value
				stateOptions: [{
						value: "",
						label: "全部"
					},
					{
						value: "0",
						label: "审核中"
					},
					{
						value: "1",
						label: "审核拒绝"
					},
					{
						value: "2",
						label: "审核通过"
					}
				],
				loading: false, //表格加载
				currentPage: 1,
				pageSize: 10,
				pageTotal: 0,
				tableData: [/* {
						nickName: "杨郑尧",
						tel: "182356222013",
						point_history: '3400',
						point_available: '3600',
						trend: '近一周积分趋势'
					},
					{
						nickName: "杨郑尧",
						tel: "182356222013",
						point_history: '3400',
						point_available: '3600',
						trend: '近一月积分趋势'
					} */
				],
				//积分弹框
				openDrawerMark: false,
				rowData: '',
				fromMark: '',
				//趋势弹框
				trendModalMark: false,
				trendRowData: '',
				dialogOptions: [{
						value: "1",
						label: "启动页"
					},
					{
						value: "2",
						label: "轮播图"
					},
					{
						value: "3",
						label: "新闻列表"
					},
					{
						value: "4",
						label: "新闻内"
					}
				]

			};
		},
		mounted() {
			this.queryPointList();
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.queryPointList();
				}
			}
		},
		components: {
			addIntegral,
			integralTrend
		},
		methods: {
			//过滤查询
			filterSearch(par){
				if(this.nickName === '' && this.telephonenumber === ''){
					this.userIds = [];
					this.queryPointList(par);
				}else{
					this.queryUserIds(par);
				}
			},
			// 获取用户ids
			async queryUserIds(par) {
				this.loading = true;
				try {
					let params = {
						//昵称 支持模糊查询
						personName: this.nickName,
						//手机号  不支持模糊查询
						mobile: this.telephonenumber,
					};
					const res = await this.api.queryUserIds_integral(params);
			
					if (res.success == true) {
						this.userIds = res.data;
					} else {
						this.userIds = [];
					}
					
					if(this.userIds.length<=0){
						this.tableData = [];
						this.pageTotal = 0;
						this.loading = false;
						return;
					}
					
					this.queryPointList(par);
			
				} catch (e) {
					console.log(e);
				}
			},
			// 查询积分列表
			async queryPointList(par) {
				this.loading = true;
				if (par == "initPage") {
					this.currentPage = 1;
				}
				try {
					let params = {
						pageNo: this.currentPage,
						pageSize: this.pageSize,
					};
					if(this.userIds.length > 0){
						params.userIds = this.userIds;
					}
					const res = await this.api.queryIntegralData(params);
					this.loading = false;
					let arr = [];

					if (res.success == true) {
						/* res.data.forEach(function(item, index) {
							item.subscribeImage = item.subscribeImage.split(",");
						}); */

						this.tableData = res.data;
						this.pageTotal = res.total;
					} else {
						this.tableData = [];
					}

				} catch (e) {
					console.log(e);
				}
			},
			// 重置
			resetList() {
				this.nickName = '';
				this.telephonenumber = '';
				this.queryPointList("initPage");
			},
			//打开积分弹框
			openPointDialog(par, row) {
				this.openDrawerMark = true;
				this.fromMark = par;
				this.rowData = row;				
			},
			//打开趋势弹框
			openTrendModal(row) {
				this.trendRowData = row;
				this.trendModalMark = true;
			},
			//删除积分列表数据
			deleteIntegral(row) {
				this.$confirm("确定要删除此条数据吗？", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(async () => {
						this.loading = true;
						/*try {
						  const res = await this.api.banned({
						    autoId: data.commentUser.autoId,
						    commentStatus: 1,
						  });
						  if (res.success) {
						    //保留条件查询 不传参时pageNo设为1
						    this.queryPointList()
						    this.$message({
						      type: "success",
						      message: "操作成功!"
						    });
						    this.loading = false;
						  } else {
						    this.loading = false;
						  }
						} catch (e) {
						  console.log(e);
						}*/
					})
					.catch(() => {
						return;
					});
			},
			parseSort(row) {
				//入驻类型：0=个人，1=企业,2=政府，3=组织，4=媒体
				if (row.enterType == 0) {
					return "个人";
				} else if (row.enterType == 1) {
					return "企业";
				} else if (row.enterType == 2) {
					return "政府";
				} else if (row.enterType == 3) {
					return "组织";
				} else if (row.enterType == 4) {
					return "媒体";
				} else {
					return "--";
				}
			},
			parseStatus(row) {
				if (row.checkType == 0 || row.checkType == -1) {
					return "审核中";
				} else if (row.checkType == 1) {
					return "审核拒绝";
				} else if (row.checkType == 2) {
					return "审核通过";
				} else {
					return "";
				}
			},
			//积分弹框触发
			parentMethod(param) {
				this.openDrawerMark = param.openDrawerMark;
				//仅在点击确定关闭弹框关闭时
				if (param.clickmark == "confirm"&&param.openDrawerMark==false) {
					//刷新列表
					this.queryPointList();
				}
			},
			//趋势弹框触发
			parentTrendMethod(param) {
				this.trendModalMark = param.trendModalMark;
				if (param.clickmark == "confirm") {

				}
			}
		}
	};
</script>

<style lang="less">
	.img-col {
		padding: 2px 0;
	}

	.flex-end {
		display: flex;
		align-items: flex-end;
	}

	.integral {
		font-size: 14px;
		font-family: MicrosoftYaHei;
		font-weight: 400;

		.el-header {
			background: rgba(255, 255, 255, 1);
			padding: 15px 28px;
			display: flex;
			justify-content: space-between;

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
					width: 120px;

					input {
						background-position: 94px center;
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
					/*width: 13%;*/
					display: flex;
					align-items: center;
					margin-right: 30px;
				}

				div>span {
					margin-right: 10px;
				}

				.select2 {
					width: 30%;
					display: flex;
					align-items: center;
					margin-right: 20px;
				}

				span {
					color: rgba(26, 26, 26, 1);
					/*width: 45px;*/
				}
			}

			.header-right {
				.search {
					cursor: pointer;
					display: inline-block;
					width: 74px;
					height: 30px;
					/*background: rgba(201, 57, 49, 1);*/
					border-radius: 3px 3px 3px 3px;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 30px;
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
				padding: 0;
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

				img {
					vertical-align: middle;
					/*margin-top: 6px;*/
					/*margin-right: 6px;*/
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
					/*margin-right: 20px;*/
				}

				button:nth-of-type(2) {
					background: #CAA267;
					/* margin-right: 15px; */
				}

				button:nth-of-type(3) {
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
