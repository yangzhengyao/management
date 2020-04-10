<template>
	<!-- 增加、修改积分弹窗  :append-to-body="true" :top="topcss"-->
	<el-dialog :title="dialogTitle" custom-class="commonHeader" :visible.sync="current_openDrawerMark" @open="openFunc"
	 @opened="openedFunc" width="21%">

		<div v-loading="loading" style="height: 105px;">

			<el-form :model="pointForm" :rules="pointRules" ref="pointForm" label-width="80px">
				<el-form-item label="积分" prop="pointVal">
					<el-input placeholder="请输入积分" v-model="pointForm.pointVal" style="width: 180px"></el-input>
				</el-form-item>
				<el-form-item class="dialog-footer" style="padding-top: 15px;text-align: right;margin-bottom: 0">
					<el-button class="cancelCls" @click="resetForm('pointForm')" style="">取 消</el-button>
					<el-button class="pointformCls" type="primary" :loading="btnLoading" @click="submitForm('pointForm')">确 定</el-button>
				</el-form-item>
			</el-form>

		</div>

	</el-dialog>
</template>

<script>
	export default {
		name: "addIntegral",
		data() {
			//手机号码校验
			const validatePoint = (rule, value, callback) => {
				let reg = /^[1-9]\d*$/g;
				if (value === '' || value == null) {
					callback(new Error('请输入积分'));
				} else {
					if (!reg.test(value)) {
						callback(new Error('请输入正整数！'));
					}
					callback();
				}
			};
			return {
				current_openDrawerMark: this.openDrawerMark,
				clickmark: 'cancel',
				dialogTitle: "增加积分",
				topcss: '5vh',
				loading: false,
				btnLoading: false,
				//预览弹框打开标记  props属性绑定到子组件
				showDialog: false,
				pointForm: {
					pointVal: ''
				},
				subscriptionTypeOpt: [],
				subscriptionGroup: [],
				pointRules: {
					pointVal: [{
						required: true,
						validator: validatePoint,
						trigger: "change"
					}]
				},
			}
		},
		props: ['openDrawerMark', 'fromMark', 'rowData'],
		components: {

		},
		methods: {
			// 打开弹框
			openFunc() {
				this.clickmark = '';
				//this.rowData.expScore
				this.pointForm.pointVal = "";
				if (this.fromMark == "add") {
					//this.pointForm.pointVal = '';
					this.dialogTitle = "增加积分";
				} else {
					this.dialogTitle = "减少积分";
				}
				/*this.subForm.subTypeVal = '';
				this.subForm.subgroupVal = '';
				this.subForm.refuesResonVal = '';
				this.querySubscriptionType();
				this.querySubscriptionGroup();
				this.querydetail();*/
			},
			openedFunc() {
				//触发校验
				this.$refs.pointForm.validate((valid) => {
					//console.log(valid)
				})
			},
			// 查询详情
			async querydetail() {
				this.loading = true;
				try {
					let params = {
						id: this.rowData.id
					};
					const res = await this.api.querySubscriptionDeatil(params);

					if (res.success) {
						this.loading = false;
						res.data.forEach(function(item, index) {
							item.subscribeImage = item.subscribeImage.split(",");
							item.certificationImages = item.certificationImages.split(",");
						});
						let dataS = res.data[0];
						/*operatorInfoForm:{
						  contactName:'',
						  tel:'',
						  email:'',
						  contactIdCard:'',
						  qualificationCertificate:'',
						  remarks:'' subscribeName
						},*/
						this.basicInfoForm.img = dataS.subscribeImage;
						this.basicInfoForm.name = dataS.subscribeName;
						this.basicInfoForm.location = dataS.province + dataS.city + dataS.county;
						this.basicInfoForm.desc = dataS.description;

						this.operatorInfoForm = {
							contactName: dataS.contactName,
							tel: dataS.phone,
							email: dataS.email,
							contactIdCard: dataS.certificationCode,
							qualificationCertificate: dataS.certificationImages,
							remarks: dataS.remark
						};

						//赋值  0=审核中；1=审核拒绝；2=审核通过
						this.showPassMark = dataS.checkType == 1 ? false : true;
						if (this.showPassMark) {
							this.subForm.subTypeVal = dataS.subTypeId;
							//this.subForm.subgroupVal = dataS.groupId;
							this.subForm.telephonenumber = dataS.caibianPhoneNum ? dataS.caibianPhoneNum : '';
						} else {
							this.subForm.refuesResonVal = dataS.refuesReson;
						}
					} else {
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
			// 提交
			async submitPointFunc(par) {
				this.btnLoading = true;
				try {
					let res;
					if (this.fromMark == 'add') {
						//增加积分
						res = await this.api.addIntegral(par);
					}else{
						// 减少积分
						res = await this.api.reduceIntegral(par);
					}
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
				/* if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				} */
			},
			// 提交表单，并验证
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = {
							userId: this.rowData.userId,
							/* adminId: '1', */
							score: this.pointForm.pointVal
						}
						this.submitPointFunc(params);

						/*let params = {
						  id: this.rowData.id,
						  // 0=审核中；1=审核拒绝；2=审核通过
						  checkType: this.showPassMark?'2':'1',
						};
						if(this.showPassMark){
						  //如果通过 订阅号类型、手机号、采编group必填
						  params.subTypeId = this.subForm.subTypeVal;
						  //params.groupId = this.subForm.subgroupVal;
						  params.caibianPhoneNum = this.subForm.telephonenumber;
						}else{
						  params.refuesReson = this.subForm.refuesResonVal;
						}
						this.submitPointFunc(params);*/
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			}
		},
		mounted() {

		},
		watch: {
			//父子组件双向绑定标记
			openDrawerMark(val) {
				this.current_openDrawerMark = val; //新增result的watch，监听变更并同步到myResult上
			},
			current_openDrawerMark(val) {
				this.$emit('childEvent', {
					openDrawerMark: val,
					clickmark: this.clickmark
				});

			}
		},
	};
</script>

<style scoped lang="less">
	.dialog-footer {
		button {
			&.cancelCls {
				background: #B3B3B3;
				color: #FFFFFF;
				width: 70px;
				height: 30px;
				line-height: 30px;
				padding: 0;
			}

			&.pointformCls {
				width: 70px;
				height: 30px;
				line-height: 30px;
				padding: 0;
			}
		}
	}

	.el-form-item {
		margin-bottom: 16px;
	}
</style>
