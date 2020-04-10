/**
 * api接口统一管理
 */
import {
	get,
	post,
	cancel,
	postRequest,
	getHongqi
} from "./http";
let touseUrl;
if (process.env.NODE_ENV == "development") {
	touseUrl = "http://192.168.16.14:9201/";
} else if (process.env.NODE_ENV == "production") {
	touseUrl = process.env.VUE_APP_BASE_SERVER;
} else {
	touseUrl = "http://192.168.16.14:9201/";
}

//v是请求接口时携带的参数对象
let apiObj = {
	getUrl() {
		return touseUrl;
	},
  getHongqiUploadUrl(){
    return "http://hongqi.wengegroup.com:9001/activities/fileUpload";
	},
	getUserList: v => get("user/auth", v), //获取权限列表
	// apiAddress: v => post("/api/test", v),
	// apiPosition: v => get("/api/info", v),
	// apiDelete: v => cancel("/api/delete", v)
	//http://{county}.wengetech.com:8081/cas/login?service=127.0.0.1:9201/login/ssoapplogin
	ssoLogin(url, params) {
		return getHongqi(url, params);
	},
	getCountyAPi: v => get("/user/county", v),
	getComments: v => post("comment/getCommentsByParam", v), //根据条件查询所有的评论（分页）
	auditComment: v => post("/comment/updateById", v), //审核某一个评论
	auditCommentList: v => post("comment/updateByList", v), //批量审核评论
	banned: v => post("/manageUser/updateById", v), //修改禁言状态
	queryUser: v => post("/manageUser/selectByParam", v), //根据昵称或手机号查询用户
	// 只查询用户Id，评论审核、动态审核筛选使用
	queryUserAutoId: v => post("manageUser/selectAutoId", v),

	getBlogs: v => post("/blog/getBlogInfoByParam", v), //查询全部动态和条件查询
	getTheme: v => post("theme/selectTheme", v), //查询全部圈子
	insertTheme: v => post("theme/insertTheme", v), //新建一个圈子
	deleteTheme: v => post("theme/deleteById", v), //删除一个圈子
	updateTheme: v => post("theme/updateById", v), //修改一个圈子
	updateStatusTheme: v => post("theme/updateByStatus", v), //修改圈子状态
	updateSortTheme: v => post("theme/updateBySort", v), //修改圈子顺序
	getThemeById: v => post("theme/selectById", v), //根据id查询圈子
	getDynamicCheckDetail: v => post("/blog/getBlogInfoById", v), //动态审核,根据id查看详情
	getDynamicCheckdata: v => post("/blog/getBlogInfoByParam", v), // 动态审核列表
	updateStatusExceptBanned: v => post("/blog/updateBlogInfoById", v), // 动态审核--修改除禁言以外的状态
	updateBanned: v => post("/manageUser/updateById", v), // 动态审核--修改禁言状态
	querySelectTheme: v => post("/theme/selectTheme", v), // 动态审核--查询圈子下拉列表
	querySelectTopic: v => post("/topic/selectTopic", v), // 动态审核--查询话题下拉列表
	queryBlogInfo: v => post("/blog/getBlogInfoById", v), // 动态审核--查询动态审核详情
	getTopic: v => post("topic/selectTopic", v), //查询全部话题
	auditTopic: v => post("topic/updateByStatus", v), //禁止或开放话题
	updateTopicSort: v => post("topic/updateBySort", v), //更新话题顺序
	deleteTopic: v => post("topic/deleteById", v), //删除话题
	addTopic: v => post("topic/insertTopic", v), //新建话题
	getTopicById: v => post("topic/selectById", v), //根据id查询话题
	updateTopic: v => post("topic/updateById", v), //修改话题

	queryActivities: v => post("activities/selectByParam", v), //根据条件查询活动信息-可分页查询
	addActivities: v => post("activities/addActivities", v), //添加活动
	updateActivities: v => post("activities/updateById", v), //修改活动
	deleteActivities: v => post("activities/deleteById", v), //删除活动
	queryActivitiesById: v => post("activities/searchWithId", v), //根据id查询指定的活动信息

	getDepartmentStatistic: v => post("statistic/getDepartmentStatistic", v), //统计部门下发稿件量数量
	getUserStatistic: v => post("statistic/getUserStatistic", v), //统计用户下发稿件量数量
	exportDepartmentExcel: v => post("export/exportDepartmentExcel", v), //导出部门下发稿件量
	exportUserExcel: v => post("export/exportUserExcel", v), //导出用户下发稿件量
	// 统计记者云稿库稿件接口
	queryReporterCloudManucript:v => post("statistic/getReporterManuscripts", v),
	//查询部门列表
	getDeptList: v => post("statistic/getDepartmentList", v),
	//查询举报接口
	queryReport: v => post("report/selectReport", v),
	// 查询举报类别
	queryReportType: v => post("report/selectFirstType", v),

	/*----订阅号start----*/
	getSubscriptionList: v => post("subscribeNum/selectByParam", v),
	// 订阅号类型
	getSubscriptionType: v => post("subscribeNum/selectSubscribeTypeByParam", v),
	// 订阅号组织名称
	getSubscriptionGroup: v => post("caibian/getSubscribeGroup", v),
	// 审核订阅号
	checkSubscription: v => post("subscribeNum/updateSubscribeNum", v),
	// 查询订阅号详情
	querySubscriptionDeatil: v => post("subscribeNum/selectById", v),
	//删除订阅号
	deleteSubscription: v => post("subscribeNum/deleteById", v),
	//查询入驻类型
	getEnterType: v => post("subscribeNum/selectEnterType", v),
	//-------查询订阅号操作日志
	queryOperationLog_subscription: v => post("subscribeNum/selectSubscribeOperateLog", v),
	//查询历史删除日志
	queryHistoryDeleteLog_subscription: v => post("subscribeNum/selectSubscribeDeleteLog", v),
	//恢复删除
	undelete_subscription: v => post("subscribeNum/restoreStatus", v),
	/*----订阅号end----*/

	/* ----------积分start--------------- */
	//获取用户id（userIds）通过昵称和手机号
	queryUserIds_integral: v => post("manageUser/selectAutoIdByMobileAndName", v),
	//获取用户积分数据
	queryIntegralData: v => post("userExp/getUserExpByParam", v),
	//增加积分
	addIntegral: v => post("userExp/addUserExp", v),
	//减少积分
	reduceIntegral: v => post("userExp/reduceUserExp", v),
	// 查询用户近总积分积分趋势接口
	queryIntegralTrend: v => post("userExp/getUserExpInThePastWeek", v),
	// 查询某天积分详情
	queryIntegralDetail: v => post("userExp/getUserExpDetail", v),
	/* ----------积分end--------------- */

	/*----广告start----*/
	selectAdvertByParam: v => post("advert/selectAdvertByParam", v), // 广告列表
	insertAdvert: v => post("advert/insertAdvert", v), // 新增广告
	updateAdvertById: v => post("advert/updateAdvertById", v), // 修改广告
	updateAdvertByPubState: v => post("advert/updateAdvertByPubState", v), // 修改广告开放状态
	updateAdvertByStatus: v => post("advert/updateAdvertByStatus", v), // 删除广告
	selectAdsense: v => post("advert/selectAdsense", v), // 广告位列表
	//-----------日志
	//查询单个广告操作行为
	querySingelAdOperation: v => post("advert/selectAdvertOperate", v),
	//查询历史删除日志
	queryHistoryDeleteLog: v => post("advert/selectAdvertDelete", v),
	//恢复删除
	undeleteAd: v => post("advert/recoveryDelete", v),
	/*----广告end----*/

	/*----稿件start----*/
	getNewsChannelData: v => post("statistic/getNewsChannelData", v), // 稿件统计列表
	updateNumber: v => post("statistic/updateNumber", v), // 修改阅读量，点赞量，分享量，加权值接口
	getNewsColumn: v => post("statistic/getNewsColumn", v), // 获取栏目接口
	//查询单个稿件操作日志
	querySingleManuscriptLog: v => post("statistic/getLogList", v),
	/*----稿件end----*/

	/* -------投诉start------- */
	selectInfoByParam: v => post("complaint/selectInfoByParam", v), //企业投诉列表查询
	addReplyByComplaintsId: v => post("complaint/addReplyByComplaintsId", v), //企业投诉回复
	//删除企业投诉
	deleteComplaints: v => post("complaint/deleteComplaints", v),
	//更新企业投诉状态
	updateComplaints: v => post("complaint/updateComplaints", v),
	/* ---------投诉end-------------- */

	/* --------圈子日志start---------- */
  //查询历史删除日志
  queryHistoryDeleteLog_circle: v => post("theme/getThemeDelLog", v),
  queryOperationLog_circle: v => post("theme/getThemeOperate", v),
  //恢复删除
  undelete_circle: v => post("theme/restoreTheme", v),
  /* --------圈子日志end---------- */

  /* --------话题日志start---------- */
  //查询历史删除日志
  queryHistoryDeleteLog_topic: v => post("topic/getTopicDelLog", v),
  queryOperationLog_topic: v => post("topic/getTopicOperate", v),
  //恢复删除
  undelete_topic: v => post("topic/restoreStatus", v),
  /* --------话题日志end---------- */

	/*------------------用户日志start----------------*/
	//查询用户历史删除日志
  queryHistoryDeleteLog_user: v => post("manageUser/getUserDelLog", v),
  queryOperationLog_user: v => post("manageUser/getUserOperate", v),
  //恢复删除
  undelete_user: v => post("manageUser/userRestore", v),
  /*---------------用户日志end------------------*/


	crossPost(url, params) {
		return postRequest(url, params);
	}
};
export default apiObj;
