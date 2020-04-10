<template>
	<div class="dynamic">
		<el-container>
			<el-header>
				<div class="select1">
					<span>通过状态</span>
					<el-select v-model="value" placeholder="全部">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="select1">
					<span>顶精热</span>
					<el-select v-model="topValue" placeholder="请选择">
						<el-option v-for="item in topHeatOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="select1" v-if="appId!=20">
					<span>圈子</span>
					<!-- <el-input v-model="group" placeholder="请输入圈子"></el-input> @change="searchData" -->
					<el-select v-model="group" placeholder="请选择">
						<el-option v-for="item in groupSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="select1" v-if="appId!=20">
					<span>话题</span>
					<!-- <el-input v-model="topic" placeholder="请输入话题"></el-input>  @change="searchData"-->
					<el-select v-model="topic" placeholder="请选择">
						<el-option v-for="item in topicSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input1">
					<span>关键词</span>
					<el-input v-model="keyword" @keyup.native.enter="searchData('initPage')" placeholder="请输入关键词"></el-input>
				</div>
				<div class="input1">
					<span>用户</span>
					<el-input v-model="userName" @keyup.native.enter="searchData('initPage')" placeholder="请输入用户名"></el-input>
				</div>
				<div class="select2">
					<span>日期</span>
					<el-date-picker v-model="dateRangeArr" type="datetimerange" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :unlink-panels="true">
					</el-date-picker>
				</div>

				<div class="header6" style="margin-left: 20px;">
					<p class="search globalSearchBtnBg" @click="searchData('initPage')">检索</p>
					<p class="search globalSearchBtnBg" @click="reset" style="margin-left: 20px">重置</p>
				</div>
			</el-header>
			<!-- @row-click="showDetail" -->
			<el-main>
				<template>
					<el-table v-loading="loading" :data="tableData" stripe style="width: 100%" max-height="670" ref="multipleTable"
					 border @selection-change="handleSelectionChange"
					 :row-class-name="tableRowClassName">
						<el-table-column type="selection" :selectable="checkSelectChange" width="30"></el-table-column>
						<el-table-column prop="number" label="序号" width="50">
							<template slot-scope="scope">{{scope.$index+1}}</template>
						</el-table-column>
						<el-table-column label="用户" show-overflow-tooltip>
							<template slot-scope="scope">
								<span @click.stop="showDetail(scope.row)">{{scope.row.user&&scope.row.user.personName?scope.row.user.personName:''}}</span>
							</template>
						</el-table-column>
						<!-- prop="content" -->
						<el-table-column label="动态内容" width="340" class-name="detailCls" show-overflow-tooltip>
							<template slot-scope="scope">
								<!-- <span @click="showDetail(scope.row)">{{scope.row.content}}</span>  :title="scope.row.content" -->
								<span class="showDetailCls" @click.stop="showDetail(scope.row)">{{scope.row.summary_}}</span>
								<!-- 动态如果带图、带视频需要一个标识 -->
								<span class="showDetailCls" @click.stop="showDetail(scope.row)">
									<i class="el-icon-picture" v-show="scope.row.blog_info_images&&JSON.parse(scope.row.blog_info_images).length>0"></i>
									<i class="el-icon-video-camera-solid" v-show="scope.row.blog_info_videos"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column label="圈子" v-if="appId!=20">
							<template slot-scope="scope">
								<span @click.stop="showDetail(scope.row)">{{scope.row.themeName}}</span>
							</template>
						</el-table-column>
						<el-table-column label="话题" show-overflow-tooltip v-if="appId!=20">
							<template slot-scope="scope">
								<span @click.stop="showDetail(scope.row)">{{topicType(scope.row)}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="type" label="动态分类">
							<template slot-scope="scope">
								<span @click.stop="showDetail(scope.row)">{{parseType(scope.row)}}</span>
							</template>
						</el-table-column>
						<el-table-column label="阅读量" prop="read_num" v-if="appId == 21"></el-table-column>
						<el-table-column width="180" label="发布时间">
							<template slot-scope="scope">
								<span @click.stop="showDetail(scope.row)">{{scope.row.pub_time}}</span>
							</template>
						</el-table-column>
						<!-- 0=已删除，1=正常,2=涉及敏感 -->
						<el-table-column label="智能审核">
							<!-- <template slot-scope="scope">
								<span @click="showDetail(scope.row)">{{parseCommentAI(scope.row)}}</span>
							</template> -->
							<!-- scope.row.status==1?passStyles:scope.row.status==2?forbidStyles:normalStyles -->
							<template slot-scope="scope">
								<!-- <span v-if="scope.row.accessStatus==1" :style="forbidStyles">未通过</span> -->
								<!-- <span v-else-if="scope.row.accessStatus==0" :style="forbidStyles">正常</span> -->
								<span :style="(scope.row.status==1 || scope.row.status==0)?passStyles:scope.row.status==2?forbidStyles:normalStyles">{{parseCommentAI(scope.row)}}</span>
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
						<!-- 0未通过，1已通过，2待审核  accessStatus  0 通过，1 未通过 -->
						<el-table-column label="通过状态">
							<template slot-scope="scope">
								<el-switch :value="scope.row.accessStatus==0" :disabled="scope.row.status==0" active-color="#CAA267" inactive-color="#FFFFFF" @click.native="stopBubble"
								 @change="changePassStatus(scope.$index,scope.row)"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="顶精热" width="200">
							<template slot-scope="scope">
								<button class="btn" :disabled="scope.row.status==0" :style="{cursor:scope.row.status==0?'not-allowed':'pointer'}" :class="{isTop:scope.row.top==1}" @click="changeHotStatus(scope.$index,scope.row,'top')">置顶</button>
								<button class="btn" :disabled="scope.row.status==0" :style="{cursor:scope.row.status==0?'not-allowed':'pointer'}" :class="{isRefind:scope.row.excellent==1}" @click.native="stopBubble" @click="changeHotStatus(scope.$index,scope.row,'excellent')">加精</button>
								<button class="btn" :disabled="scope.row.status==0" :style="{cursor:scope.row.status==0?'not-allowed':'pointer'}" :class="{isHot:scope.row.popular==1}" @click.native="stopBubble" @click="changeHotStatus(scope.$index,scope.row,'popular')">加热</button>
							</template>
						</el-table-column>
						<!-- 0：正常；1：禁言；2：已删除 -->
						<el-table-column prop="silentState" label="禁言状态">
							<template slot-scope="scope">
								<el-switch :value="scope.row.banned" :disabled="scope.row.status==0" active-color="#CAA267" inactive-color="#FFFFFF" @click.native="stopBubble"
								 @change="openForbid(scope.$index, scope.row)"></el-switch>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<div>
					<el-checkbox v-model="isSelectAll" class="foot-check" @change="toggleSelection(tableData)">动态批量操作</el-checkbox>
					<button class="btn-pass" @click="batchOperation('pass')">通过</button>
					<button class="btn-nopass" @click="batchOperation">不通过</button>
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
		components: {},
		computed: {
			...mapGetters([
				'appId',
			]),
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
				// 1 3 2 0
				options: [
				  	{
						value: "",
						label: "全部"
					},
					{
						value: 0,
						label: "通过"
					},
					{
						value: 1,
						label: "未通过"
					},
                  	{
						value: 3,
						label: "已删除"
                  	}
				],
				//顶精热数组
				topHeatOptions: [{
						value: "",
						label: "全部"
					},
					{
						value: "top",
						label: "置顶"
					},
					{
						value: "excellent",
						label: "加精"
					},
					{
						value: "popular",
						label: "加热"
					}
				],
				value: "",
				topValue: '',
				keyword: "", //关键词
				userName: "", //用户名
				userId: [],
				group: '', //圈子
				topic: '', //话题
				groupSelect: [], //圈子下拉数组
				topicSelect: [], //话题下拉数组
				dateRangeArr: [], //时间范围
				value1: "",
				tableData: [],
				checkedList: [],
				isSelectAll: false,
				state: true,
				radio: "2",
				currentPage: 1,
				pageSize: 10,
				total: 10,
				loading: false, //表格遮罩
				//可用（status!=0）的data数据
				usefulData:[]
			};
		},
		mounted() {
			this.queryGroupSelectOpt();
			this.queryTopicSelectOpt();
			this.searchData();
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.searchData();
				}
			}
		},
		methods: {
			stopBubble(event) {
				event.stopPropagation();
			},
			//状态为已删除时 置灰
			tableRowClassName({row, rowIndex}){
				// 0已删除置灰
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
					return true
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
			// 详情展开
			showDetail(data, column, event) {
				let obj = Object.assign({}, {
					drawType: "dynamicType"
				}, data)
				this.$emit("show-drawer", obj);
			},
			//  批量操作
			async batchOperation(par) {
				if (this.checkedList.length == 0) {
					this.$message({
						type: "warn",
						message: "请勾选要审核的条目!"
					});
					return;
				} else {
					try {
						this.loading = true;
						//0未通过，1已通过，2待审核
						let usedStatus = par == "pass" ? '0' : '1';
						let arr = [];
						this.checkedList.forEach(function(item, index) {
							arr.push({
								"auto_id": item.auto_id,
								"accessStatus": usedStatus
							})
						});
						const res = await this.api.updateStatusExceptBanned(arr);
						if (res.success) {
							let this_ = this;
							//this.searchData();
							this.checkedList.map(item => {
								this.tableData.map(listItem => {
									if (item.auto_id == listItem.auto_id) {
										listItem.accessStatus = usedStatus;
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
										if (wrapItem.auto_id == listItem.auto_id) {
											listItem.operateLog.unshift(wrapItem.operateLog[0]);
										}
									});
								})
							}

							this.$message({
								type: "success",
								message: res.message
							});
							this.loading = false;
						} else {
							this.loading = false;
							this.$message({
								type: "error",
								message: res.message
							});
						}

					} catch (e) {
						console.log(e);
					}
				}
			},
			// 改变顶精热状态
			changeHotStatus(index, rowData, type) {
				this.tableData[index][type] = !this.tableData[index][type];
				this.loading = true;
				let url = '/blog/updateBlogInfoById';
				let param = {
					auto_id: rowData.auto_id,
				};
				param[type] = this.tableData[index][type] == true ? 1 : 0;
				this.api.crossPost(url, [param])
					.then(res => {
						if (res.success) {
							//this.searchData();
							this.$message({
								type: "success",
								message: res.message
							});
							this.loading = false;
						} else {
							this.loading = false;
							this.$message({
								type: "error",
								message: res.message
							});
						}
					})
					.catch(res => {
						console.error(res)
					})

			},
			// 通过状态开关点击事件
			changePassStatus(index, data) {

				let obj = {
					titleStr: '',
					usedstatus: ''
				};

				if (data.accessStatus == 0) {
					obj.titleStr = "确定要禁止此条动态吗？";
					obj.usedstatus = '1';
				} else {
					obj.titleStr = "确定要显示此条动态吗？";
					obj.usedstatus = '0';
				}

				this.$confirm(obj.titleStr, {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(async () => {
						this.loading = true;
						try {
							/* 3未通过，1已通过，2待审核,0已删除 */
							const res = await this.api.updateStatusExceptBanned([{
								accessStatus: obj.usedstatus,
								auto_id: data.auto_id,
							}]);
							if (res.success) {
								this.tableData[index].accessStatus = obj.usedstatus;
								// 更新人工审核日志
								if(res.data[0].operateLog.length>0){
									res.data[0].operateLog[0].operateUser = (!res.data[0].operateLog[0].operateUser||res.data[0].operateLog[0].operateUser=='null')
																			?'---'
																			:res.data[0].operateLog[0].operateUser
								}
								this.tableData[index].operateLog.unshift(res.data[0].operateLog[0])
								//this.searchData();
								this.$message({
									type: "success",
									message: res.message
								});
								this.loading = false;
							} else {
								this.loading = false;
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
			// 禁言操作  0-正常  1-禁言  2-已删除
			openForbid(index, data) {
				let obj = {
					titleStr: '',
					usedstatus: ''
				};

				if (data.user&&data.user.blogStatus == 1) {
					obj.titleStr = "确定要解除禁言此用户吗？";
					obj.usedstatus = '0';
				}else{
					obj.titleStr = "确定要禁言此用户吗？";
					obj.usedstatus = '1';
				}

				this.$confirm(obj.titleStr, {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(async () => {
						this.loading = true;
						/* 0：正常；1：禁言；2：已删除 */
						try {
							const res = await this.api.updateBanned({
								autoId: data.user.autoId,
                              	blogStatus: obj.usedstatus,
							});
							if (res.success) {
								//this.tableData[index].user.blogStatus = obj.usedstatus;
								this.tableData.map((item) => {
										if (item.user.autoId == data.user.autoId) {
											item.user.blogStatus = obj.usedstatus;
											item.banned = obj.usedstatus==1?true:false
										}
									})
								//this.searchData();
								this.$message({
									type: "success",
									message: res.message
								});
								this.loading = false;
							} else {
								this.$message({
									type: "error",
									message: res.message
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
			},
			// 动态分类映射  1原创，2 转发，3视频，4文本，5图片
			parseType(data) {
				switch (data.blog_type) {
					case 1:
						return "原创";
					case 2:
						return "转发";
					case 3:
						return "视频";
					case 4:
						return "文本";
					case 5:
						return "图片";
					default:
						return "---";
				}
			},
			//话题加#处理
			topicType(data) {
				if (data.topicName && data.topicName.length > 0) {
					let newArr = []
					data.topicName.forEach((item) => {
						item = "#" + item + "#"
						newArr.push(item)
					})
					return newArr.join(",")
				} else {
					return ''
				}
			},
			//智能审核映射
			parseCommentAI(data) {
				/* if (data.status == 0) {
					return "已删除";
				} else if (data.status == 1) {
					return "通过";
				} else if (data.status == 2) {
                  return "审核中";
                } else if (data.status == 3) {
                  return "未通过";
                } else {
					return "---";
				} */
				//如果状态是未通过则显示未通过文字，不根据status判断。accessStatus 0通过，1未通过
				/* if(data.accessStatus == 1){
					return "未通过"
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
			},
			// 查询圈子下拉框
			async queryGroupSelectOpt() {
				try {
					let params = {
						"appInfoId": this.appId
					}
					const res = await this.api.querySelectTheme();
					let arr = [];
					if (res.success == true) {
						res.data.forEach(function(item, index) {
							arr.push({
								label: item.themeName,
								value: item.themeId
							})
						})
						this.groupSelect = [{
							label: '全部',
							value: ''
						}, ...arr];
					} else {
						this.groupSelect = [];
					}

				} catch (e) {
					console.log(e);
				}
			},
			// 查询话题下拉框
			async queryTopicSelectOpt() {
				try {
					let params = {
						"appInfoId": this.appId
					}
					const res = await this.api.querySelectTopic();
					let arr = [];
					if (res.success == true) {
						res.data.forEach(function(item, index) {
							arr.push({
								label: item.topicName,
								value: item.topicId
							})
						})
						this.topicSelect = [{
							label: '全部',
							value: ''
						}, ...arr];
					} else {
						this.topicSelect = [];
					}

				} catch (e) {
					console.log(e);
				}
			},
			// 重置按钮点击
			reset() {
				this.value = '';
				this.topValue = '';
				this.keyword = '';
				this.group = '';
				this.topic = '';
				this.userName = '';
				this.userId = [];
				this.dateRangeArr = [];

				this.searchData("initPage");
			},
			// 检索按钮点击 查询动态审核列表
			async searchData(par) {
				if (par == 'initPage') {
					this.currentPage = 1;
				}
				this.loading = true;
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
						pageNum: this.currentPage,
						pageSize: this.pageSize,
						content: this.keyword.trim(), //内容 关键字
						//status: this.value, //状态
						startTime: this.dateRangeArr && this.dateRangeArr.length > 0 ? this.dateRangeArr[0] : '',
						endTime: this.dateRangeArr && this.dateRangeArr.length > 0 ? this.dateRangeArr[1] : '',
						user_ids: this.userId,
					};
					// 状态如果是正常、未通过传accessStatus，如果是涉及敏感、已删除传status,查全部不传
					//0=已删除，1=正常,2=涉及敏感
					// accessStatus 0=通过   accessStatus 1=未通过  3=已删除。通过未通过传accessStatus，已删除传accessStatus='' status=0
					let statusVal = this.value;
					if(statusVal !== ''){
						if(statusVal == 0){
							//通过
							params.accessStatus = statusVal;
							//params.status = 1;
						}else if(statusVal == 1){
							//未通过
							params.accessStatus = statusVal;
						}else if(statusVal == 3){
							//已删除
							params.accessStatus = '';
							params.status = 0
						}
					}
					if (this.topic) {
						params.topic_id = this.topic.split(",");
					}
					if (this.group) {
						params.theme_id = this.group;
					}
					// 顶精热状态
					if (this.topValue) {
						params[this.topValue] = 1;
					}
					const res = await this.api.getDynamicCheckdata(params);
					this.loading = false;
					let that = this;
					// 禁言标记 0--正常  1--禁言  2--已删除
					res.data.forEach(function(item, index) {
						if (item.user && item.user.blogStatus == 1) {
							item.banned = true
						} else {
							item.banned = false;
						}
						if(item.content){
							item.summary_ = that.commonFunc.filterSummary(item.content);
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
					})
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
		}
	};
</script>
<style lang="less">

	.dynamic {
		font-size: 14px;
		font-family: MicrosoftYaHei;
		font-weight: 400;

		.el-header {
			padding: 0;
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

			.header1 {
				margin: 0 44px 0 28px;
			}

			.header2 {
				margin-right: 130px;
			}

			.header3 {
				margin-right: 30px;
			}

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

			.btn {
				width: 42px;
				height: 20px;
				text-align: center;
				line-height: 20px;
				border: 1px solid rgba(217, 217, 217, 1);
				border-radius: 10px;
				font-size: 12px;
				color: #666;
				cursor: pointer;
				margin-right: 12px;
				background: #fff;
			}

			.btn:nth-child(3) {
				margin: 0;
			}

			.isTop {
				color: #fff;
				background: #ffac38;
				border-color: #ffac38;
			}

			.isRefind {
				color: #fff;
				background: #ff8547;
				border-color: #ff8547;
			}

			.isHot {
				color: #fff;
				background: #f54545;
				border-color: #f54545;
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


	.dynamic {
		.select1 {
			/*margin-right: 30px;*/

			input {
				width: 100px;
			}
		}

		/*.select1:first-child {
			margin-left: 28px;
		}

		.select1:nth-child(2) {
			margin-right: 100px;
		}*/

		.input1 {
			/*margin-right: 28px;*/

			.el-input {
				width: 160px;
			}
		}

		.selectgroupCls {
			/*margin-right: 28px;*/

			.el-select {
				width: 160px;
			}
		}

		.select2 {
			/*margin-right: 70px;*/
		}


	}
</style>
