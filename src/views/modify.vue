<template>
  <div :class="$style.wrapper">
    <Heador :showFlag="true"/>
    <div :class="$style.nav">
      <navigation/>
    </div>
    <div :class="$style.pass">
      <pass-word @modify="modify"/>
    </div>
    <footor/>
  </div>
</template>

<script>
import Heador from '@/components/common/header'
import Footor from '@/components/common/footer'
import Navigation from '@/components/common/nav'
import passWord from '@/components/modify/editPwd'
import qs from 'qs'
import axios from 'axios'

export default {
  inject:['reload'],
  components:{
    Heador,
    Footor,
    Navigation,
    passWord
  },
  data(){
    return {

    }
  },
  methods:{
    modify(data){
      let postData=qs.stringify(data);
      let callback=(response)=>{
        if(response.data=='原密码错误'){
         this.$message.error('原密码错误！');
        }else if(response.data=='修改成功'){
          this.$message({
            message: '恭喜你，密码修改成功！',
            type: 'success'
          });
        }else if(response.data=='修改失败'){
          this.$message('不好意思，修改失败！');
        }
      }
      this.post('/api/change',postData,callback);
      this.reload();
    }
  }
}
</script>

<style lang="scss" module>
.wrapper{
  width:80vw;
  height:100%;
  margin:0 auto;
  .pass{
    width:40%;
    background-color: rgba(255,255,255,.3);
    border-radius: 20px;
    margin:40px auto;
    padding: 30px;
    box-sizing: border-box;
    label{
      color: #fff;
      font-size:1rem;
    }
    button{
      width:140px;
    }
    form{
      height:320px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>

