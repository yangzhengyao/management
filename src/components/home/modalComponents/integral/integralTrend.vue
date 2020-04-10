<template>
	<!-- 积分趋势弹窗  :append-to-body="true" :top="topcss"-->
	<el-dialog :title="dialogTitle" custom-class="commonHeader pointModalCls" :visible.sync="current_openDrawerMark" @open="openFunc"
	 @opened="openedFunc" width="60%">

		<div v-loading="loading" style="height: 500px;">
			<div class="contentCls" style="display: flex;height: 100%">
				<div>
					<div style="height: 50px;text-align: right;">
						<el-date-picker
						      v-model="monthVal"
						      type="month"
							  :clearable="false"
						      placeholder="选择月"
							  format="yyyy-MM"
							  value-format="yyyy-MM"
							  @change="dateChange">
						    </el-date-picker>
					</div>
					<!--趋势图-->
					<div id="detailTrend" style="height: calc(100% - 50px);"></div>
				</div>
				
				<!--表格-->
				<div>
					<el-table v-loading="tableLoading" :data="detailTableData" stripe border max-height="450">
						<el-table-column prop="date" label="操作时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="desc" label="操作描述" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</div>
		</div>

	</el-dialog>
</template>

<script>
	export default {
		name: "integralTrend",
		data() {
			return {
				current_openDrawerMark: false,
				clickmark: 'cancel',
				dialogTitle: "",
				loading: false,
				tableLoading:false,
				detailTableData: [
					/* {
						time: '2019-11-06 21:15:34',
						desc: '每日登录+10'
					},
					{
						time: '2019-11-06 21:30:34',
						desc: '阅读+10'
					},
					{
						time: '2019-11-06 21:40:34',
						desc: '收藏+10'
					} */
				],
				startTime:'',
				endTime:'',
				//月份筛选值
				monthVal:'',
			}
		},
		props: ['trendModalMark', 'trendRowData'],
		components: {

		},
		methods: {
			// 打开弹框
			openFunc() {
				//this.dialogTitle = this.trendRowData.trend; .replace(/-/g,"")
				this.dialogTitle = "近一月积分趋势"
				this.endTime = this.commonFunc.formatDate(new Date());
				let end_ =  new Date().setMonth(new Date().getMonth()-1)
				this.startTime = this.commonFunc.formatDate(end_);
				//默认值当月
				this.monthVal = this.endTime.slice(0,-3)
				
				//查询详情
				this.querydetail();
			},
			openedFunc() {
				//this.drawTrend();
				
				//触发校验
				/*this.$refs.pointForm.validate((valid) => {

				})*/
			},
			//日期选择框change事件  请求某月的数据
			dateChange(val){
				this.querydetail();
			},
			// 显示暂无数据方法
			showNodataFunc(){
				this.detailTableData = [];
				var html = `<div style="text-align:center;margin-top: 20px;color:#c93931">
						<i class="el-icon-warning" style="font-size: 32px;vertical-align: -2px;"></i>
						<span style="margin-left: 10px;color:#66666; font-size: 24px;">暂无数据！</span>
						</div>`
				document.getElementById('detailTrend').innerHTML = html
				document.getElementById('detailTrend').removeAttribute('_echarts_instance_')
			},
			//绘制趋势图
			drawTrend(resData) {
				let trend_ = this.$echarts.init(document.getElementById('detailTrend'));
				let xData = [];
				let yData = [];
				let this_ = this;
				let obj = resData[0]
				
				if(resData.length > 0){
					Object.keys(obj).forEach(function(key){
						//let formKey = key.substring(0,4) + "-" + key.substring(4,6) + "-" + key.substring(6,8)
						xData.unshift(key)
						yData.unshift(obj[key])
					})
					if(xData.length>0){
						this.queryIntegralDeatilFunc(xData[0])
					}
				}else{
					//销毁图表 图表显示暂无数据，表格置空
					trend_.dispose();
					this.showNodataFunc();
					return;
				}				
				
				/*backgroundColor: '#fff',
				color: '#ff7129',*/
				trend_.setOption({
					visualMap: [{
						show: false,
						type: 'continuous',
						seriesIndex: 0,
						min: 0,
						max: 400
					}],
					grid: {
						left: '2%',
						right: '46px',
						top: '8%',
						bottom: '18%',
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					xAxis: {
						type: 'category',
						axisTick: {
							show: true,
							lineStyle: {
								color: "#d4d4d4",
								width: 2
							},
							length: 2
						},
						axisLine: {
							show: true,
							lineStyle: {
								//#e2e2e2
								color: "#e2e2e2",
								width: 2
							},
							onZero: true
						},
						axisLabel: {
							show: true,
							color: "#999999",
							/*interval: 0,*/
							fontSize: 14
						},
						//["11-01", "11-05", "11-08", "11-10", "11-15", "11-17", "11-20"]
						data: xData,
					},
					yAxis: [{
						axisTick: {
							show: true,
							lineStyle: {
								color: "#afafaf",
								width: 2
							},
							length: 2
						},
						type: 'value',
						axisLine: {
							show: false
						},
						axisLabel: {
							show: true,
							color: "#999999",
							fontSize: 14
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: "#f2f2f2",
								width: 2,
								type: 'dashed'
							}
						}
					}],
					dataZoom: [{
							type: 'slider',
							xAxisIndex: 0,
							filterMode: 'filter',
						},
						{
							type: 'inside',
							xAxisIndex: 0,
							filterMode: 'filter'
						},
					],
					series: [{
						name: '积分',
						type: 'line',
						showSymbol: true,
						//symbol:'circle',
						symbolSize: 6,
						smooth: true,
						lineStyle: {
							width: 4,
							shadowOffsetX: 2,
							shadowOffsetY: 10,
							shadowColor: "#faf3e5",
							shadowBlur: 2
						},
						itemStyle:{
							//color: "#c93931",
							borderWidth:2,
							borderColor:"#c93931"
						},
						/*label: {
						  normal: {
						    show: true,
						    position: 'top',
						    textStyle: {
						      color: "#ff7129",
						      fontSize: 14
						    }
						  }
						},*/
						//[100, 200, 300, 560, 405, 202, 152]
						data: yData
					}]
				})
				trend_.off("click")
				trend_.on("click", function(data) {
					let par = data.name
					this_.queryIntegralDeatilFunc(par);
				})
			},
			// 查询趋势
			async querydetail() {
				this.loading = true;
				try {
					let params = {
						userId: this.trendRowData.userId,
						yearMonth:this.monthVal
						/* beginDate:this.startTime,
						endDate:this.endTime */
					};
					const res = await this.api.queryIntegralTrend(params);

					if (res.success) {
						this.loading = false;
						this.drawTrend(res.data)
						
						/* res.data.forEach(function(item, index) {
							item.subscribeImage = item.subscribeImage.split(",");
							item.certificationImages = item.certificationImages.split(",");
						});
						let dataS = res.data[0]; */
						
					} else {
						//查询失败 显示暂无数据
						this.showNodataFunc();
						this.loading = false;
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 查询某天积分详情数据
			async queryIntegralDeatilFunc(par) {
				try {
					this.tableLoading = true;
					
					let params = {
						userId: this.trendRowData.userId,
						date:par,
					};
					const res = await this.api.queryIntegralDetail(params);
					this.tableLoading = false;
					if (res.success) {
						/* res.data.forEach(function(item, index) {
							item.subscribeImage = item.subscribeImage.split(",");
							item.certificationImages = item.certificationImages.split(",");
						});
						let dataS = res.data[0]; */
						if(res.data.length>0){
							res.data.forEach(function(item,index){
								item.desc = item.adminName + item.typeName + item.score
							})
							this.detailTableData = res.data;
						}else{
							this.detailTableData = [];
						}
						
					} else {
						this.detailTableData = [];
						this.$message({
							type: "error",
							message: res.message
						});
					}
				} catch (e) {
					console.log(e);
				}
			},

		},
		mounted() {

		},
		watch: {
			//父子组件双向绑定标记
			trendModalMark(val) {
				this.current_openDrawerMark = val; //新增result的watch，监听变更并同步到myResult上
			},
			current_openDrawerMark(val) {
				this.$emit('childTrendEvent', {
					trendModalMark: val,
					clickmark: this.clickmark
				});

			}
		},
	};
</script>

<style lang="less">
	.pointModalCls {
		.contentCls {
			>div {
				width: 50%;
				height: 100%;
			}

			>div:nth-of-type(2) {
				padding: 30px 40px 0 40px;
				box-sizing: border-box;
			}

			.el-table {
				thead {
					color: #1A1A1A
				}
			}
		}
	}
</style>
