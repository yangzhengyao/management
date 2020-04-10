<template>
	<div class="CommentCheck">
		<el-container>
			<el-header>
				<div class="header1">
					<span>通过状态</span>
					<el-select v-model="status" placeholder="全部" @change="getCommentsByParam('initPage')">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="header1">
					<span>分类</span>
					<el-select v-model="sortVal" placeholder="全部" @change="getCommentsByParam('initPage')">
						<el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- <div class="header2">
          <span>栏目</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div> -->
				<div class="header3">
					<span>关键词</span>
					<el-input v-model="keyword" @keyup.native.enter="getCommentsByParam('initPage')" placeholder="请输入关键词" class="keyword"></el-input>
				</div>
				<div class="header3">
					<span>用户</span>
					<el-input v-model="userName" placeholder="请输入用户名" @keyup.native.enter="getCommentsByParam('initPage')" class="userName"></el-input>
				</div>
				<div class="header2">
					<span>日期</span>
					<!-- <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-input"
            value-format="yyyy-MM-dd"
          ></el-date-picker> -->
					<el-date-picker v-model="dateRange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :unlink-panels="unlinkPanels">
					</el-date-picker>
				</div>
				<div class="header6" style="margin-left: 200px;">
					<p class="search globalSearchBtnBg" @click="getCommentsByParam('initPage')">检索</p>
					<p class="search globalSearchBtnBg" @click="reset" style="margin-left: 20px">重置</p>
				</div>
			</el-header>
			<el-main>
				<template>
					<el-table v-loading="loading" :data="tableData" stripe style="width: 100%" max-height="670" border ref="multipleTable"
					 @selection-change="handleSelectionChange"
					 :row-class-name="tableRowClassName">
						<el-table-column type="selection" :selectable="checkSelectChange" width="30"></el-table-column>
						<el-table-column label="序号" width="50">
							<template slot-scope="scope">{{scope.$index+1}}</template>
						</el-table-column>
						<el-table-column prop="username" label="用户" width="150" show-overflow-tooltip></el-table-column>
						<el-table-column label="分类" width="120">
							<template slot-scope="scope">{{parseType(scope.row)}}</template>
						</el-table-column>
						<!-- <el-table-column prop="column" label="栏目"></el-table-column> -->
						<el-table-column prop="summary_" label="详情" class-name="detailCls">
							<template slot-scope="scope">
								<!--:title="scope.row.paentData?scope.row.paentData.content:''"-->
								<span class="showDetailCls" @click.stop="showDetail(scope.row)">{{scope.row.summary_?scope.row.summary_:''}}</span>
								<!-- 社区详情如果带图、带视频需要一个标识 -->
								<span class="showDetailCls" v-if="scope.row.type==4" @click.stop="showDetail(scope.row)">
									<i class="el-icon-picture" v-show="scope.row.paentData&&scope.row.paentData.blog_info_images&&JSON.parse(scope.row.paentData.blog_info_images).length>0"></i>
									<i class="el-icon-video-camera-solid" v-show="scope.row.paentData&&scope.row.paentData.blog_info_videos"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="content" label="评论内容" show-overflow-tooltip></el-table-column>
						<el-table-column prop="commentTime" width="200" label="评论时间"></el-table-column>
						<!-- 0=已删除，1=正常,2=涉及敏感 -->
						<el-table-column label="评论智能审核" width="130" align="center">
							<template slot-scope="scope">
								<!-- <span v-if="scope.row.accessStatus==1" :style="forbidStyles">未通过</span> -->
								<span :style="(scope.row.status==1 || scope.row.status==0)?passStyles:scope.row.status==2?forbidStyles:normalStyles">{{parseStatus(scope.row)}}</span>
							</template>
						</el-table-column>

						<!-- 人工审核 -->
						<el-table-column label="人工审核" width="220" align="center" class-name="manualReviewCls">
							<template slot-scope="scope">
								<span v-if="scope.row.status==0" :style="normalStyles">用户已删除</span>
								<div v-else>
									<span v-if="scope.row.operateLog.length<=0||scope.row.operateLog == null">无</span>
									<div v-else>
										<el-popover
										  placement="left"
										  width="480"
										  trigger="hover"
										  popper-class="tableCellPopperCls">
										  <el-table :data="scope.row.operateLog" max-height="280">
										    <el-table-column prop="addTime" label="时间" width="170" show-overflow-tooltip></el-table-column>
										    <el-table-column prop="log" label="日志" show-overflow-tooltip></el-table-column>
										    <el-table-column property="operateUser" label="处理人" show-overflow-tooltip></el-table-column>
										  </el-table>
										  <div slot="reference" style="cursor: pointer;">
											  <div class="global_ellipsis">{{scope.row.operateLog[0].addTime}}</div>
											  <div style="display: flex;justify-content: center;">
											  	<span class="global_ellipsis_nowidth" style="max-width: 66%;">处理人:{{scope.row.operateLog[0].operateUser || '---'}}</span>
											  	<span class="global_ellipsis_nowidth statusLabel" :class="scope.row.operateLog[0].log=='通过'?'logPassColor':scope.row.operateLog[0].log=='未通过'?'logrefuseColor':'logdefaultColor'"
													style="max-width: 34%;margin-left: 8px;">{{scope.row.operateLog[0].log}}</span>
											  </div>
										  </div>
										</el-popover>
									</div>
								</div>
							</template>
						</el-table-column>

						<!-- 0=已删除，1=可显示（通过）,2=审核中,3=审核不通过   accessStatus  0 通过，1 未通过-->
						<el-table-column label="通过状态" width="150">
							<template slot-scope="scope">
								<el-switch :value="scope.row.accessStatus==0" :disabled="scope.row.status==0" active-color="#CAA267" inactive-color="#FFFFFF" @click.native="stopBubble"
								 @change="changeStatus(scope.$index,scope.row)"></el-switch>
							</template>
						</el-table-column>
						<!-- scope.row.commentUser&&scope.row.commentUser.commentStatus == 1 -->
						<el-table-column label="禁言状态" width="150">
							<template slot-scope="scope">
								<el-switch :value="scope.row.banned" :disabled="scope.row.status==0" active-color="#CAA267" inactive-color="#FFFFFF" @change="openForbidBanned(scope.$index, scope.row,bannnedStatus)"
								 @click.stop.native="stopBubble"></el-switch>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<div>
					<el-checkbox v-model="isSelectAll" class="foot-check" @change="toggleSelection(tableData)">评论批量操作</el-checkbox>
					<button class="btn-pass" @click="listCheck('0')">通过</button>
					<button class="btn-nopass" @click="listCheck('1')">不通过</button>
					<paging :total="total" :currentPage.sync="currentPage" :pageSize="pageSize"></paging>
				</div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'

	export default {
		name: "CommentCheck",
		components: {},
		computed: {
			...mapGetters([
				'appId',
			])
		},
		data() {
			return {
				passStyles: {
					'color': '#CAA267',
					'font-weight': 'bold'
				},
				forbidStyles: {
					'color': '#C93931',
					'font-weight': 'bold'
				},
				normalStyles: {
					'color': '#666666'
				},
				//状态列表
				options: [{
						value: "",
						label: "全部"
					},
                    {
                    	value: "0",
                    	label: "通过"
                    },
					{
						value: "1",
						label: "未通过"
					},
					{
						value: "3",
						label: "已删除"
					}
				],
				// 分类列表
				sortOptions: [{
						value: "",
						label: "全部"
					},
					{
						value: 0,
						label: "活动"
					},
					{
						value: -1,
						label: "评论"
					},
					{
						value: 2,
						label: "新闻"
					},
					{
						value: 4,
						label: "社区"
					}
				],
				loading: false, //表格遮罩
				bannnedStatus: false, //禁言开关状态
				dateRange: [],
				keyword: "",
				userName: "",
				// 状态绑定值
				status: "",
				// 分类绑定值
				sortVal: '',
				userId: "",
				tableData: [],
				isSelectAll: false,
				checkedList: [],
				currentPage: 1,
				pageSize: 10,
				total: 10,
              	unlinkPanels:true,
				//所属区域
				county:'',
				//可用（status!=0）的data数据
				usefulData:[]
			};
		},
		methods: {
			stopBubble(event) {
				event.stopPropagation();
			},
			showDetail(data) {
				this.$emit("show-drawer", data);
			},
			// 行class 已删除时置灰当前行
			tableRowClassName({row, rowIndex}){
				//accessStatus 0已删除
				if(row.status == '0'){
					return 'disable-row'
				}else{
					return ''
				}
			},
			//控制当前行是否可选
			checkSelectChange(row,index){
				// status 0--已删除
				if(row.status == 0){
					return false;
				}else{
					return true;
				}
			},
			openForbidBanned(index, data, mark) {
				// 0--正常  1--禁言  2--已删除
				if (data.commentUser.commentStatus != 1) {
					// 禁言
					this.$confirm("确定要禁言此用户吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							this.loading = true;
							try {
								const res = await this.api.banned({
									autoId: data.commentUser.autoId,
									commentStatus: 1,
								});
								if (res.success) {
									this.tableData.map((item) => {
										if (item.commentUser.autoId == data.commentUser.autoId) {
											item.commentUser.commentStatus = 1;
											item.banned = true
										}
									})
									//保留条件查询 不传参时pageNo设为1
									//this.getCommentsByParam()
									//this.$forceUpdate()
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
							}
						})
						.catch(() => {
							return;
						});
				} else {
					// 解除禁言
					this.$confirm("确定要解除禁言此用户吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							this.loading = true;
							try {
								const res = await this.api.banned({
									autoId: data.commentUser.autoId,
									commentStatus: 0,
								});
								if (res.success) {
									this.tableData.map((item) => {
										if (item.commentUser.autoId == data.commentUser.autoId) {
											item.commentUser.commentStatus = 0
											item.banned = false
										}
									})
									//this.getCommentsByParam();
									//this.$forceUpdate()
									this.$message({
										type: "success",
										message: "操作成功!"
									});
									this.loading = false;
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
			parseType(data) {
			  	if(data.type == 0){
                  return "活动";
				}else if(data.type == 1){
                  return "评论";
				}else if(data.type == 2){
                  return "新闻";
                }else if(data.type == 3){
                  return "评论";
                }else if(data.type == 4){
					if(this.county == 'mile'){
						return "圈子";
					}else{
						return "社区";
					}
                }else{
                  return "";
                }
			},
			parseStatus(data) {
			  // 不用switch case比较，防止后端改变status类型（number改为string或者string改为number）
              /* if (data.status == 0) {
                return "已删除";
              } else if (data.status == 1) {
                return "通过";
              } else if (data.status == 2) {
                return "审核中";
              } else if (data.status == 3) {
                return "未通过";
              } else {
                return "";
              } */
			  //0=已删除（智能审核显示通过，人工审核显示已删除），1=正常,2=涉及敏感，未通过
			  if (data.status == 0) {
			    return "通过";
			  } else if (data.status == 1) {
			    return "通过";
			  } else if (data.status == 2) {
			    return "未通过";
			  } else {
			    return "---";
			  }
			  /* if (data.status == 0) {
			    return "已删除";
			  } else if (data.status == 1) {
			    return "正常";
			  } else if (data.status == 2) {
			    return "涉及敏感";
			  } else {
			    return "---";
			  } */
			},
			changeStatus(index, data) {
				//accessStatus  0--通过，1--未通过
				if (data.accessStatus == 0) {
					this.$confirm("确定要禁止此条评论吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							try {
								const res = await this.api.auditComment({
									commentId: data.commentId,
									accessStatus: '1',
								});
								if (res.success) {
									this.tableData[index].accessStatus = "1";
									// 更新人工审核日志
									if(res.data[0].operateLog.length>0){
										res.data[0].operateLog[0].operateUser = (!res.data[0].operateLog[0].operateUser||res.data[0].operateLog[0].operateUser=='null')
																				?'---'
																				:res.data[0].operateLog[0].operateUser
									}
									this.tableData[index].operateLog.unshift(res.data[0].operateLog[0])
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
					this.$confirm("确定要显示此条评论吗？", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(async () => {
							try {
								const res = await this.api.auditComment({
									commentId: data.commentId,
									accessStatus: '0',
								});
								if (res.success) {
									this.tableData[index].accessStatus = "0";
									// 更新人工审核日志
									if(res.data[0].operateLog.length>0){
										res.data[0].operateLog[0].operateUser = (!res.data[0].operateLog[0].operateUser||res.data[0].operateLog[0].operateUser=='null')
																				?'---'
																				:res.data[0].operateLog[0].operateUser
									}
									this.tableData[index].operateLog.unshift(res.data[0].operateLog[0])
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
			toggleSelection(rows) {
				this.$refs.multipleTable.toggleAllSelection(rows);
			},
			handleSelectionChange(list) {
				this.checkedList = list;
				//如果选择当前页的所有可用（没有置灰）数据【勾选项数组长度等于当前页可用数据条数】，则全选
				this.isSelectAll = this.checkedList.length === this.usefulData.length;
				/* if (this.checkedList.length == this.pageSize) {
					this.isSelectAll = true;
				} else if (this.total < this.pageSize) {
					if (this.checkedList.length == this.total) {
						this.isSelectAll = true;
					} else {
						this.isSelectAll = false;
					}
				} else if (this.checkedList.length < this.pageSize) {
					this.isSelectAll = false;
				} */
			},
			// 批量审核
			async listCheck(val) {
				if (this.checkedList.length == 0) {
					this.$message({
						type: "warn",
						message: "请勾选要审核的条目!"
					});
					return;
				} else {
					this.loading = true;
					let param = [];
					this.checkedList.map(item => {
						param.push({
							commentId: item.commentId,
							accessStatus: val,
						});
					});
					const res = await this.api.auditCommentList(param);
					this.loading = false;
					if (res.success) {
						let this_ = this;
						this.checkedList.map(item => {
							this.tableData.map(listItem => {
								if (item.commentId == listItem.commentId) {
									listItem.accessStatus = val;
								}
							});
						});
						this.checkedList = [];
						this.$refs.multipleTable.clearSelection();

						// 更新人工审核日志
						if(res.data.length>0){
							res.data.forEach(function(wrapItem,wrapIndex){
								if(wrapItem.operateLog.length>0){
									wrapItem.operateLog.forEach(function(logItem,logIndex){
										if(!logItem.operateUser||logItem.operateUser == "null"){
											logItem.operateUser = '---'
										}
									})
								}
								this_.tableData.map(listItem => {
									if (wrapItem.commentId == listItem.commentId) {
										listItem.operateLog.unshift(wrapItem.operateLog[0]);
									}
								});
							})
						}

						this.$message({
							type: "success",
							message: "操作成功"
						});
					}else{
						this.$message({
							type: "error",
							message: res.message
						});
					}
				}
			},
			//  重置按钮
			reset() {
			  	this.sortVal = "";
				this.dateRange = [];
				this.keyword = "";
				this.userName = "";
				this.userId = [];
				this.status = "";
				this.getCommentsByParam("initPage");
			},
			// 查询列表
			async getCommentsByParam(par) {
				this.loading = true;
				if (par == "initPage") {
					this.currentPage = 1;
				}
				//获取列表内容
				if (this.userName.trim()) {
					try {
						const result = await this.api.queryUserAutoId({
							personName: this.userName
						});
						let arr = [];
						if (result.success) {
							/* result.data.forEach(function(item, index) {
								arr.push(item.autoId)
							}); */
							this.userId = result.data;
						} else {
							this.userId = [-1]
						}
					} catch (e) {
						console.log(e)
					}
				} else {
					this.userId = []
				}
				try {
					let params = {
						pageNo: this.currentPage,
						pageSize: this.pageSize,
						content: this.keyword.trim(),
						//status: this.status,
						startTime: this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : '',
						endTime: this.dateRange && this.dateRange.length > 0 ? this.dateRange[1] : '',
						autoIds: this.userId,
						type: this.sortVal
					};

					// 状态如果是正常、未通过传accessStatus，如果是涉及敏感、已删除传status,查全部不传
					//0=已删除，1=正常,2=涉及敏感
					// accessStatus 0=通过   accessStatus 1=未通过  3=已删除。通过未通过传accessStatus，已删除传accessStatus='' status=0
					let statusVal = this.status;
					if(statusVal !== ''){
						if(statusVal == 0){
							//通过
							params.accessStatus = statusVal;
						}else if(statusVal == 1){
							//未通过
							params.accessStatus = statusVal;
						}else if(statusVal == 3){
							//已删除
							params.accessStatus = '';
							params.status = 0
						}
					}

					const res = await this.api.getComments(params);
					this.loading = false;
					let that = this;
					res.data.forEach(function(item, index) {
						if (item.commentUser && item.commentUser.commentStatus == 1) {
							item.banned = true
						} else {
							item.banned = false;
						}
						if(item.paentData&&item.paentData.content){
							item.summary_ = that.commonFunc.filterSummary(item.paentData.content);
						}else{
							item.summary_ = '';
						}
						if(item.operateLog.length>0){
							// type 0评论   1帖子
							item.operateLog.forEach(function(logitem,logindex){
								if(!logitem.operateUser || logitem.operateUser == "null"){
									logitem.operateUser = "---"
								}
							})
						}
					});
					this.tableData = res.data;
					//当前页可用的data数据 全选比较使用
					this.usefulData = this.tableData.filter(function(item,index){
						return item.status != 0
					})
					this.total = res.total;
				} catch (e) {
					console.log(e);
				}
			}
		},
		created(){
			let urlPar = this.commonFunc.parseUrlParam(window.location.href);
			this.county = urlPar["county"];
			if(this.county == 'mile'){
				this.sortOptions = [{
						value: "",
						label: "全部"
					},
					{
						value: 0,
						label: "活动"
					},
					{
						value: -1,
						label: "评论"
					},
					{
						value: 2,
						label: "新闻"
					},
					{
						value: 4,
						label: "圈子"
					}
				];
			}else{
				this.sortOptions = [{
						value: "",
						label: "全部"
					},
					{
						value: 0,
						label: "活动"
					},
					{
						value: -1,
						label: "评论"
					},
					{
						value: 2,
						label: "新闻"
					},
					{
						value: 4,
						label: "社区"
					}
				];
			}
		},
		mounted() {
		  this.getCommentsByParam();
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.getCommentsByParam();
				}
			}
		}
	};
</script>

<style lang="less">
	.CommentCheck {
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
				>span {
					margin-right: 10px;
				}

				/* display: inline-block; */
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

				.keyword {
					width: 300px;
				}

				.userName {
					width: 180px;
				}

				// .date-input {
				//   position: relative;
				//   top: 10px;
				// }
				.el-date-editor {
					/* background: url("../../assets/img/home/data.png") no-repeat 210px center; */
					width: 240px;

					>i,
					>span {
						line-height: 22px;
					}

					>i {
						font-size: 18px;
						color: #c93931;
					}

					/* i {
          display: none;
        } */
					/* input {
          width: 80px;
          height: 15px;
        } */
					/* input:nth-of-type(1) {
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
        } */
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

			/*.header1 {
				margin: 0 44px 0 28px;
			}

			.header2 {
				margin-right: 270px;
			}

			.header3 {
				margin-right: 30px;
			}*/

			.header6 {
				margin-top: 5px;
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
			}

			/* 隐藏表头全选按钮 */
			th.el-table-column--selection {
				.cell {
					display: none;
				}
			}

			.el-table-column--selection {
				border-right: 0;

				.cell {
					padding-left: 10px;
					padding-right: 0;
				}
			}

			.el-table-column--selection+th,
			.el-table-column--selection+td {
				border-left: 0;
			}

			.el-switch__core {
				border-color: rgba(217, 217, 217, 1) !important;
				//box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);
			}

			.el-switch__core:after {
				border: 1px solid rgba(217, 217, 217, 1);
				//box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);
				top: 0;
			}

			.el-radio__input.is-checked .el-radio__inner {
				background: rgba(202, 162, 103, 1);
				border-color: rgba(202, 162, 103, 1);
			}

			.el-radio__input.is-checked+.el-radio__label {
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
			}

			.btn-pass {
				background: rgba(202, 162, 103, 1);
				margin-right: 12px;
				margin-left: 15px;
				cursor: pointer;
				color: rgba(255, 255, 255, 1);
			}

			.btn-nopass {
				background: rgba(201, 57, 49, 1);
				cursor: pointer;
				color: rgba(255, 255, 255, 1);
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
