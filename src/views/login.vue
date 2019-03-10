<template>
  <div :class="$style.login">
    <heador/>
    <section :class="$style.wrapper">
      <el-form :label-position="labelPosition" label-width="90px" :model="info" :class="$style.form">
        <el-form-item label="部门编号" :class="$style.item">
          <el-input v-model="info.depID"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="info.pwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox label="记住我？" v-model="checked" :class="$style.checkbox"></el-checkbox>
        </el-form-item>
         <el-button @click="login()">登录</el-button>
      </el-form>
    </section>
    <footor/>
  </div>
</template>

<script>
import Heador from '@/components/common/header'
import Footor from '@/components/common/footer'
import axios from 'axios'
import qs from 'qs' 
export default {
  inject:['reload'],
  data () {
    return {
      labelPosition: 'left',
      info: {
        depID: '',
        pwd: ''
      },
      checked:false
    };
  },
  components: {
    Heador,
    Footor
  },
  mounted(){
    this.checkRemember();
  },
  methods:{
    login(){
      if(this.checked==true){
        this.remember=1;
      }else{
        this.remember=0;
      }
      let postData=qs.stringify({
          username:this.info.depID,
          password:this.info.pwd,
          remember:this.remember
        });//将对象序列化成URL的形式，以&进行拼接
      let callback=(response)=>{
        let res=response.data;
        if(res=='帐号或者密码错误'){
          this.$message.error(res);
          this.reload();
        }else{
          this.$store.commit('updateUserInfo',res);
          this.$router.push({name:'expenses'});
        } 
      }
      this.post('/api/login',postData,callback);
    },
    //获取cookie
    getCookie(name){
      let reg=new RegExp(`(^| )${name}=([^;]*)(; |$)`);
      let resArr=document.cookie.match(reg);
      return resArr[2];
    },
    checkRemember(){
      if(document.cookie){
        this.info.depID=this.getCookie("DepartmentID");
        this.info.pwd=this.getCookie("password");
      }else{
        this.info={
          depID: '',
          pwd: ''
        };
      }
    }
  }
}

</script>
<style lang="scss" module>
.login{
  width:80vw;
  height: 100vh;
  margin:0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  .wrapper{
    width:35vw;
    height: 50vh;
    background-color: rgba(255,255,255,.3);
    border-radius: 20px;
    margin:0px auto;
    padding: 30px;
    box-sizing: border-box;
    .form{
      height: 40vh;
      display: flex;
      flex-direction: column;
      justify-content:space-around;
      align-items:center;
      label{
        color: #fff;
        font-size:1rem;
      }
      button{
        width:160px;
      }
      .checkbox{
        position: relative;
        right: 50px;
      }
    } 
  }
}
</style>