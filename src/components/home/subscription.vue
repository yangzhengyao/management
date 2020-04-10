<template>
    <div class="subscription">
        <el-container>
            <el-header style="display: flex;justify-content: space-between;">
                <div class="header-left">
                    <div class="select1 filterFormContral">
                        <span style="width: 30px;">状态</span>
                        <el-select v-model="stateValue" placeholder="全部" @change="querySubscriptionList('initPage')">
                            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
					<div class="select2 filterFormContral">
					    <span style="width: 60px;">入驻类型</span>
					    <el-select v-model="sortVal" placeholder="全部" @change="querySubscriptionList('initPage')">
					        <el-option v-for="item in sortOpt" :key="item.value" :label="item.label"
					                   :value="item.value">
					        </el-option>
					    </el-select>
					</div>
					<div class="select3 filterFormContral">
					    <span style="width: 60px;">订阅类型</span>
					    <el-select v-model="subscriptiontypeVal" placeholder="全部" @change="querySubscriptionList('initPage')">
					        <el-option v-for="item in subscriptiontypeOpt" :key="item.value" :label="item.label"
					                   :value="item.value">
					        </el-option>
					    </el-select>
					</div>
                    <div class="input1 filterFormContral">
                        <span style="">订阅号名称</span>
                        <el-input v-model.trim="keyWord" style="width: 200px" @keyup.native.enter="querySubscriptionList('initPage')" placeholder="请输入订阅号名称"></el-input>
                    </div>
                </div>
                <div class="header-right">
					<p class="globalHistoryDeleteBtnBg" @click="openDeleteHistory" style="margin-right: 20px;" >删除历史</p>
                    <p class="search globalSearchBtnBg" @click="querySubscriptionList('initPage')">检索</p>
					<p class="search globalSearchBtnBg" style="margin-left: 20px;" @click="reset">重置</p>
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

                        <el-table-column label="订阅号图标" width="180">
                            <template slot-scope="scope">
                                <img v-for="(inItem,index) in scope.row.subscribeImage" :key="index" :src="inItem"
                                     alt="" width="30" height="30"/>
                            </template>
                        </el-table-column>

                        <el-table-column prop="subscribeName" label="订阅号名称" width="200" show-overflow-tooltip></el-table-column>

                        <el-table-column label="地理位置" width="180">
                            <template slot-scope="scope">
                                <span>{{scope.row.province}}</span>
                                <span>{{scope.row.city}}</span>
                                <span>{{scope.row.county}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="description" label="简介" show-overflow-tooltip></el-table-column>
						<el-table-column label="订阅类型" width="180" prop="subTypeName" show-overflow-tooltip></el-table-column>

                        <el-table-column label="入驻类型" width="180" prop="enterTypeName" show-overflow-tooltip>
                            <!-- <template slot-scope="scope">{{parseSort(scope.row)}}</template> -->
                        </el-table-column>

                        <el-table-column label="状态" width="180" class-name="statusCls">
                            <template slot-scope="scope">
                                <!--:style="scope.row.status==1?passStyles:scope.row.status==3?forbidStyles:normalStyles"-->
								<div>
									<!-- 1 拒绝  2通过  0 -1审核中 -->
									<img v-if="scope.row.checkType == 1" src="../../assets/img/home/refuse.png" alt/>
									<img v-else-if="scope.row.checkType == 2" src="../../assets/img/home/pass.png" alt/>
									<img v-else src="../../assets/img/home/applying.png" alt/>
									<span :style="scope.row.checkType==2?passStyles:scope.row.checkType==1?forbidStyles:normalStyles">{{parseStatus(scope.row)}}</span>
								</div>
								<div style="display:flex" v-if="scope.row.checkType == 1">
									<span :title="scope.row.refuesReson" style="width:100%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">{{scope.row.refuesReson}}</span>
								</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="申请时间" width="180">
                            <template slot-scope="scope">
                                <span>{{scope.row.applyTime}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="operation" label="操作" class-name="operationColumnCls" width="200">
                            <template slot-scope="scope">
                                <div style="display: flex;justify-content: flex-start;">
									<button @click="examineClick(scope.row)">审核</button>
									<!-- 拒绝1与待审(0,-1)的订阅号可以删除 -->
									<button class="deleteCls" v-if="scope.row.checkType == 0 || scope.row.checkType == -1 || scope.row.checkType == 1" @click="deleteClick(scope.row)">删除</button>
									<button class="logBtnCls" @click="open_operationLog(scope.row)">日志</button>
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

        <subscriptionReview :openDrawerMark="openDrawerMark" :rowData="rowData" @childEvent="parentMethod"></subscriptionReview>

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
  import subscriptionReview from '@/components/home/modalComponents/subscription/subscriptionReview';
  import operationLog from '@/components/home/modalComponents/operationLog';
  import deleteHistoryLog from '@/components/home/modalComponents/deleteHistoryLog';

  export default {
    name: "subscription",
    data() {
      return {
		  passStyles: {
		  	'color': '#3A8B51',
		  	'font-weight': 'bold'
		  },
		  forbidStyles: {
		  	'color': '#C93931',
		  	'font-weight': 'bold'
		  },
		  normalStyles: {
		  	'color': '#E9BB1C',
			'font-weight': 'bold'
		  },
        stateValue: "", //状态下拉框value
        keyWord: "", //关键词
        stateOptions: [
          {
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
          },
          {
            value: "3",
            label: "申请修改中"
          }
        ],
        loading: false, //表格加载
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        tableData: [],
        openDrawerMark: false,
        rowData:'',
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
        ],
		//入驻类型 0=个人，1=企业,2=政府，3=组织，4=媒体
		sortOpt:[],
		sortVal:"",
		//订阅类型
		subscriptiontypeOpt:[],
		subscriptiontypeVal:'',
		//日志弹框
		operationLogModal:false,
		operationlog_rowData:'',
		Operationlog_fromMark:'',  //点击来源
		//删除历史弹框
		deleteHistoryLogModal:false,
		deleteHistoryRow:'',
		fromPage:'',
      };
    },
    mounted() {
		this.queryEntertype();
		this.querySubscriptiontype();
		this.querySubscriptionList();
    },
    watch: {
      currentPage(newval, oldval) {
        if (newval) {
            this.querySubscriptionList();
        }
      }
    },
    components:{
      subscriptionReview,
	  operationLog,
	  deleteHistoryLog
    },
    methods: {
		//查询入驻类型
		async queryEntertype(par) {
		  try {
		    const res = await this.api.getEnterType();
		    let arr = [];

		    if (res.success == true) {
		      res.data.forEach(function(item, index) {
		        arr.push({
					label:item.name,
					value:item.id
				})
		      });

		      this.sortOpt = [{label:'全部',value:''},...arr];
		    } else {
		      this.sortOpt = [];
		    }

		  } catch (e) {
		    console.log(e);
		  }
		},
		//查询订阅类型
		async querySubscriptiontype(par) {
		  try {
		    const res = await this.api.getSubscriptionType();
		    let arr = [];
		    if (res.success == true) {
		      res.data.forEach(function(item, index) {
		        arr.push(
		          {
		              label:item.name,
		              value:item.id
		          }
		        )
		      });

		      this.subscriptiontypeOpt = [{label:"全部",value:""},...arr];
		    } else {
		      this.subscriptiontypeOpt = [];
		    }

		  } catch (e) {
		    console.log(e);
		  }
		},
		//重置
		reset(){
			this.stateValue = '';
			this.sortVal = '';
			this.subscriptiontypeVal = '';
			this.keyWord = '';
			this.querySubscriptionList("initPage");
		},
      // 查询订阅号列表
      async querySubscriptionList(par) {
        this.loading = true;
        if (par == "initPage") {
          this.currentPage = 1;
        }
        try {
          let params = {
            pageNo: this.currentPage,
            pageSize: this.pageSize,
			//入驻类型
            enterTypeId: this.sortVal,
			//订阅类型
			subTypeId: this.subscriptiontypeVal,
            userId: "",
            //状态
            checkType:this.stateValue,
            //关键词
            subscribeName:this.keyWord
          };
          const res = await this.api.getSubscriptionList(params);
          this.loading = false;
          let arr = [];

          if (res.success == true) {
            res.data.forEach(function(item, index) {
              item.subscribeImage = item.subscribeImage.split(",");
            });

            this.tableData = res.data;
            this.pageTotal = res.total;
          } else {
            this.tableData = [];
            this.pageTotal = 0;
          }

        } catch (e) {
          console.log(e);
        }
      },
      parseSort(row) {
        //入驻类型：0=个人，1=企业,2=政府，3=组织，4=媒体
        if (row.enterType == 0) {
          return "个人";
        } else if (row.enterType == 1) {
          return "企业";
        }else if (row.enterType == 2) {
          return "政府";
        }else if (row.enterType == 3) {
          return "组织";
        }else if (row.enterType == 4) {
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
        } else if (row.checkType == 3) {
          return "申请修改中";
        }else {
          return "";
        }
      },
      // 审核点击
      examineClick(row) {
        this.openDrawerMark = true;
        this.rowData = row;
      },
	  //删除订阅号
	  deleteClick(row){
		  this.$confirm("确定删除此订阅号吗？", {confirmButtonText: "确定",cancelButtonText: "取消",type: "warning"})
		  	.then(async () => {
		  		this.loading = true;
		  		try {
		  			const res = await this.api.deleteSubscription({id:row.id});
		  			if (res.success) {
		  				this.querySubscriptionList();
		  				this.$message({
		  					type: "success",
		  					message: res.message
		  				});
		  			}else{
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
      parentMethod(param) {
        this.openDrawerMark = param.openDrawerMark;
        //仅在点击确定关闭弹框关闭时
        if( param.clickmark == "confirm" ){
          //刷新列表
          this.querySubscriptionList();
        }
      },
	  //操作日志弹框
	  open_operationLog(row){
	  	this.operationLogModal = true;
	  	this.operationlog_rowData = row;
	  	this.Operationlog_fromMark = "subscription";
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
	  	this.fromPage = "subscription";
	  },
	  deleteHistoryLog_parentMethod(param) {
	  	this.deleteHistoryLogModal = param.deleteHistoryLogModal;
	  },
	  sycncRefresh_parentMethod(){
	  	// 刷新列表
	  	this.currentPage = 1;
	  	this.querySubscriptionList("initPage");
	  },
	  /* ----------删除历史弹框end ---------*/
      //弹窗下拉框切换赋值
      dialogOptionsChange(val) {
        this.createForm.type = val;
      },
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

    .subscription {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;

        .el-header {
            background: rgba(255, 255, 255, 1);
            padding: 15px 28px;

            div {
                .el-date-editor > i {
                    font-size: 18px;
                    color: #c93931;
                    line-height: 22px;
                }

                .el-date-editor > span {
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

				.filterFormContral{
					display: flex;
					align-items: center;
					margin-right: 30px;
				}

                .input1,
                .select1,.select3 {
                    /*width: 13%;*/
					>.el-select{
						width: 120px;
						input {
							background-position: 94px center;
						}
					}
                }

                div>span{
                    margin-right: 10px;
                }

                .select2 {
					>.el-select{
						width: 100px;
						input {
							background-position: 74px center;
						}
					}
                }

				.select4{
					>.el-select{
						width: 120px;
						input {
							background-position: 94px center;
						}
					}
				}

                span {
                    color: rgba(26, 26, 26, 1);
                    /*width: 45px;*/
                }
            }

            .header-right {
				>p.search{
                width: 74px;
                height: 30px;
                /*background: rgba(201, 57, 49, 1);*/
                border-radius: 3px 3px 3px 3px;
                color: rgba(255, 255, 255, 1);
                text-align: center;
                line-height: 30px;
				cursor: pointer;
				display:inline-block;
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
                /* height: 48px; */
            }

            th {
                background: rgba(246, 246, 246, 1);
                color: rgba(26, 26, 26, 1);
                /* padding: 0; */
            }

            td {
                color: rgba(102, 102, 102, 1);
            }

            .el-table--striped .el-table__body tr.el-table__row--striped td {
                background: rgba(245, 247, 252, 1);
            }

            .el-table tbody .el-table__row--striped:hover > td,
            .el-table tbody tr:hover > td {
                background: rgba(227, 238, 255, 1);
            }

            th,
            td {
                display: table-cell !important; //解决表格边框错乱问题
                border: 1px solid #d9d9d9;
                border-bottom: 0;
                border-right: 0;
                /* padding: 0; */

                img{
                    /* margin-top: 6px;
                    margin-right: 6px; */
					vertical-align: middle;
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
					margin-right: 10px;
                }

                button.deleteCls {
                    background: #B3B3B3;
					margin-right: 10px;
					/* margin-left: 15px; */
                }
				button.logBtnCls {
					border-color: #c93931;
					color: #c93931;
				}
            }

			td.statusCls{
				img{
					margin-right:5px
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

            .el-radio__input.is-checked + .el-radio__label {
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
