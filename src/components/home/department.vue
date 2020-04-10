<template>
	<div class="department">
		<el-container>
			<el-header style="display: flex;justify-content: space-between;">
				<div class="header-left">
					<div class="select2">
						<span>日期</span>
						<el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
						 value-format="yyyy-MM-dd" :unlink-panels="true">
						</el-date-picker>
					</div>
				</div>
				<div class="header-right globalSearchBtnBg">
					<p class="search" @click="getDepartmentStatistic">检索</p>
				</div>
			</el-header>
			<el-main>
				<template>
					<el-table :data="tableData" stripe style="width: 100%" max-height="670" border v-loading="loading">
						<el-table-column prop="name" label="部门"></el-table-column>
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
					<el-button type="primary" :disabled="tableData.length == 0" @click="exportDepartmentExcel">导出Excel</el-button>
					<!-- <paging :total="pageTotal" :currentPage.sync="currentPage" :pageSize="pageSize"></paging> -->
				</div>
			</el-main>
		</el-container>

	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "department",
		components: {},
		data() {
			return {
				dateRange: [this.commonFunc.formatDate(Date.now() - 86400000 * 30), this.commonFunc.formatDate(Date.now())], //时间范围
				loading: false, //表格加载
				currentPage: 1,
				pageSize: 10,
				pageTotal: 0,
				tableData: [],
			}
		},
		mounted() {
			this.getDepartmentStatistic()
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {

				}
			}
		},
		methods: {
			//统计部门下发稿件量数量
			async getDepartmentStatistic() {
				this.loading = true
				try {
					let params = {
						//groupId: '5d44269ee4b00e18f9cd4b9c', //铁门关id
						startDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : '',
						endDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[1] : ''
					}
					const res = await this.api.getDepartmentStatistic(params);
					if (res.success) {
						this.loading = false
						this.tableData = res.data[0].data
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
			// 统计部门下发稿件量数量
			exportDepartmentExcel() {
				const loading = this.$loading({
				  lock: true,
				  text: 'Loading',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});
              	let useUrl = this.api.getUrl();
				axios({
					method: "post",
					url: useUrl+'export/exportDepartmentExcel',
					data: {
						//groupId: encodeURI('5d44269ee4b00e18f9cd4b9c'), //铁门关id
						startDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : '',
						endDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[1] : ''
					},
					responseType: "arraybuffer"
				}).then(response => {
					this.commonFunc.exportExcel(response, "部门统计.xls", this);
					loading.close()
				}).catch(error => {})
			}

		}
	}
</script>

<style lang="less">
	.img-col {
		padding: 2px 0;
	}

	.department {
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
					width: 40px;
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

	}
</style>
