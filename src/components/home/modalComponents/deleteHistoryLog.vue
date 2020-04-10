<template>
    <!-- 删除历史日志弹框 -->
    <el-dialog
            title="删除历史"
            custom-class="commonHeader deleteHistoryLogModalCls"
            @open="openModalFunc"
            :top="deleteHistoryLogTopCss"
            :visible.sync="currentDeleteHistoryLogModal">
        <!-- <div style="text-align: right;padding-bottom:15px;">
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
        </div> -->
        <div style="height: 500px;">
            <el-table :data="deleteHistoryLogTableData" stripe style="" border max-height="500"
                      v-loading="deleteHistoryLogLoading">

                <template v-for='(col,index) in deleteTitleData'>
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :property="col.property"
                            :label="col.label"
                            :key="index">
                    </el-table-column>
                </template>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <!-- <el-button type="text">恢复</el-button> width: 42px;height: 20px;line-height: 20px;padding: 0; -->
                        <el-button
                                style="padding: 3px 6px;"
                                size="mini"
                                type="primary"
                                round
                                :loading="scope.row.btnLoading"
                                @click.native="undeleteAdvert(scope.row,scope.$index)">恢复
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="" style="padding-top: 20px;height: 36px;">
            <!-- <el-button type="primary" size="small" @click="exportCloudManuscriptExcel">导出Excel</el-button> -->
            <detailPaging :total="detailPageTotal" :detailCurrentPage.sync="detailCurrentPage"
                          :pageSize="detailPageSize"></detailPaging>
        </div>
    </el-dialog>
</template>

<script>
  import detailPaging from "@/components/common/detailPage";

  export default {
    name: "deleteHistoryLogModal",
    data() {
      return {
        //弹框打开标记
        currentDeleteHistoryLogModal: false,
        deleteHistoryLogTableData: [],
        deleteHistoryLogLoading: false,
        detailPageTotal: 0,
        detailCurrentPage: 1,
        detailPageSize: 10,
        //时间选择
        pickerOptions: {
          shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }]
        },
        //cloudManuScriptDateVal:[this.commonFunc.formatDate(Date.now() - 86400000 * 30), this.commonFunc.formatDate(Date.now())],
        deleteHistoryLogTopCss: "10vh",
        //不同模块的删除历史日志字段
        deleteTitleData: [],
        columnData: {
          //广告--删除历史
          "ad": [
            {
              label: "广告说明",
              property: "advertName"
            },
            {
              label: "删除时间",
              property: "addTime"
            },
            {
              label: "操作人",
              property: "userName"
            }
          ],
          //订阅号--删除历史
          "subscription": [
            {
              label: "名称",
              property: "subscribeName"
            },
            {
              label: "删除时间",
              property: "addTime"
            },
            {
              label: "操作人",
              property: "userName"
            }
          ],
          //圈子--删除历史
          "circle": [
            {
              label: "名称",
              property: "themeName"
            },
            {
              label: "删除时间",
              property: "addTime"
            },
            {
              label: "操作人",
              property: "userName"
            }
          ],
          //话题--删除历史
          "topic": [
            {
              label: "名称",
              property: "topicName"
            },
            {
              label: "删除时间",
              property: "addTime"
            },
            {
              label: "操作人",
              property: "username"
            }
          ],
          //用户--删除历史
          "user":[
            {
              label:"昵称",
              property:"nickName"
            },
            {
              label:"删除时间",
              property:"delTime"
            },
            {
              label:"操作人",
              property:"userName"
            }
          ]
        }
      };
    },
    props: ["deleteHistoryLogModal", "deleteHistoryRow", "fromPage"],
    components: {
      detailPaging
    },
    methods: {
      // 打开回调
      openModalFunc() {
        if (this.fromPage) {
          this.deleteTitleData = this.columnData[this.fromPage];
        }
        //每次打开默认一个月
        //this.cloudManuScriptDateVal = [this.commonFunc.formatDate(Date.now() - 86400000 * 30), this.commonFunc.formatDate(Date.now())],
        this.detailCurrentPage = 1;
        this.queryTableData();
      },
      // 查询历史删除日志
      async queryTableData() {
        this.deleteHistoryLogLoading = true;
        try {
          let res;
          let params = {
            pageNo: this.detailCurrentPage,
            pageSize: this.detailPageSize
          };

          if (this.fromPage == "ad") {
            //广告
            res = await this.api.queryHistoryDeleteLog(params);
          } else if (this.fromPage == "subscription") {
            //订阅号
            res = await this.api.queryHistoryDeleteLog_subscription(params);
          } else if (this.fromPage == "circle") {
            //圈子
            res = await this.api.queryHistoryDeleteLog_circle(params);
          } else if (this.fromPage == "topic") {
            //话题
            res = await this.api.queryHistoryDeleteLog_topic(params);
          }else if (this.fromPage == "user") {
            //用户
            res = await this.api.queryHistoryDeleteLog_user(params);
          }

          if (res.success) {
            this.deleteHistoryLogLoading = false;
            if (res.data.length > 0) {
              res.data.forEach(function(item, index) {
                item.btnLoading = false;
              });
              this.deleteHistoryLogTableData = res.data;
              //this.tableData.push(res.data[0].data.total);
              this.detailPageTotal = res.total;
            } else {
              this.deleteHistoryLogTableData = [];
              this.detailPageTotal = 0;
            }

            /* this.$message({
                type: "success",
                message: res.message
            }); */
          } else {
            this.deleteHistoryLogTableData = [];
            this.deleteHistoryLogLoading = false;
            this.$message({
              type: "error",
              message: res.message,
              duration: 1000
            });
          }
        } catch (e) {
          console.log(e);
        }
      },
      //恢复动作
      undeleteRequest() {
        this.$emit("sycncRefresh_childEvent", {});
      },
      //恢复调用接口
      async undeleteAdvert(row, index) {
        this.deleteHistoryLogTableData[index].btnLoading = true;
        try {
          let params;
          let res;

          if (this.fromPage == "ad") {
            //广告
            params = {
              advertId: row.pid
            };
            res = await this.api.undeleteAd(params);
          } else if (this.fromPage == "subscription") {
            //订阅号
            params = {
              pid: row.pid
            };
            res = await this.api.undelete_subscription(params);
          } else if (this.fromPage == "circle") {
            //圈子
            params = {
              themeId: row.themeId
            };
            res = await this.api.undelete_circle(params);
          } else if (this.fromPage == "topic") {
            //话题
            params = {
              topicId: row.pid
            };
            res = await this.api.undelete_topic(params);
          } else if(this.fromPage == "user"){
            //用户
            params = {
              delUserId: row.delUserId
            };
            res = await this.api.undelete_user(params);
          }

          this.deleteHistoryLogTableData[index].btnLoading = false;
          if (res.success) {
            //刷新父级列表
            this.undeleteRequest();
            // 刷新当前列表
            this.queryTableData();
            this.$message({
              type: "success",
              message: res.message,
              duration: 1000
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
              duration: 1000
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    mounted() {

    },
    watch: {
      //父子组件双向绑定标记
      deleteHistoryLogModal(val) {
        this.currentDeleteHistoryLogModal = val; //新增result的watch，监听变更并同步到myResult上
      },
      currentDeleteHistoryLogModal(val) {
        //clickmark:this.clickmark
        this.$emit("deleteHistoryLog_childEvent", {
          deleteHistoryLogModal: val
        });
      },
      detailCurrentPage(newval, oldval) {
        if (newval) {
          this.queryTableData();
        }
      }
    }
  };
</script>

<style lang="less">
    /* 操作日志弹框 */
    .deleteHistoryLogModalCls {
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
        }

        /* 详情弹框表格样式 表格高度固定,最后一行显示 */
        .el-table {
            tbody {
                > tr:last-child {
                    td {
                        border-bottom: 1px solid #d9d9d9;
                    }
                }
            }
        }
    }
</style>
