<template>
	<div class="complaint">
		<el-container>
			<el-header style="display: flex;justify-content: space-between;">
				<div class="header-left">
					<div class="input1">
						<span>标题</span>
						<el-input v-model="title" @keyup.native.enter="searchClick" placeholder="请输入标题"></el-input>
					</div>
					<div class="select2">
						<span>日期</span>
						<el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
						 end-placeholder="结束日期" value-format="yyyy-MM-dd" :unlink-panels="true">
						</el-date-picker>
					</div>
					<div class="select1">
						<span style="width: 60px;">回复情况</span>
						<el-select v-model="stateValue" placeholder="全部" @change="stateOptionsChange">
							<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="header-right globalSearchBtnBg">
					<p class="search" @click="searchClick">检索</p>
				</div>
			</el-header>
			<el-main>
				<template>
					<el-table :data="tableData" stripe style="width: 100%" max-height="670" border v-loading="loading">
						<el-table-column label="投诉人信息" width="390">
							<template slot-scope="scope">
								<div class="flex-row">
									<div class="w50 mr-r1">
										<div class="small-item">
											<span class="small-item-label">投诉单位:</span>
											<div class="small-item-desc huan1" :title="scope.row.companyName">{{scope.row.companyName}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">手机:</span>
											<div class="small-item-desc huan1" :title="scope.row.phone">{{scope.row.phone}}</div>
										</div>
										<div class="small-item" style='margin-top: 90px;'>
											<span class="small-item-label">审核状态:</span>
											<!-- APP端是否展示该投诉信息  0=不展示，1=展示 FFFFFF dad2d2-->
											<el-switch :value="scope.row.show==1" active-color="#CAA267" inactive-color="#FFFFFF" @click.native="stopBubble"
													   @change="changeShowStatus(scope.$index,scope.row)"></el-switch>
										</div>
									</div>
									<div class="w50">
										<div class="small-item">
											<span class="small-item-label">姓名:</span>
											<div class="small-item-desc huan1" :title="scope.row.userName">{{scope.row.userName}}</div>
										</div>
										<div class="small-item">
											<span class="small-item-label">时间:</span>
											<div class="small-item-desc huan1" :title="scope.row.complaintsTime">{{scope.row.complaintsTime}}</div>
										</div>
										<div style='margin-top: 90px;'>
											<!--未回复展示回复按钮-->
											<button @click="replyClick(scope.row)" :style="{display: scope.row.replyStatus == 0 ? 'inline-block' : 'none'}">回复</button>
											<!--已回复展示修改回复按钮-->
											<button @click="replyClick(scope.row)" :style="{display: scope.row.replyStatus == 1 ? 'inline-block' : 'none'}">修改回复</button>
											<button @click="deleteClick(scope.row)">删除</button>
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="投诉信息">
							<template slot-scope="scope">
								<div class="small-item">
									<span class="small-item-label">标题:</span>
									<div class="small-item-desc">{{scope.row.title}}</div>
								</div>
								<div class="small-item">
									<span class="small-item-label">正文:</span>
									<div class="small-item-desc huan2">{{scope.row.content}}</div>
								</div>
								<div class="small-item">
									<!--图片-->
									<div v-if="scope.row.pictureUrl.length>0">
										<!--<div class="wrapCls" v-for="(item, index) in scope.row.pictureUrl" :key="index">
											<div class="wrapHover">
												<i class="el-icon-zoom-in" style="" @click="openpreviewModal(item,'img')"></i>
											</div>
											<img class=""  :src="item" alt="" />
										</div>-->

										<div>
											<viewer :images="scope.row.pictureUrl" style="">
												<img title="点击预览" alt="" class="tdImgCls" v-for="(item, index) in scope.row.pictureUrl" :key="index" :src="item" height="60" width="60">
											</viewer>
										</div>
									</div>
									<!--视频-->
									<div v-if="scope.row.videoUrl.length>0">
										<div class="wrapCls">
											<div class="wrapHover">
												<i class="el-icon-video-play" style="" @click="openpreviewModal(scope.row.videoUrl[0],'video')"></i>
											</div>
											<img class=""  :src="scope.row.videoUrl[1]" alt="" />
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="回复情况" width="490">
							<template slot-scope="scope">
								<div v-if="scope.row.replyStatus == 1" style="color:#21BE6F;text-align: left;">已回复</div>
								<div v-else style="color:#E32519;text-align: left;">未回复</div>
								<div class="small-item" v-if="scope.row.replyStatus == 1">
									<div class="small-item-desc huan4" v-if="scope.row.reply">{{scope.row.reply.replayContent || ''}}</div>
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

		<!-- 新建活动弹窗 -->
		<el-dialog :title="dialogTitle" :visible.sync="replyDialog" :close-on-click-modal="false">
			<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请输入回复内容" v-model="replayContent" :maxlength="255" show-word-limit>
			</el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="replyDialog = false">取 消</el-button>
				<el-button type="primary" @click.native="addReplyByComplaintsId">确 定</el-button>
			</div>
		</el-dialog>

		<preview-modal :showDialog="showDialog" :previewRow="previewRow" :belong="belong" @childEvent="previewModalMethod"></preview-modal>
	</div>
</template>

<script>
  	import previewModal from '@/components/home/modalComponents/previewModal';

	export default {
		name: "complaint",
		components: {
          previewModal
		},
		data() {
			return {
				title: '', //标题
				stateValue: '', //类别下拉框value
				dateRange: [], //时间范围
				stateOptions: [{
						value: "",
						label: "全部"
					},
					{
						value: "0",
						label: "未回复"
					},
					{
						value: "1",
						label: "已回复"
					}
				],
				loading: false, //表格加载
				currentPage: 1,
				pageSize: 3,
				pageTotal: 0,
				tableData: [],
				dialogTitle: '回复',
				replyDialog: false,
				replayContent: '', //回复内容
				currentComplaintsId: '', //当前企业投诉ID
              	previewRow:'',
              	belong:'',
              	showDialog:false,
			  	rowReplyStatus:'',
			  	//回复主键id
			  	rowReplyId:''
			}
		},
		mounted() {
			this.selectInfoByParam()
		},
		watch: {
			currentPage(newval, oldval) {
				if (newval) {
					this.selectInfoByParam()
				}
			}
		},
		methods: {
          	stopBubble(event) {
            	event.stopPropagation();
          	},
		  	// 图片、视频预览弹框
          	openpreviewModal(file,type){
            	this.belong = type;
            	this.previewRow = file;
            	this.showDialog = true;
          	},
          	previewModalMethod(param){
            	this.showDialog = param.showDialog;
          	},
		  	//修改展示状态
          	changeShowStatus(index,row){
          	  //0=不展示，1=展示
              let obj = {
                titleStr: '',
                usedShow: ''
              };
              if (row.show == 1) {
                obj.titleStr = "确定要禁止此条投诉吗？";
                obj.usedShow = '0';
              } else {
                obj.titleStr = "确定要展示此条投诉吗？";
                obj.usedShow = '1';
              }

              this.$confirm(obj.titleStr, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(async () => {
                  this.loading = true;
                  try {
                    /* 0不展示  1展示 */
                    const res = await this.api.updateComplaints({
                      show: obj.usedShow,
                      id: row.id,
                    });
                    if (res.success) {
                      this.tableData[index].show = obj.usedShow;
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
			//企业投诉列表查询
			async selectInfoByParam() {
				this.loading = true
				try {
					let params = {
						replyStatus: this.stateValue, //回复情况
						pageNo: this.currentPage,
						pageSize: this.pageSize,
						title: this.title,
						startDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[0] : '',
						endDate: this.dateRange && this.dateRange.length > 0 ? this.dateRange[1] : ''
					}
					const res = await this.api.selectInfoByParam(params);
					if (res.success) {
						this.loading = false
						this.pageTotal = res.total
						// 处理返回图片
						if (res.data.length > 0) {
							res.data.forEach((item) => {
								item.pictureUrl = item.pictureUrl!==''&&item.pictureUrl!=null?item.pictureUrl.split(','):[];
								item.videoUrl = item.videoUrl!==''&&item.videoUrl!=null?item.videoUrl.split(','):[];
							});
						}

						this.tableData = res.data
						/* this.$message({
							type: "success",
							message: res.message
						}); */
					} else {
						this.tableData = [];
                      	this.pageTotal = 0;
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
			searchClick() {
				this.currentPage = 1
				this.selectInfoByParam()
			},
			// 栏目切换触发
			stateOptionsChange() {

			},
			// 回复按钮
			replyClick(row) {
          	  	this.rowReplyStatus = row.replyStatus;
          	  	this.rowReplyId = row.reply?row.reply.id:'';
          	  	if(row.replyStatus == 1){
				  //修改回复
				  this.dialogTitle = "修改回复";
				  this.replayContent = row.reply.replayContent;
			  	}else{
				  this.dialogTitle = "回复";
                  this.replayContent = "";
				}
				this.replyDialog = true;
				this.currentComplaintsId = row.id
			},
			//回复接口
		  	addReplyByComplaintsId() {
				if (this.replayContent == '') {
					this.$message({
						type: "error",
						message: '回复内容不能为空！'
					});
					return false
				}
				this.loading = true;

				let url;
				let param;
				if(this.rowReplyStatus==1){
				  	//修改回复
					url="complaint/updateComplaintsReply";
					param = {
					  id:this.rowReplyId,
                      replayContent: this.replayContent,
                      complaintsId: this.currentComplaintsId,
                      replayUserId: ''
					}
				}else{
                  url="complaint/addReplyByComplaintsId";
                  param = {
                    replayContent: this.replayContent,
                    complaintsId: this.currentComplaintsId,
                    replayUserId: ''
                  }
				}

              	this.api.crossPost(url, param)
					.then(res => {
					  if (res.success) {
                        this.loading = false;
                        this.replyDialog = false;
                        this.selectInfoByParam()
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
				/*try {
					let params = {
						replayContent: this.replayContent,
						complaintsId: this.currentComplaintsId,
						replayUserId: ''
					}

					const res = await this.api.addReplyByComplaintsId(params);
					if (res.success) {
						this.loading = false
						this.replyDialog = false
						this.selectInfoByParam()

					} else {
						this.loading = false
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}*/
			},
			// 删除按钮
			deleteClick(row) {
              this.$confirm("您确定要删除此条投诉吗？", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(async () => {
                  this.loading = true;
                  try {
                    const res = await this.api.deleteComplaints({
                      id:row.id
                    });
                    this.loading = false;
                    if (res.success) {
                      this.selectInfoByParam();
                      this.$message({
                        type: "success",
                        message: res.message
                      });
                    }else{
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
		white-space: nowrap!important;
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

	.huan4 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		overflow: hidden;
	}

	.complaint {
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
				width: 80%;

				.input1,
				.select1 {
					width: 12%;
					display: flex;
					align-items: center;
					margin-right: 20px;
				}

				.select2 {
					width: 25%;
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
						height: 189px;
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

				button:nth-of-type(1),button:nth-of-type(2) {
					background: rgba(201, 57, 49, 1);
					margin-right: 20px;
				}

				button:nth-of-type(2){
					width: 64px;
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

			/*。button:nth-of-type(1) {
				background: rgba(201, 57, 49, 1);
				margin-right: 40px;
			}

			.cell button:nth-of-type(2) {
				background: #B3B3B3;
			}*/

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
			margin-top: 25vh !important;
			width: 476px;

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

	/*悬浮预览*/
	.wrapCls{
		display: inline-block;
		width: 60px;
		height: 60px;
		margin-right: 15px;
		text-align: center;
		line-height: 60px;
		position: relative;
		overflow: hidden;
		img{
			width: 100%;
			height: 100%;
		}
		.wrapHover{
			display: none;
			width: 60px;
			height: 60px;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, .6);
			i {
				color: #fff;
				font-size: 18px;
				cursor: pointer;
				margin: 0 2px;
			}
		}
	}
	.wrapCls:hover .wrapHover{
		display: block;
	}

	.tdImgCls{
		margin-right: 15px;
		cursor: pointer;
	}
</style>
