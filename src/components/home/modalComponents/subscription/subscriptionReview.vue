<template>
    <!-- 审核弹窗  :append-to-body="true"-->
    <el-dialog
            :title="dialogTitle"
            custom-class="commonHeader subscriptionViewCls"
            :visible.sync="current_openDrawerMark"
            :top="topcss"
            @open="openFunc"
            @opened="openedFunc"
			@close="closeModal"
            width="60%">

        <preview-modal :showDialog="showDialog" :previewRow="previewRow" :belong="belong" @childEvent="previewModalMethod"></preview-modal>

        <div v-loading="loading" style="height: 670px;">
            <el-scrollbar>
            <el-row style="border-bottom: 1px solid #D9D9D9">
                <el-col :span="12">
                    <div style="padding-right: 20px;">
                        <div class="innerTitleCls">基本信息</div>
                        <div class="basicCls">
							<!-- 只有东坡区（appId == 20）的订阅号可以修改 -->
                            <el-form :model="basicInfoForm" ref="basicInfoForm" :rules="basicInfoRules" label-width="180px">
								<el-form-item label="订阅号图标：" prop="img" v-if="appId == 20">
									<div class="demo-upload-list subscribeUploadListCls" v-for="(item, index) in basicInfoForm.img" :key="index">
										<template v-if="item.status === 'success'">
											<img :src="item.url">

											<div class="demo-upload-list-cover">
												<i class="el-icon-delete" style="" @click="handleRemove(item)"></i>
											</div>
										</template>
										<template v-else>
											<el-progress style="line-height: 64px;" :text-inside="true" :stroke-width="24" :percentage="item.percentage" status="success"></el-progress>
										</template>
									</div>
									<el-upload
										v-if="subscribeIconMark"
										class="subscribeIcon"
										name="file"
										:action="commonUploadUrl"
										:show-file-list="false"
										:on-success="handleAvatarSuccess"
										:on-change="handleChange"
										:before-upload="beforeAvatarUpload"
										:on-exceed="handleExceed"
										:limit="1"
										:file-list="basicInfoForm.img"
										style="">
										<i class="el-icon-plus addIcon"></i>
									</el-upload>
								</el-form-item>

                                <el-form-item label="订阅号图标：" v-show="appId != 20">
                                    <img class="mgImgCls" v-for="(inItem,index) in basicInfoForm.img" :key="index" :src="inItem.url"
                                         alt="" width="64" height="64"/>
                                </el-form-item>
                                <el-form-item label="订阅号名称：" prop="name">
                                    <el-input v-model="basicInfoForm.name" autocomplete="off" style=""
                                              placeholder="名称" :readonly="appId != 20"></el-input>
                                </el-form-item>
                                <el-form-item label="地理位置：" prop="location">
                                    <el-input v-model="basicInfoForm.location" autocomplete="off" style=""
                                              placeholder="地理位置" :readonly="appId != 20"></el-input>
                                </el-form-item>
								<el-form-item label="入驻类型：" prop="type">
								    <!-- <el-input v-model="basicInfoForm.type" autocomplete="off" style=""
								              placeholder="分类"></el-input> -->
									<el-select v-model="basicInfoForm.type" placeholder="入驻类型" :disabled="appId != 20">
									    <el-option v-for="item in sortOpt" :key="item.value" :label="item.label"
									               :value="item.value">
									    </el-option>
									</el-select>
								</el-form-item>
                                <el-form-item label="简介："prop="desc">
                                    <el-input
                                            type="textarea"
                                            resize="none"
											:readonly="appId != 20"
                                            placeholder="简介"
                                            v-model="basicInfoForm.desc"
                                            :autosize="{minRows:4,maxRows:4}"
                                    ></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12" style="border-left: 1px solid #D9D9D9">
                    <div style="padding-left: 20px;">
                        <div class="innerTitleCls">运营者信息</div>
                        <div class="operatorCls">
                            <el-form :model="operatorInfoForm" ref="operatorInfoForm" :rules="operatorRules" label-width="200px">
                                <el-form-item label="联系人姓名：" prop="contactName">
                                    <el-input v-model="operatorInfoForm.contactName" autocomplete="off" style=""
                                              placeholder="" :readonly="appId != 20"></el-input>
                                </el-form-item>
                                <el-form-item label="手机：" prop="tel">
                                    <el-input v-model="operatorInfoForm.tel" autocomplete="off" style=""
                                              placeholder="" :readonly="appId != 20"></el-input>
                                </el-form-item>
                                <!--<el-form-item label="邮箱：">
                                    <el-input v-model="operatorInfoForm.email" autocomplete="off" readonly style=""
                                              placeholder=""></el-input>
                                </el-form-item>-->
                                <el-form-item label="联系人身份证或机构代码：" prop="contactIdCard">
                                    <el-input v-model="operatorInfoForm.contactIdCard" autocomplete="off" style=""
                                              placeholder="" :readonly="appId != 20"></el-input>
                                </el-form-item>
								<el-form-item label="资质证明：" prop="qualificationCertificate" v-show="appId == 20">
									<div class="demo-upload-list certificateListClsListCls" v-for="(item, index) in operatorInfoForm.qualificationCertificate" :key="index">
										<template v-if="item.status === 'success'">
											<img :src="item.url">
											<div class="demo-upload-list-cover">
												<i class="el-icon-zoom-in" style="font-size: 20px;" @click="openpreviewModal(item,'img')"></i>
												<i class="el-icon-delete" style="" @click="handleCertificateRemove(item)"></i>
											</div>
										</template>
										<template v-else>
											<el-progress style="line-height: 64px;" :text-inside="true" :stroke-width="24" :percentage="item.percentage" status="success"></el-progress>
										</template>
									</div>
									<el-upload
										v-if="certificateIconMark"
										class="certificateIcon"
										name="file"
										:action="commonUploadUrl"
										:show-file-list="false"
										:on-success="handleCertificateSuccess"
										:on-change="handleCertificateChange"
										:before-upload="beforeAvatarUpload"
										:on-exceed="handleExceed"
										:limit="1"
										:file-list="operatorInfoForm.qualificationCertificate"
										style="">
										<i class="el-icon-plus addIcon"></i>
									</el-upload>
								</el-form-item>
                                <el-form-item label="资质证明：" v-show="appId != 20">
                                    <div class="certificateCls" v-for="(inItem,index) in operatorInfoForm.qualificationCertificate" :key="index">
                                        <div class="certificateHover">
                                            <i class="el-icon-zoom-in" style="font-size: 20px;" @click="openpreviewModal(inItem,'img')"></i>
                                        </div>
                                        <img class=""  :src="inItem.url" alt="资质证明" />
                                    </div>
                                </el-form-item>

                                <el-form-item label="备注：" prop="remarks">
                                    <el-input
                                            type="textarea"
                                            placeholder="备注"
                                            resize="none"
											:readonly="appId != 20"
                                            v-model="operatorInfoForm.remarks"
                                            :autosize="{ minRows: 3,maxRows: 4}"
                                    ></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <el-row style="padding: 15px 0" class="passBtnCls">
                <el-button :style="showPassMark?activeStyle:defaultStyle" @click.native="showPassMark=!showPassMark">通过</el-button>
                <el-button :style="!showPassMark?activeStyle:defaultStyle" @click.native="showPassMark=!showPassMark">拒绝</el-button>
            </el-row>
            <el-row>
                <el-form :model="subForm" :rules="subRules" ref="subForm" label-width="80px">
                    <el-row v-if="showPassMark" style="height: 70px">
                        <el-col :span="12">
                            <el-form-item label="订阅类型" prop="subTypeVal">
                                <el-select v-model="subForm.subTypeVal" placeholder="请选择订阅号类型"
                                           style="">
                                    <el-option v-for="item in subscriptionTypeOpt" :key="item.value" :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机" prop="telephonenumber">
                                <el-input
                                        placeholder="请输入手机号"
                                        v-model="subForm.telephonenumber"
                                        style="width: 180px"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="组织名称" prop="subgroupVal">
                                <el-select v-model="subForm.subgroupVal" placeholder="请选择组织名称"
                                           style="">
                                    <el-option v-for="item in subscriptionGroup" :key="item.value" :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                    <el-row v-else style="height: 70px">
                        <el-form-item label="拒绝理由">
                            <el-input
                                    type="textarea"
                                    placeholder=""
                                    v-model="subForm.refuesResonVal"
                                    :autosize="{ minRows: 2,maxRows: 4}"
                            ></el-input>
                        </el-form-item>
                    </el-row>


                    <el-form-item class="dialog-footer" style="padding-top: 15px;text-align: right;margin-bottom: 0">
                        <el-button class="cancelCls" @click="resetForm('subForm')" style="">取 消</el-button>
                        <el-button class="subformCls" type="primary" :loading="btnLoading" @click="submitForm('subForm')">确 定</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-scrollbar>
        </div>

    </el-dialog>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
  import previewModal from '@/components/home/modalComponents/previewModal';

  export default {
    name: "subscriptionReview",
    data(){
      //手机号码校验
      const validateTel = (rule, value, callback) => {
        let reg = /^(?:13\d|15\d|18\d|17\d|19\d|14\d|16\d)\d{5}(\d{3})$/g;
        if (value === '' || value == null) {
          callback(new Error('请输入手机号码！'));
        } else {
          if ( !reg.test(value) ) {
            callback(new Error('手机号码格式不正确！'));
          }
          callback();
        }
      };
      return{
        current_openDrawerMark:false,
        clickmark:'cancel',
        dialogTitle: "审核",
        topcss:'5vh',
        loading:false,
        btnLoading:false,
        activeStyle:{
          "background":"#C93931",
          "color":"#FFFFFF"
        },
        defaultStyle:{
          "background":"#F5F5F5",
          "color":"#666666"
        },
        //预览弹框打开标记  props属性绑定到子组件
        showDialog:false,
        // 预览弹框行数据 props属性绑定
        previewRow:'',
        // 预览弹框类型
        belong:'',
		// 入驻类型
		sortOpt:[],
		//订阅号图标显示标记
		subscribeIconMark:false,
		//资质证明显示标记
		certificateIconMark:false,
        basicInfoForm:{
          img:[],
          name:'',
          location:'',
          desc:'',
		  type:''
        },
        operatorInfoForm:{
          contactName:'',
          tel:'',
          email:'',
          contactIdCard:'',
          qualificationCertificate:[],
          remarks:''
        },
        subForm:{
          subTypeVal:'',
          subgroupVal:'',
          refuesResonVal:'',
          telephonenumber:''
        },
        subscriptionTypeOpt:[],
        subscriptionGroup:[],
        // 通过按钮激活标识
        showPassMark:true,
        subRules:{
          subTypeVal:[{
            required: true,
            message: "请选择",
            trigger: "change"
          }],
          /* subgroupVal:[{
            required: true,
            message: "请选择",
            trigger: "change"
          }], */
          telephonenumber:[{
            required: true,
            validator: validateTel,
            trigger: "change"
          }]
        },
		// 基本信息校验
		basicInfoRules:{
			name: [{
			  required: true,
			  message: "请输入订阅号名称",
			  trigger: "change"
			}],
			location: [{
			  required: true,
			  message: "请输入地理位置",
			  trigger: "change"
			}],
			desc: [{
			  required: true,
			  message: "请输入简介",
			  trigger: "change"
			}],
			img: [{
			  required: true,
			  message: "请上传图标",
			  trigger:"change"
			}],
			type: [{
			  type: "string",
			  required: true,
			  message: "请选择",
			  trigger: "change"
			}],
		},
		// 运营者信息校验
		operatorRules:{
			contactName: [{
			  required: true,
			  message: "请输入联系人姓名",
			  trigger: "change"
			}],
			tel: [{
			  required: true,
			  message: "请输入手机",
			  trigger: "change"
			}],
			contactIdCard: [{
			  required: true,
			  message: "请输入",
			  trigger: "change"
			}],
			qualificationCertificate: [{
			  required: true,
			  message: "请上传资质证明",
			  trigger:"blur"
			}],
			remarks: [{
			  type: "string",
			  required: false,
			  message: "请输入备注",
			  trigger: "change"
			}],
		},
        //上传地址--红旗共用
        commonUploadUrl:this.api.getHongqiUploadUrl(),
      }
    },
    props: ['openDrawerMark', 'fromMark','rowData'],
    components:{
      previewModal
    },
	computed: {
		...mapGetters([
			'appId',
		])
	},
    methods: {
		/* ----上传订阅号start------- */
		handleAvatarSuccess(res, file, fileList) {
			//this.imageurl = URL.createObjectURL(file.raw);
			if(res.success){
				file.url = res.data[0];
			}
			this.basicInfoForm.img = fileList;
		},
		beforeAvatarUpload(file) {
			let imgStr_reg = /\.(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG|GIF|gif)$/;
			//截取格式后缀
			let formatIndex = file.name.lastIndexOf(".");
			let waitingForVertification = file.name.slice(formatIndex);
			const check = imgStr_reg.test(waitingForVertification);
			if (!check) {
				this.$message.error('上传图标只能是 JPG、PNG 等图片格式!');
			}
			return check;

		},
		handleExceed(file,filelist){
			//本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件
			this.$message.warning(`上传图标限制选择 1 个文件，请删除后再上传`);
		},
		handleRemove(file) {
			const fileList = this.basicInfoForm.img;
			this.basicInfoForm.img.splice(fileList.indexOf(file), 1);
		},
		handleChange(file, fileList) {
			this.basicInfoForm.img = fileList;
		},
		/* -----上传订阅号end -----------*/
		/* ---------上传资质证明 --------*/
		handleCertificateSuccess(res, file, fileList) {
			if(res.success){
				file.url = res.data[0];
			}
			this.operatorInfoForm.qualificationCertificate = fileList;
		},
		handleCertificateRemove(file) {
			const fileList = this.operatorInfoForm.qualificationCertificate;
			this.operatorInfoForm.qualificationCertificate.splice(fileList.indexOf(file), 1);
		},
		handleCertificateChange(file, fileList) {
			this.operatorInfoForm.qualificationCertificate = fileList;
		},
		/* ----------上传资质证明end ----------*/
      // 预览资质证明
      openpreviewModal(file,type){
        this.belong = type;
        this.previewRow = file.url;
        this.showDialog = true;
      },
      previewModalMethod(param){
        this.showDialog = param.showDialog;
        //仅在点击确定关闭弹框关闭时
        /*if( param.clickmark == "confirm" ){
          //刷新列表
          this.querySubscriptionList();
        }*/
      },
      // 通过、拒绝按钮点击
      selectType(status){

      },
      // 打开弹框
      openFunc(){
        this.subForm.subTypeVal = '';
        this.subForm.subgroupVal = '';
        this.subForm.refuesResonVal = '';
		this.queryEntertype();
        //this.querySubscriptionType();
        //this.querySubscriptionGroup();
        //this.querydetail();
      },
      openedFunc(){

      },
	  //关闭弹框
	  closeModal(){
		  /* if (this.$refs["subForm"] !== undefined) {
		    this.$refs["subForm"].resetFields();
		  }
		  if (this.$refs["basicInfoForm"] !== undefined) {
		    this.$refs["basicInfoForm"].resetFields();
		  }
		  if (this.$refs["operatorInfoForm"] !== undefined) {
		    this.$refs["operatorInfoForm"].resetFields();
		  } */
	  },
	  validateBasicAndOperat(){
		  //触发基本信息  运营者信息
		  this.$refs.basicInfoForm.validate((valid) => {
		    //console.log(valid)
		  })
		  this.$refs.operatorInfoForm.validate((valid) => {
		    //console.log(valid)
		  })
	  },
	  //查询入驻类型
	  async queryEntertype(par) {
		this.loading = true;
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

	        this.sortOpt = arr;
	      } else {
	        this.sortOpt = [];
	      }

			this.querySubscriptionType();

	    } catch (e) {
			this.loading = false;
	      console.log(e);
	    }
	  },
	  // 查询订阅号类型
	  async querySubscriptionType(par) {
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

	        this.subscriptionTypeOpt = arr;
	      } else {
	        this.subscriptionTypeOpt = [];
	      }

	  		  this.querydetail();

	    } catch (e) {
			this.loading = false;
	      console.log(e);
	    }
	  },
      // 查询订阅号详情
      async querydetail(){
        //this.loading = true;
        try {
          let params = {
            id:this.rowData.id
          };
          const res = await this.api.querySubscriptionDeatil(params);

          if(res.success){
            this.loading = false;
			//订阅号图标  资质证明
            /* res.data.forEach(function(item, index) {
              item.subscribeImage = item.subscribeImage.split(",");
              item.certificationImages = item.certificationImages.split(",");
            }); */
            let dataS = res.data[0];

            this.basicInfoForm.img = dataS.subscribeImage?[{
					name:'',
					url:dataS.subscribeImage,
					status:'success'
				}]:[];
            this.basicInfoForm.name = dataS.subscribeName;
			//+dataS.city+dataS.county
            this.basicInfoForm.location = dataS.province;
            this.basicInfoForm.desc = dataS.description;
			//enterTypeName
			this.basicInfoForm.type = dataS.enterTypeId;

			/* 注:对象赋值对于触发校验会有问题 */
			this.operatorInfoForm.contactName = dataS.contactName;
			this.operatorInfoForm.tel = dataS.phone;
			this.operatorInfoForm.contactIdCard = dataS.certificationCode;
			this.operatorInfoForm.qualificationCertificate = dataS.certificationImages?[{
					name:'',
					url:dataS.certificationImages,
					status:'success'
				}]:[];
			this.operatorInfoForm.remarks = dataS.remark;

            /* this.operatorInfoForm = {
              contactName:dataS.contactName,
              tel:dataS.phone,
              email:dataS.email,
              contactIdCard:dataS.certificationCode,
              qualificationCertificate:dataS.certificationImages?[{
					name:'',
					url:dataS.certificationImages,
					status:'success'
				}]:[],
              remarks:dataS.remark
            }; */

			//订阅号图标
			if(this.basicInfoForm.img.length>0){
				this.subscribeIconMark = false;
			}else{
				this.subscribeIconMark = true;
			}

			//资质证明
			if(this.operatorInfoForm.qualificationCertificate.length>0){
				this.certificateIconMark = false;
			}else{
				this.certificateIconMark = true;
			}

            //赋值  0=审核中；1=审核拒绝；2=审核通过
            this.showPassMark = dataS.checkType==1?false:true;
            if(this.showPassMark){
              this.subForm.subTypeVal = dataS.subTypeId;
              //this.subForm.subgroupVal = dataS.groupId;
              this.subForm.telephonenumber = dataS.phone?dataS.phone:'';
            }else{
              this.subForm.refuesResonVal  =dataS.refuesReson;
            }

			//触发校验
			this.validateBasicAndOperat();
			//触发审核信息校验
			this.$refs.subForm.validate((valid) => {
			  //console.log(valid)
			})
          }else{
            this.loading = false;
            this.$message({
              type: "error",
              message: res.message
            });
          }
        }catch (e) {
          console.log(e);
        }
      },
      // 查询组织名称
      async querySubscriptionGroup(par) {
        try {
          const res = await this.api.getSubscriptionGroup();
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

            this.subscriptionGroup = arr;
          } else {
            this.subscriptionGroup = [];
          }

        } catch (e) {
          console.log(e);
        }
      },
      // 提交审核
      async checkSubscription(par) {
        this.btnLoading = true;
        try {
          const res = await this.api.checkSubscription(par);
          this.btnLoading = false;
          if (res.success == true) {
            this.clickmark = "confirm";
            this.$message({
              type: "success",
              message: res.message
            });
            this.current_openDrawerMark = false;
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
            return;
          }
        } catch (e) {
          this.btnLoading = false;
          console.log(e);
        }
      },
      // 点击取消关闭弹窗，清空表单
      resetForm(formName) {
        this.clickmark = "cancel";
        this.current_openDrawerMark = false;
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      // 审核订阅号  提交表单，并验证
      submitForm(formName) {
		// 触发基本信息和运营者信息的校验
		this.$refs.basicInfoForm.validate((valid) => {
		  if(valid){
			this.$refs.operatorInfoForm.validate((valid) => {
			  if(valid){
				  this.$refs[formName].validate((valid) => {
				    if (valid) {
				      let params = {
				        id: this.rowData.id,
				        // 0=审核中；1=审核拒绝；2=审核通过
				        checkType: this.showPassMark?'2':'1',
				      };
					  let basic_obj = {
						  subscribeImage:this.basicInfoForm.img[0].url,
						  subscribeName:this.basicInfoForm.name,
						  description:this.basicInfoForm.desc,
						  enterTypeId:this.basicInfoForm.type,
						  province:this.basicInfoForm.location
					  };
					  let operator_obj = {
						  contactName:this.operatorInfoForm.contactName,
						  phone:this.operatorInfoForm.tel,
						  certificationCode:this.operatorInfoForm.contactIdCard,
						  certificationImages:this.operatorInfoForm.qualificationCertificate[0].url,
						  remark:this.operatorInfoForm.remarks
					  }
					  //传参对象
					  let par = {...params,...basic_obj,...operator_obj}

				      if(this.showPassMark){
				        //如果通过 订阅号类型、手机号、采编group必填
				        par.subTypeId = this.subForm.subTypeVal;
				        //params.groupId = this.subForm.subgroupVal;
				        par.caibianPhoneNum = this.subForm.telephonenumber;
				      }else{
				        par.refuesReson = this.subForm.refuesResonVal;
				      }
				      this.checkSubscription(par);
				    } else {
				      console.log("error submit!!");
				      return false;
				    }
				  });
			  }
			})
		  }
		})

      }
    },
    mounted(){

    },
    watch: {
      //父子组件双向绑定标记
      openDrawerMark(val) {
        this.current_openDrawerMark = val; //新增result的watch，监听变更并同步到myResult上
      },
      current_openDrawerMark(val) {
        this.$emit('childEvent', {
          openDrawerMark: val,
          clickmark:this.clickmark
        });
      },
	  //监听订阅号列表
	  'basicInfoForm.img'(val){
	  	if(val.length>0){
	  		this.subscribeIconMark = false;
	  	}else{
	  		this.subscribeIconMark = true;
	  	}
	  },
	  'operatorInfoForm.qualificationCertificate'(val){
	  	if(val.length>0){
	  		this.certificateIconMark = false;
	  	}else{
	  		this.certificateIconMark = true;
	  	}
	  }
    },
  };
</script>

<style scoped lang="less">
    .innerTitleCls{
        padding-bottom: 5px;
        color: #1A1A1A;
        font-weight: bold;
        font-size:14px;
        padding-bottom: 10px;
    }
    .dialog-footer{
        button{
            &.cancelCls{
                background: #B3B3B3;
                color: #FFFFFF;
                width: 70px;
                height: 30px;
                line-height: 30px;
                padding: 0;
            }
            &.subformCls{
                width: 70px;
                height: 30px;
                line-height: 30px;
                padding: 0;
            }
        }
    }
    .mgImgCls{
        margin-right: 5px;
    }
    // .el-form-item{
    //     margin-bottom: 16px;
    // }

    .certificateCls{
        display: inline-block;
        width: 180px;
        height: 122px;
        margin-right: 5px;
        text-align: center;
        line-height: 122px;
        position: relative;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
        .certificateHover{
            display: none;
            width: 180px;
            height: 122px;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, .6);
            i {
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                margin: 0 2px;
            }
        }
    }
    .certificateCls:hover .certificateHover{
        display: block;
    }

	/* 订阅号图标上传控件样式 */
	.subscribeIcon{
		width: 64px;
		display: inline-block;
		height: 64px;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		.addIcon {
			font-size: 16px;
			color: #8c939d;
			width: 64px;
			height: 64px;
			line-height: 64px;
			text-align: center;
		}
		.el-upload {
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		&:hover{
			border-color: #C93931;
		}
	}
	.demo-upload-list.subscribeUploadListCls{
		width: 64px;
		height: 64px;
		line-height: 64px;
		.demo-upload-list-cover i{
			font-size:16px
		}
	}
	.demo-upload-list.certificateListClsListCls{
		width:180px;
		height: 122px;
		line-height: 122px;
		.demo-upload-list-cover i{
			font-size:20px;
			margin: 0 12px;
		}
	}

	/* 资质证明上传控件样式 */
	.certificateIcon{
		width: 180px;
		display: inline-block;
		height: 122px;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		.addIcon {
			font-size: 30px;
			color: #8c939d;
			width: 180px;
			height: 122px;
			line-height: 122px;
			text-align: center;
		}
		.el-upload {
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		&:hover{
			border-color: #C93931;
		}
	}

	/* 遮罩样式 --公用 */
	.demo-upload-list {
		display: inline-block;
		text-align: center;
		border: 1px solid transparent;
		border-radius: 4px;
		background: #fff;
		position: relative;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
		float: left;
	}

	.demo-upload-list img {
		width: 100%;
		height: 100%;
	}

	.demo-upload-list span {
		width: 66px;
		height: 30px;
		display: inline-block;
		text-align: center;
		position: absolute;
		bottom: -26px;
		left: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		line-height: 30px;
		white-space: nowrap;
	}

	.demo-upload-list-cover {
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, .6);
	}

	.demo-upload-list:hover .demo-upload-list-cover {
		display: block;
	}

	.demo-upload-list-cover i {
		color: #fff;
		cursor: pointer;
		margin: 0 2px;
	}

</style>
