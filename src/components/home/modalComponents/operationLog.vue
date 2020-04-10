<template>
    <!-- 操作日志弹框 -->
    <el-dialog
            title="操作日志"
            custom-class="commonHeader operationLogModalCls"
            @open="openModalFunc"
            :top="oprationLogTopCss"
            :visible.sync="currentOperationLogModal">
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
            <el-table :data="oprationLogTableData" stripe style="" border max-height="500"
                      v-loading="oprationLogLoading">
                <!-- <el-table-column property="behavior" label="行为" show-overflow-tooltip></el-table-column>
                <el-table-column property="content" label="操作" show-overflow-tooltip></el-table-column>
                <el-table-column property="addTime" label="操作时间"></el-table-column>
                <el-table-column property="userName" label="操作人"></el-table-column> -->

                <template v-for='(col,index) in titleData'>
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :property="col.property"
                            :label="col.label"
                            :key="index">
                    </el-table-column>
                </template>
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
    name: "operationLogModal",
    data() {
      return {
        //弹框打开标记
        currentOperationLogModal: false,
        oprationLogTableData: [],
        oprationLogLoading: false,
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
        oprationLogTopCss: "10vh",
        //不同模块的操作日志字段
        titleData: [],
        columnData: {
          "adLog": [
            {
              label: "行为",
              property: "behavior"
            },
            {
              label: "操作",
              property: "content"
            },
            {
              label: "操作时间",
              property: "addTime"
            },
            {
              label: "操作人",
              property: "userName"
            }
          ],
          "manuscript": [
            {
              label: "行为",
              property: "behavior"
            },
            {
              label: "操作",
              property: "operate"
            },
            {
              label: "操作时间",
              property: "operatingTime"
            },
            {
              label: "操作人",
              property: "operator"
            }
          ],
          "subscription": [
            {
              label: "行为",
              property: "behavior"
            },
            {
              label: "操作",
              property: "content"
            },
            {
              label: "操作时间",
              property: "addTime"
            },
            {
              label: "操作人",
              property: "userName"
            }
          ],
          "circle":[
            {
              label:"行为",
              property:"behavior"
            },
            {
              label:"操作",
              property:"operation"
            },
            {
              label:"操作时间",
              property:"addTime"
            },
            {
              label:"操作人",
              property:"userName"
            }
          ],
          "topic":[
            {
              label:"行为",
              property:"behavior"
            },
            {
              label:"操作",
              property:"content"
            },
            {
              label:"操作时间",
              property:"addTime"
            },
            {
              label:"操作人",
              property:"username"
            }
          ],
          "user":[
            {
              label:"行为",
              property:"behavior"
            },
            {
              label:"操作",
              property:"operation"
            },
            {
              label:"操作时间",
              property:"addTime"
            },
            {
              label:"操作人",
              property:"userName"
            }
          ]
        }
      };
    },
    props: ["operationLogModal", "operationlog_rowData", "Operationlog_fromMark"],
    components: {
      detailPaging
    },
    methods: {
      // 打开回调
      openModalFunc() {
        if (this.Operationlog_fromMark) {
          this.titleData = this.columnData[this.Operationlog_fromMark];
        }
        //每次打开默认一个月
        //this.cloudManuScriptDateVal = [this.commonFunc.formatDate(Date.now() - 86400000 * 30), this.commonFunc.formatDate(Date.now())],
        this.detailCurrentPage = 1;
        this.queryTableData();
      },
      // 操作日志表格数据
      async queryTableData() {
        this.oprationLogLoading = true;
        try {
          let params;
          let res;
          let basicpagePar = {
            pageNo: this.detailCurrentPage,
            pageSize: this.detailPageSize
          };

          if (this.Operationlog_fromMark == "adLog") {
            params = {pid: this.operationlog_rowData.advertId,...basicpagePar};
            res = await this.api.querySingelAdOperation(params);
          } else if (this.Operationlog_fromMark == "manuscript") {
            //pid--稿件唯一标识符，值为稿件的url
            params = {pid: this.operationlog_rowData.url,...basicpagePar};
            res = await this.api.querySingleManuscriptLog(params);
          } else if (this.Operationlog_fromMark == "subscription") {
            params = {pid: this.operationlog_rowData.id,...basicpagePar};
            res = await this.api.queryOperationLog_subscription(params);
          }else if (this.Operationlog_fromMark == "circle") {
            params = {themeId:this.operationlog_rowData.themeId,...basicpagePar};
            res = await this.api.queryOperationLog_circle(params);
          }else if (this.Operationlog_fromMark == "topic") {
            params = {pid:this.operationlog_rowData.topicId,...basicpagePar};
            res = await this.api.queryOperationLog_topic(params);
          }else if (this.Operationlog_fromMark == "user") {
            params = {userId:this.operationlog_rowData.autoId,...basicpagePar};
            res = await this.api.queryOperationLog_user(params);
          }

          if (res.success) {
            this.oprationLogLoading = false;
            if (res.data.length > 0) {
              this.oprationLogTableData = res.data;
              //this.tableData.push(res.data[0].data.total);
              this.detailPageTotal = res.total;
            } else {
              this.oprationLogTableData = [];
              this.detailPageTotal = 0;
            }

            /* this.$message({
                type: "success",
                message: res.message
            }); */
          } else {
            this.oprationLogTableData = [];
            this.oprationLogLoading = false;
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
      operationLogModal(val) {
        this.currentOperationLogModal = val; //新增result的watch，监听变更并同步到myResult上
      },
      currentOperationLogModal(val) {
        //clickmark:this.clickmark
        this.$emit("operationlog_childEvent", {
          operationLogModal: val
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
    .operationLogModalCls {
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
