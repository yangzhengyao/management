<template>
	<div class="home" @click="showDrawer=false">
		<el-container style="min-height:100vh">
			<el-header class="home-header">
				<el-row>
					<el-col>
						<!--<img class="logo" src="../assets/img/home/LOGO.png" alt/>-->
						<img @click="openNewTab" style="cursor: pointer;" class="logo" :src="logoUrl" alt />
						<span class="shenhe">-审核管理平台</span>
					</el-col>
					<!--<el-col :span="8" class="adminInfo">
                        <el-dropdown trigger="click" placement="bottom-start">
                              <span class="el-dropdown-link" style="cursor:pointer">
                                <img src="../assets/img/home/头像.png" alt/>
                                <span class="adminName">吉吉</span>
                              </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="quit">退出登陆</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>-->
				</el-row>
			</el-header>
			<el-container style="margin-top:-1px" class="containerCls">
				<el-aside>
					<el-menu :default-active="activeMenu">
						<el-menu-item index="1" v-if="isHave('评论审核')" @click="currentView = 'CommentCheck'">
							<img src="../assets/img/home/CommentCheck.png" alt />
							<span>评论审核</span>
						</el-menu-item>
						<el-menu-item index="2" v-if="isHave('动态审核')" @click="currentView = 'dynamic'">
							<img src="../assets/img/home/dynamic.png" alt />
							<!-- 东坡区融媒体展示聊吧审核 -->
							<span>{{appId==20?"聊吧审核":"动态审核"}}</span>
						</el-menu-item>
						<el-menu-item index="3" v-if="isHave('圈子管理')" @click="currentView = 'circles'">
							<img src="../assets/img/home/circles.png" alt />
							<span>圈子管理</span>
						</el-menu-item>
						<el-menu-item index="4" v-if="isHave('话题管理')" @click="currentView = 'topic'">
							<img src="../assets/img/home/topic.png" alt />
							<span>话题管理</span>
						</el-menu-item>
						<el-menu-item index="5" v-if="isHave('活动管理')" @click="currentView = 'active'">
							<img src="../assets/img/home/active.png" alt />
							<span>活动管理</span>
						</el-menu-item>
						<el-menu-item index="6" v-if="isHave('用户管理')" @click="currentView = 'user'">
							<img src="../assets/img/home/user.png" alt />
							<span>用户管理</span>
						</el-menu-item>
						<el-menu-item index="7" v-if="isHave('积分')" @click="currentView = 'integral'">
							<img src="../assets/img/home/integral.png" alt />
							<span>积分</span>
						</el-menu-item>
						<el-menu-item index="8" v-if="isHave('订阅')">
							<img src="../assets/img/home/subscribe.png" alt />
							<span>订阅</span>
						</el-menu-item>
						<el-menu-item index="9" v-if="isHave('广告')" @click="currentView = 'advert'">
							<img src="../assets/img/home/advert.png" alt />
							<span>广告</span>
						</el-menu-item>
						<el-menu-item index="10" v-if="isHave('部门统计')" @click="currentView = 'department'">
							<img src="../assets/img/home/department.png" alt />
							<span>部门统计</span>
						</el-menu-item>
						<el-menu-item index="11" v-if="isHave('人员统计')" @click="currentView = 'personnel'">
							<img src="../assets/img/home/personnel.png" alt />
							<span>人员统计</span>
						</el-menu-item>
						<el-menu-item index="12" v-if="isHave('稿件统计')" @click="currentView = 'manuscript'">
							<img src="../assets/img/home/manuscript.png" alt />
							<span>稿件统计</span>
						</el-menu-item>
						<el-menu-item index="13" v-if="isHave('举报统计')" @click="currentView = 'report'">
							<img src="../assets/img/home/report.png" alt />
							<span>举报统计</span>
						</el-menu-item>
						<el-menu-item index="14" v-if="isHave('订阅号管理')" @click="currentView = 'subscription'">
							<img src="../assets/img/home/subscription.png" alt />
							<span>订阅号管理</span>
						</el-menu-item>
						<el-menu-item index="15" v-if="isHave('投诉管理')" @click="currentView = 'complaint'">
							<img src="../assets/img/home/complaint.png" alt />
							<span>投诉管理</span>
						</el-menu-item>
						<!--v-if="isHave('意见反馈')"-->
						<el-menu-item index="16" v-if="isHave('意见反馈')" @click="currentView = 'feedback'">
							<img src="../assets/img/home/feedback.png" alt />
							<span>意见反馈</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<el-main class="home-main">
					<component :is="currentView" @show-drawer="showDrawerAction"></component>
				</el-main>
				<el-drawer :visible.sync="showDrawer" @open="openDrawerFunc" direction="rtl" size="600px" :append-to-body="false"
				 :modal="false" :wrapperClosable="true" custom-class="commonWrapCls" @click.native.stop>
					<news-detail v-loading="drawerloading" :type="detailType" :newsData="newsDetail"></news-detail>
				</el-drawer>
			</el-container>
		</el-container>
	</div>
</template>
<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	import newsDetail from "@/components/common/newsDetail";

	export default {
		components: {
			newsDetail
		},
		data() {
			return {
				menuList: [], //菜单列表
				currentView: "",
				showDrawer: false,
				detailType: "news",
				newsDetail: {},
				asyncRequest: false, //需要查询详情的标记
				asyncDetailData: "", //异步查询时所用到的行数据
				//激活菜单
				activeMenu: '3',
				//激活菜单id和返回值的映射
				reflectMenuVal: {
					"评论审核": {
						index: "1",
						view: "CommentCheck"
					},
					"动态审核": {
						index: "2",
						view: "dynamic"
					},
					"圈子管理": {
						index: "3",
						view: "circles"
					},
					"话题管理": {
						index: "4",
						view: "topic"
					},
					"活动管理": {
						index: "5",
						view: "active"
					},
					"用户管理": {
						index: "6",
						view: "user"
					},
					"积分": {
						index: "7",
						view: "integral"
					},
					"订阅": {
						index: "8",
						view: "dynamic"
					},
					"广告": {
						index: "9",
						view: "advert"
					},
					"部门统计": {
						index: "10",
						view: "department"
					},
					"人员统计": {
						index: "11",
						view: "personnel"
					},
					"稿件统计": {
						index: "12",
						view: "manuscript"
					},
					"举报统计": {
						index: "13",
						view: "report"
					},
					"订阅号管理": {
						index: "14",
						view: "subscription"
					},
					"投诉管理": {
						index: "15",
						view: "complaint"
					},
                  	"意见反馈": {
						index: "16",
						view: "feedback"
					},
				},
				//logoUrl
				logoUrl: '',
				//el-drawer loading
				drawerloading: false,
				// 记录激活菜单的index
				view_index: {
					"CommentCheck": "1",
					"dynamic": "2",
					"circles": "3",
					"topic": "4",
					"active": "5",
					"user": "6",
					"integral": "7",
					"advert": "9",
					"department": "10",
					"personnel": "11",
					"manuscript": "12",
					"report": "13",
					"subscription": "14",
					"complaint": "15",
				  	"feedback":"16",
				}
			};
		},
		created() {
			let urlPar = this.commonFunc.parseUrlParam(window.location.href);
			let countyVal = urlPar["county"];
			let headUrl = "http://hongqi.wengegroup.com:8082/" + countyVal + "/img/header-logo.png";
			this.logoUrl = headUrl;
			document.getElementsByTagName('link')[0].href = "http://hongqi.wengegroup.com:8082/" + countyVal + "/img/logo.png";
			this.getUserList();
			//this.ssoLoginFunc();
		},
		computed: {
			...mapGetters([
				'appId',
			]),
			menuType: function() {
				let init;
				// type=0为开发环境，type=1为生产环境  || window.location.host.indexOf("192.168.16") > -1
				if (window.location.host.indexOf("wengegroup") > -1) {
					init = 1;
				} else {
					init = 0;
				}
				return init;
			}
		},
		watch: {
			currentView(newVal, oldVal) {
				// 存储激活菜单信息
				sessionStorage.setItem("menuActiveView", newVal);
				sessionStorage.setItem("menuActiveIndex", this.view_index[newVal])
			},
		},
		methods: {
			...mapMutations([
				'setAppInfoId'
			]),
			// 打开新的标签页
			openNewTab() {
				let urlPar = this.commonFunc.parseUrlParam(window.location.href);
				let cutPar = urlPar["county"];

				//'hongqi.wengetech.com:8081'  "http://"+cutPar+".wengetech.com:28083/pages/home.html"
				let openurl_ = "http://" + cutPar + ".wengegroup.com:8081";
				window.open(openurl_, "_blank")
			},
			// 取county
			async ssoLoginFunc() {
				try {
					let urlPar = this.commonFunc.parseUrlParam(window.location.href);
					let cutPar = {
						county: urlPar["county"]
					};
					let host = cutPar.county;
					let url = "http://" + host + ".wengegroup.com:8081/cas/login";
					let params = {
						service: '127.0.0.1:9201/login/ssoapplogin'
					};

					const res = await this.api.ssoLogin(url, params);
					this.getUserList();
				} catch (e) {
					console.log(e);
				}
			},
			//获取菜单列表
			async getUserList() {
				// 查询菜单前遮罩
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.8)',
					text: "拼命加载中....",
					customClass: "fullLoadingCls"
				});
				try {
					//type:this.menuType
					let urlPar = this.commonFunc.parseUrlParam(window.location.href);
					let params = {
						type: 0
					};
					const res = await this.api.getUserList();
					if (res.success) {
						loading.close();
						this.setAppInfoId(res.data[0].appInfoId);
						// 存sessionStorage
						window.sessionStorage.setItem("appId", res.data[0].appInfoId);
						this.menuList = res.data[0].views;

						//如果没有存储菜单信息，则激活第一个菜单。如果有存储，则使用存储的菜单信息
						if (!sessionStorage.getItem("menuActiveView")) {
							//默认激活第一个菜单
							this.activeMenu = this.reflectMenuVal[this.menuList[0]]["index"];
							this.currentView = this.reflectMenuVal[this.menuList[0]]["view"];
						} else {
							this.activeMenu = sessionStorage.getItem("menuActiveIndex");
							this.currentView = sessionStorage.getItem("menuActiveView");
						}
						//sessionStorage.setItem("menuActiveView",this.reflectMenuVal[this.menuList[0]]["view"])
						//sessionStorage.setItem("menuActiveIndex",this.reflectMenuVal[this.menuList[0]]["index"])

					} else {
						loading.close();
						if (res.errorCode == '4001') {
							//  当前用户没有权限 跳到拦截页面
							this.$router.push({
								name: '404'
							})
						}
					}
				} catch (e) {
					console.log(e);
				}
			},
			//判断是否有当前菜单的权限
			isHave(str) {
				return this.menuList.includes(str);
			},
			showDrawerAction(data) {
				//0=活动  1=评论  2==新闻 3=评论  4=社区
				if (data.type == 2) {
					this.detailType = "news";
				} else if (data.type == 4) {
					this.detailType = "community";
				} else if (data.type == 5) {
					this.detailType = "report";
				} else if (data.drawType == "dynamicType") {
					// 动态详情，需要调接口查询
					this.asyncRequest = true;
					this.asyncDetailData = data;
					if (this.showDrawer) {
						this.openDrawerFunc();
					} else {
						this.showDrawer = true;
					}
					return;
				}
				this.asyncRequest = false;

				this.drawerloading = true;
				if (data.type == 5) {
					this.newsDetail = data;
				} else {
					this.newsDetail = data.paentData;
				}
				this.showDrawer = true;
				this.drawerloading = false;
			},
			async openDrawerFunc() {
				if (!this.asyncRequest) {
					return;
				}
				//清空内容
				this.newsDetail = {
					content:'',
					user:{
						imgurl:'',
						personName:'',
						updateTime:''
					},
					blog_info_images:"[]",
					videosSource:''
				};
				this.drawerloading = true;
				try {
					const res = await this.api.queryBlogInfo({
						auto_id: this.asyncDetailData.auto_id
					});
					this.drawerloading = false;
					//帖子类型，video视频，image图片，text文本   修改以后--1视频，2文本，3图片
					if (res.success) {
						if (res.data && res.data.length > 0) {
							this.newsDetail = res.data[0];
							if (res.data[0].categoty == 1) {
								this.detailType = "communityVideo";
								if (res.data[0].blog_info_videos) {
									let usedVi = JSON.parse(JSON.parse(res.data[0].blog_info_videos));
									this.newsDetail.videosSource = usedVi[0];
									this.newsDetail.videos_pre_image = usedVi[1];
								} else {
									this.newsDetail.videosSource = " ";
									this.newsDetail.videos_pre_image = " ";
								}
							} else {
								this.detailType = "community";
							}
						}

						//this.newsDetail.videos_pre_image = "../../assets/img/home/22.jpg"
					} else {
						this.newsDetail = {};
					}
				} catch (e) {
					console.log(e);
				}
			},
			quit() {
				this.$confirm("真的要退出吗?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.$router.push("/login");
						this.$message({
							type: "success",
							message: "退出成功!"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消退出"
						});
					});
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			reload() {
				this.isRouterAlive = false;
				this.$nextTick(function() {
					this.isRouterAlive = true;
				});
			}
		}
	};
</script>
<style lang="less">
	* {
		padding: 0;
		margin: 0;
	}

	.component-fade-enter-active, .component-fade-leave-active {
		transition: opacity .3s ease;
	}
	.component-fade-enter, .component-fade-leave-to
		/* .component-fade-leave-active for below version 2.1.8 */ {
		opacity: 0;
	}

	.home-header {
		background: rgba(255, 255, 255, 0.8) url("../assets/img/home/banner.png") no-repeat;
		background-size: cover;
		padding: 0;

		.el-col-24 {
			width: 45%;
		}

		.logo {
			margin: 12px 0 12px 30px;
			float: left;
		}

		.shenhe {
			font-size: 24px;
			font-family: MicrosoftYaHei-Bold;
			font-weight: bold;
			color: rgba(26, 26, 26, 1);
			float: left;
			margin-top: 16px;
		}

		.adminName {
			font-size: 18px;
			font-family: MicrosoftYaHei;
			font-weight: 400;
			color: rgba(202, 162, 103, 1);
			margin-left: 17px;
			margin-right: 57px;
		}

		.adminInfo {
			float: right;
			text-align: right;
			padding-right: 20px;
			line-height: 60px;

			.el-dropdown-link {
				span {
					color: #fff;
				}

				img {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					vertical-align: middle;
				}
			}
		}
	}

	/*滚动条整体样式*/
	.home .el-aside::-webkit-scrollbar {
		width: 3px;
		height: 1px;
	}

	/*滚动条滑块*/
	.home .el-aside::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #535353;
	}

	/*滚动条轨道*/
	.home .el-aside::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
		border-radius: 10px;
		background: #ccc;
	}

	.home .el-aside {
		width: 86px !important;
		background: rgba(201, 57, 49, 1);
		max-height: calc(100vh - 60px);
		overflow: auto;
		overflow-x: hidden;

		.el-menu {
			background: rgba(201, 57, 49, 1);
			border-right: 0;

			.el-menu-item {
				width: 86px;
				height: 80px;
				padding: 0 !important;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				img {
					width: 24px;
					margin-top: 5px;
				}

				span {
					color: rgba(255, 255, 255, 1);
					line-height: 35px;
				}
			}
		}

		.el-menu-item.is-active,
		.el-menu-item:hover {
			background: rgba(115, 43, 46, 1);
		}
	}

	.home-main {
		background: #f0f0f0;
	}

	.el-table th,
	.el-table td {
		text-align: center;
	}

	.el-drawer {
		height: 100%;
	}

	.el-drawer__container {
		position: fixed;
		height: 93.6%;
		top: 60px;
	}

	.el-drawer__header {
		margin: 0;
	}

	.el-drawer__body {
		height: calc(100% - 50px);
	}
</style>
