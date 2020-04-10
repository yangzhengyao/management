<!--因element-ui的-->
<template>
	<div class="paging">
		<div class="record">
			<span>记录总数：<i>{{total}} </i> </span>
			<span>总页数：<i>{{Math.ceil(total/pageSize)}} </i> </span>
			<span>当前页：<i>{{currentPage}} </i> </span>
		</div>
		<el-pagination prev-text="上页" layout="slot,prev" @current-change="handleCurrentChange" @prev-click="prevClick" :total="total"
		 :current-page="currentPage" :page-size="pageSize" :disabled="currentPage==1" :class="currentPage==1?'prevFirstCls':'prevMiddleCls'">
			<el-button class="home-page" @click="toFirstPage">首页</el-button>
		</el-pagination>
		<el-pagination next-text="下页" layout="next,slot" @current-change="handleCurrentChange" @next-click="nextClick" :total="total"
		 :current-page="currentPage" :page-size="pageSize" :class="(currentPage==Math.ceil(total/pageSize)|| total==0)?'nextLastCls':'nextMiddleCls'">
			<input type="text" :value="currentPage" @keyup.enter="toAppointPage" class="page-number" ref="pageNumber" />
			<el-button class="go" @click="toAppointPage">GO</el-button>
		</el-pagination>
	</div>
</template>

<script>
	export default {
		name: "paging",
		components: {},
		data() {
			return {
				bool: true,
				currentPageNum: this.currentPage
			};
		},
		props: ["currentPage", "pageSize", "total"],
		methods: {
			// 同步currentPageNum和currentPage  然后跳转
			handleCurrentChange(v) {
				this.currentPageNum = v;
				this.pageChange();
			},
			nextClick() {
				this.$refs.pageNumber.value++;
				this.currentPageNum = this.currentPage
				this.pageChange();
			},
			prevClick() {
				this.$refs.pageNumber.value--;
				this.currentPageNum = this.currentPage
				this.pageChange();
			},
			toFirstPage() {
				this.currentPageNum = 1;
				this.$refs.pageNumber.value = 1;
				this.pageChange();
			},
			toAppointPage() {
				// 如果输入页数大于总页数  默认重置，否则可能会引起分页按钮置灰问题
				let totalPage = Math.ceil(this.total/this.pageSize);
				if( this.$refs.pageNumber.value > totalPage ){
					this.$refs.pageNumber.value = totalPage;
				}
				if(this.$refs.pageNumber.value<1){
					this.$refs.pageNumber.value = 1;
				}
				this.currentPageNum = Number(this.$refs.pageNumber.value);
				this.handleCurrentChange(this.currentPageNum);
			},
			pageChange() {
				this.$emit("update:currentPage", this.currentPageNum);
			}
		}
	};
</script>

<style lang="less">
	/* 分页样式覆盖 */
	.paging {
		float: right;

		/*翻页激活样式*/
		.nextMiddleCls>button.btn-next,
		.prevMiddleCls>button.btn-prev {
			background-color: #C93931;
			color: #ffffff;
		}

		.record {
			margin-top: 5px;
			float: left;

			i {
				font-style: normal;
				color: #C93931;
			}
		}

		.el-pagination {
			float: left;

			.home-page,
			.btn-prev {
				width: 54px;
				height: 30px;
				/* background: rgba(255, 255, 255, 1); */
				border: 1px solid rgba(217, 217, 217, 1);
				border-radius: 3px;
				/* color: rgba(77, 77, 77, 1); */
			}

			.home-page {
				margin-left: 45px;
				margin-right: 10px;
			}

			.go,
			.btn-next {
				width: 54px;
				border: 1px solid #d9d9d9;
				border-radius: 3px;
				/* background: rgba(201, 57, 49, 1); */
				/* color: rgba(255, 255, 255, 1); */
			}

			.btn-next,
			.btn-prev {
				padding-right: 0;
				padding-left: 0;
			}

			.page-number {
				width: 66px;
				height: 27px;
				margin: 1px 10px 0 10px;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(201, 57, 49, 1);
				border-radius: 3px;
				color: rgba(26, 26, 26, 1);
				text-align: center;
				outline: none;
			}

			/* button:hover{
                color: #C93931;
            } */
		}
	}
</style>
