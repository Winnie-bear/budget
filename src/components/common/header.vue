<template>
  <div :class="$style.header">
    <h1>中南民族大学预算申报管理系统</h1>
    <p v-if="showFlag">欢迎<span>&nbsp;{{userName}}&nbsp;</span><router-link to="/">[&nbsp;注销&nbsp;]</router-link></p>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data(){
    return {
      userName:this.$store.state.userName
    }
  },
  props:{
    showFlag:{
      type:Boolean,
      default:false,
    }
  },
  //computed:mapState(['userName']),
}
</script>

<style lang="scss" module>
.header{
  position:relative;
  height: 14vh;
  margin: 20px 0px 10px;
  h1{
    text-align: left;
    color: #fff;
    margin-top:10px;
  }
  p{
  position: absolute;
  right: 0;
  bottom: 0;
  color:#fff;
  font-size:0.8rem;
    a{
      cursor: pointer;
      color:#fff;
      text-decoration:none;
    }
  }
}
</style>