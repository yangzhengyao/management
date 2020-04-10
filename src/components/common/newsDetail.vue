<template>
  <div class="wrap">
    <template v-if="type=='news'">
      <el-scrollbar>
        <h1 class="title">{{newsData.title}}</h1>
        <div class="subTitle">
          <!-- <span class="time">{{newsData.publishTime}}</span> -->
          <span class="source">来源：{{newsData.channelName}}</span>
        </div>
        <p class="mainContent">{{newsData.content}}</p>
        <div class="images">
          <!-- <div class="image" v-for="(item,index) in JSON.parse(newsData.blog_info_images)" :key="index">
            <el-image style="width: 378px;" :src="item.images" fit="cover"></el-image>
          </div> -->
        </div>
      </el-scrollbar>
    </template>
    <template v-if="type=='community'">
      <el-scrollbar>
        <div class="info">
          <div class="avatar">
            <img :src="newsData.user.imgurl" alt />
          </div>
          <div class="text">
            <b>{{newsData.user.personName}}</b>
            <span>{{newsData.user.updateTime}}</span>
          </div>
        </div>
        <p class="mainContent">{{newsData.content}} ​​​​</p>
        <div class="images">
          <div class="image" v-for="(item,index) in JSON.parse(newsData.blog_info_images)" :key="index">
            <el-image style="width: 140px; height: 140px" :src="item.images" fit="cover"></el-image>
          </div>
        </div>
      </el-scrollbar>
    </template>
		<template v-if="type=='communityVideo'">
			<el-scrollbar>
				<div class="info">
					<div class="avatar">
						<img :src="newsData.user.imgurl" alt />
					</div>
					<div class="text">
						<b>{{newsData.user.personName}}</b>
						<span>{{newsData.user.updateTime}}</span>
					</div>
				</div>
				<p class="mainContent">{{newsData.content}} ​​​​</p>
				<div class="videoCls" style="margin-top: 30px;">
					<video width="100%" style="min-height: 240px;" :src="newsData.videosSource" :poster="newsData.videos_pre_image" controls>
						您的浏览器不支持 video 标签。
					</video>
				</div>
			</el-scrollbar>
		</template>
		<template v-if="type=='report'">
			<el-scrollbar>
				<div class="info">
					<div class="text" style="margin: 0 auto;">
						<b>{{newsData.reportTitle}}</b>
					</div>
				</div>
				<p class="mainContent">{{newsData.reportContent}}​​​​</p>
<!-- 				<div class="images">
				  <div class="image" v-for="(item,index) in JSON.parse(newsData.blog_info_images)" :key="index">
				    <el-image style="width: 140px; height: 140px" :src="item.images" fit="cover"></el-image>
				  </div>
				</div> -->
			</el-scrollbar>
		</template>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    newsData: Object
  }
};
</script>

<style lang="less" scoped>
.wrap {
  height: 100%;
  padding: 0 20px;
  .title {
    font-size: 20px;
    font-weight: bold;
    color: rgba(26, 26, 26, 1);
    line-height: 46px;
    text-align: center;
  }
  .subTitle {
    width: 274px;
    margin: 25px auto 33px;
    font-size: 14px;
    color: #999;
    display: flex;
    /* justify-content: space-between; */
	justify-content: flex-end;
  }
  .mainContent {
    font-size: 16px;
    color: #1a1a1a;
    line-height: 30px;
    text-indent: 2em;
  }
  .images{
    margin-top:30px;
    display: flex;
    flex-wrap:wrap;
    .image{
      flex: 1;

    }
  }
  .info {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid rgba(217, 217, 217, 1);
      overflow: hidden;
      margin-right: 26px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      b {
        font-size: 20px;
        color: #1a1a1a;
        line-height: 30px;
      }
      span {
        font-size: 14px;
        color: #999;
      }
    }
  }
  /deep/.el-scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      padding: 0 40px;
      overflow-x: hidden;
    }
  }
}
</style>
