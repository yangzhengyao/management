<template>
    <el-dialog
            :visible.sync="previewImgDialog"
            :top="previewTopcss"
            custom-class="forScrollBar"
            title="预览"
            @open="openPreviewFunc"
            append-to-body>
        <div style="height: 700px">
            <el-scrollbar>
                <template v-if="belong=='video'">
                    <video width="100%" style="min-height: 240px;height: 690px" :src="dialogImageUrl" controls>
                        您的浏览器不支持 video 标签。
                    </video>
                </template>
                <template v-else>
                    <div style="height: 690px;text-align: center">
                        <img height="100%" :src="dialogImageUrl" alt="">
                    </div>
                </template>
            </el-scrollbar>
        </div>
    </el-dialog>
</template>

<script>
  export default {
    name: "previewModal",
    data(){
      return{
        //预览弹框打开标记
        previewImgDialog:false,
        // 视频或者图片的路径
        dialogImageUrl:'',
        previewTopcss:'6vh',
      }
    },
    props:['showDialog','belong','previewRow'],
    methods:{
      openPreviewFunc(){
          this.dialogImageUrl = this.previewRow;
      }
    },
    mounted(){

    },
    watch: {
      //父子组件双向绑定标记
      showDialog(val) {
        this.previewImgDialog = val; //新增result的watch，监听变更并同步到myResult上
      },
      previewImgDialog(val) {
        this.$emit('childEvent', {
          showDialog: val
        });

      }
    },
  };
</script>

<style scoped>

</style>
