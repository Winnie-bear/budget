<template>
  <div>
    <el-form :model="pass" status-icon :rules="rules" ref="passForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="当前密码" prop="curPass">
        <el-input type="password" v-model="pass.curPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input type="password" v-model="pass.newPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="pass.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    var checkCurPass= (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前密码'));
      }
      setTimeout(() => {
        if (/^[0-9]\d*$/.test(value) == false) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      }, 1000);
    };
    var validateNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.pass.checkPass !== '') {
          this.$refs.passForm.validateField('checkPass');
        }
      }
      setTimeout(() => {
        if (/^[0-9]\d*$/.test(value) == false) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      }, 1000);
    };
    var validateCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != this.pass.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      pass: {
        curPass: '',
        newPass:'',
        checkPass: '',
      },
      rules: {
        curPass: [
          { validator: checkCurPass, trigger: 'blur' }
        ],
        newPass: [
          { validator: validateNew, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.pass.newPass);
          let data={
            UserID:this.$store.state.userId,
            OldPassword:this.pass.curPass,
            NewPassword:this.pass.newPass,
            NewPassword2:this.pass.checkPass            
          };
          this.$emit('modify',data);    
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style>
</style>