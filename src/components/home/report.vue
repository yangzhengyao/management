<template>
	<div class="report">
		<el-container>
			<el-header style="">
				<div class="header-left">
					<div class="input1">
						<span style="">标题</span>
						<el-input v-model="title" @keyup.native.enter="queryReportList('initPage')" placeholder="请输入标题"></el-input>
					</div>
					<div class="select1">
						<span style="">类别</span>
						<el-select v-model="stateValue" placeholder="全部" @change="queryReportList('initPage')">
							<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>

				<div>
					<div class="header-right globalSearchBtnBg">
						<p class="search" @click="queryReportList('initPage')">检索</p>
					</div>
					<div class="header-right globalSearchBtnBg" style="margin-left: 20px">
						<p class="search" @click="reset" style="">重置</p>
					</div>
				</div>
			</el-header>
			<el-main>
				<template>
					<el-table :data="tableData" stripe style="width: 100%" max-height="670" border v-loading="loading" @row-click="showDetail">
						<el-table-column label="举报人信息">
							<template slot-scope="scope">
								<div class="flex-row">
									<div class="w50 mr-r1">
										<div class="small-item">
											<span class="small-item-label">姓名:</span>
											<div class="small-item-desc">{{scope.row.reportName}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">联系方式:</span>
											<div class="small-item-desc">{{scope.row.reportPhone}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">现居住地址:</span>
											<div class="small-item-desc huan3">{{scope.row.reportAddress}}</div>
										</div>
									</div>
									<div class="w50">
										<div class="small-item">
											<span class="small-item-label">身份证号:</span>
											<div class="small-item-desc">{{scope.row.reportIdcard}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">政治面貌:</span>
											<div class="small-item-desc">{{scope.row.reportIdentity}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">级别:</span>
											<div class="small-item-desc">{{scope.row.reportLevel}}</div>
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="被举报人信息">
							<template slot-scope="scope">
								<div class="small-item">
									<span class="small-item-label">姓名:</span>
									<div class="small-item-desc">{{scope.row.beReportName}}</div>
								</div>
								<div class="small-item">
									<span class="small-item-label">职务:</span>
									<div class="small-item-desc">{{scope.row.beReportPosition}}</div>
								</div>
								<div class="small-item">
									<span class="small-item-label">单位:</span>
									<div class="small-item-desc huan2">{{scope.row.beReportUnit}}</div>
								</div>
								<div class="small-item">
									<span class="small-item-label">级别:</span>
									<div class="small-item-desc">{{scope.row.beReportLevel}}</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="举报正文">
							<template slot-scope="scope">
								<div class="flex-row">
									<div class="w50 mr-r1">
										<div class="small-item">
											<span class="small-item-label">标题:</span>
											<div class="small-item-desc huan1">{{scope.row.reportTitle}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">问题类别:</span>
											<div class="small-item-desc huan1">{{scope.row.reportTypeId}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">正文:</span>
											<div class="small-item-desc huan3">{{scope.row.reportContent}}</div>
										</div>
									</div>
									<div class="w50">
										<div class="small-item">
											<span class="small-item-label">问题细类:</span>
											<div class="small-item-desc huan1">{{scope.row.reportTypeDetailId}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">附件:</span>
											<div>
												<img :src="item" alt="" v-for="(item, index) in scope.row.file" :key="index" width="30" height="50" style="margin-right: 15px;border: 1px solid #ccc;">
											</div>
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="备注">
							<template slot-scope="scope">
								<div class="small-item">
									<span class="small-item-label">举报时间:</span>
									<div class="small-item-desc">{{scope.row.insertTime}}</div>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<div>
					<paging :total="pageTotal" :currentPage.sync="currentPage" :pageSize="pageSize"></paging>
				</div>
			</el-main>
		</el-container>

	</div>
</template>

<script>
	export default {
		name: "report",
		components: {},
		data() {
			return {
				title: '', //标题
				stateValue: '', //类别下拉框value
				stateOptions: [],
				loading: false, //表格加载
				currentPage: 1,
				pageSize: 10,
				pageTotal: 0,
				tableData: [],
			}
		},
		mounted() {
		  this.queryType();
          this.queryReportList();
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.queryReportList();
				}
			}
		},
		methods: {
			// 栏目切换触发
			stateOptionsChange() {
				this.queryReportList();
			},
			// 修改按钮
			editClick() {

			},
			// 查看按钮
			readClick() {

			},
		  	// 查询类别
		  	async queryType(){
			  try{
				//queryReportType
                const res = await this.api.queryReportType();
                if(res.success){
                  let arr = [];
                  res.data.forEach(function(item,index) {
					arr.push(
					  {
						label:item.content,
						value:item.id
					  }
					)
                  });
                  this.stateOptions = [{value:"",label:"全部"},...arr];
				}else{
                  this.stateOptions = [];
				}
			  }catch (e) {
			    this.stateOptions = [];
				console.log(e)
              }
			},
		   	// 重置按钮
          	reset(){
              this.title = "";
              this.stateValue = "";
              this.queryReportList("initPage");
			},
		  	// 查询举报列表
          	async queryReportList(par) {
              	if (par == "initPage") {
                	this.currentPage = 1;
				}
				this.loading = true;
				try {
				  let params = {
					pageNo: this.currentPage,
					pageSize: this.pageSize,
                    reportTitle: this.title
				  };
				  if(this.stateValue!==""){
				    params.reportTypeId = this.stateValue
				  }
				  const res = await this.api.queryReport(params);

				  this.loading = false;
				  let arr = [];
				  if (res.success == true) {
				    //附件
					res.data.forEach(function(item,index) {
					  item.file = item.file?item.file.split(","):[]
                    });

					this.tableData = res.data;
					this.pageTotal = res.total;
				  } else {
					this.tableData = [];
                    this.pageTotal = 0;
				  }

				} catch (e) {
				  this.tableData = [];
				  console.log(e);
				}
          	},
			// 查看详情
			showDetail(data,column,event) {
				event.stopPropagation()?event.stopPropagation():event.cancelBubble=true;
				//console.log(data)
				data.type = 5
				this.$emit("show-drawer", data);
			}
		}
	}
</script>

<style lang="less">
	.img-col {
		padding: 2px 0;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}

	.w50 {
		width: 49%;
	}

	.mr-r1 {
		margin-right: 1.9%;
	}

	.huan1 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.huan2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.huan3 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}

	.report {
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
					width: 200px;

					input {
						background-position: 170px center;
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
				/*width: 80%;*/

				.input1,
				.select1 {
					display: flex;
					align-items: center;
					margin-right: 20px;
				}

				.input1{
					.el-input{
						width: 180px;
					}
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
				display: inline-block;

				.search {
					cursor: pointer;
				}
			}
		}

		.el-main {
			padding: 22px 28px;
			background: rgba(255, 255, 255, 1);
			margin-top: 10px;

			.el-table {
				margin-bottom: 20px;

				.small-item {
					font-size: 14px;
					width: 100%;
					display: flex;
					flex-direction: row;
					align-items: flex-start;
					white-space: pre-wrap;
					line-height: 18px;
					margin-bottom: 8px;

					.small-item-label {
						color: #666;
						margin-right: 5px;
						white-space: nowrap;
					}

					.small-item-desc {
						color: #194F95;
						white-space: pre-wrap;
						text-align: left;
					}
				}

				.el-table__row {
					td {
						padding: 0 !important;
					}

					.cell {
						height: 150px;
						padding-top: 10px;
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
