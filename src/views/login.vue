<template>
  <div id="login">
    <el-form :model="ruleForm" class="container" :rules="rules" ref="adminForm">
      <div class="logo"></div>
      <div class="clear-position">
        <div class="text"></div>
        <el-form-item prop="adminName">
          <el-input
            class="account"
            v-model="ruleForm.adminName"
            placeHolder="管理员账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            class="password"
            v-model="ruleForm.passWord"
            type="password"
            placeHolder="管理员密码"
          ></el-input>
        </el-form-item>
        <div>
          <span class="duigou">√</span>
          <span class="remeber-pw">记住密码</span>
        </div>
        <el-form-item>
          <el-button class="login-button" @click="submitForm">登陆</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        adminName: "admin",
        passWord: "admin"
      },
      rules: {
        adminName: [
          { required: true, message: "请输入管理员账号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "管理员账号在3到10个字符",
            trigger: "blur"
          }
        ],
        passWord: [
          { required: true, message: "请输入管理员密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "管理员密码在5到16个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {},
  methods: {
    submitForm() {
      if (
        this.ruleForm.adminName === "admin" &&
        this.ruleForm.passWord === "admin"
      ) {
        this.$router.push("/home");
        this.$message({
          type: "success",
          message: "登陆成功!"
        });
      } else {
        this.$message({
          type: "error",
          message: "账号密码错误!"
        });
      }
    }
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#login {
  height: 100%;
  position: fixed;
  width: 100%;
  background: url("../assets/img/login/bg.png") no-repeat;
  background-size: cover;
}
.container {
  width: 640px;
  height: 500px;
  background: rgba(238, 238, 238, 0.7);
  box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.5);
  /*opacity:0.7;*/
  border-radius: 10px;
  margin: 285px auto;
  position: relative;
  .logo {
    width: 167px;
    height: 167px;
    background: url("../assets/img/login/logo.png");
    position: absolute;
    left: 237px;
    bottom: 416px;
  }
  .clear-position {
    position: absolute;
  }
  .text {
    width: 448px;
    height: 48px;
    margin: 104px 96px 41px 96px;
    background: url("../assets/img/login/text.png");
  }
  .el-input__inner {
    margin-left: 122px;
    padding: 15px 61px;
    background-size: 22px;
    width: 396px;
    height: 44px;
    background: rgba(255, 255, 255, 1) url("../assets/img/login/密码.png") no-repeat 21px 12px;
    opacity: 0.9;
    border-radius: 3px;
    border: 0;
    outline: none;
  }
  .remeber-pw {
    width: 64px;
    height: 17px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .duigou {
    width: 16px;
    height: 16px;
    background: rgba(195, 26, 32, 1);
    border-radius: 50% !important;
    margin-left: 125px;
    margin-right: 10px;
    color: rgba(255, 255, 255, 1);
  }
  .el-button {
    width: 396px;
    height: 44px;
    background: rgba(195, 26, 32, 1);
    border-radius: 3px;
    margin-left: 122px;
    margin-top: 49px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
</style>
