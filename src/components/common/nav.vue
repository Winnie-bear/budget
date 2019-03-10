<template>
  <div :class="$style.menu">
    <el-menu class="el-menu-demo" mode="horizontal" text-color="#909399" router=true  @select="handleSelect">
      <el-menu-item index="/expenses">
        项目支出预算填报
      </el-menu-item>
      <el-menu-item index="/revenue">
        收入填报
      </el-menu-item>
      <el-submenu index="/reports/1" v-if=subShowFlag>
        <template slot="title">报表打印</template>
          <el-menu-item index="/reports/1">{{subTitle[0]}}</el-menu-item>
          <el-menu-item index="/reports/2">{{subTitle[1]}}</el-menu-item>
          <el-menu-item index="/reports/3">{{subTitle[2]}}</el-menu-item>
          <el-menu-item index="/reports/4">{{subTitle[3]}}</el-menu-item>
          <el-menu-item index="/reports/5">{{subTitle[4]}}</el-menu-item>
          <el-menu-item index="/reports/6">{{subTitle[5]}}</el-menu-item>
          <el-menu-item index="/reports/7">{{subTitle[6]}}</el-menu-item>
          <el-menu-item index="/reports/8">{{subTitle[7]}}</el-menu-item>
          <el-menu-item index="/reports/9">{{subTitle[8]}}</el-menu-item>
      </el-submenu>
      <el-submenu index="/reports/1" v-else>
        <template slot="title">报表打印</template>
          <el-menu-item index="/reports/1">{{subMenuTit[0]}}</el-menu-item>
          <el-menu-item index="/reports/2">{{subMenuTit[1]}}</el-menu-item>
          <el-menu-item index="/reports/3">{{subMenuTit[2]}}</el-menu-item>
      </el-submenu>
      <el-menu-item index="/modify">
        修改密码
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
   data() {
    return {
      subShowFlag:false,
      subTitle:[
        '中南民族大学年度校级及部门专项预算申报明细表（财务用表）',
        '中南民族大学年度校级及部门专项预算申报明细表（各部门汇总表）',
        '中南民族大学年度校级及部门专项预算申报汇总（各部门汇总表）',
        '中南民族大学年度实际收入申报表(财务用表)',
        '中南民族大学年度实际收入申报表(各部门汇总表)',
        '中南民族大学年度收入预算申报表(财务用表)',
        '中南民族大学年度收入预算申报表(各部门汇总表)',
        '预算申报单位负责人及编制人联系方式',
        '中南民族大学年校级及部门专项预算申报表（各部门汇总表）'
      ],
      subMenuTit:[
        '中南民族大学年度校级及部门专项预算申报明细表（部门用表）',
        '中南民族大学年度实际收入申报表(部门用表)',
        '中南民族大学年度收入预算申报表(部门用表)'
      ]
    };
  },
  mounted(){
    this.subShow();
  },
  methods: {
    subShow(){
      if(this.$store.state.userId=='000'){
        this.subShowFlag=true;
      }else{
        this.subShowFlag=false;
      }
    },
    handleSelect(key, keyPath) {
      if(key.indexOf('/reports')!==-1){
        let selectTitle='';
        let repInfo={};
        let arr=key.split('/');
        let num=parseInt(arr[2]);
        if(this.subShowFlag){
          selectTitle=this.subTitle[num-1];
        }else{
          selectTitle=this.subMenuTit[num-1];
        }
        repInfo.reportTitle=selectTitle;
        repInfo.annualFlag=true;
        if(selectTitle==this.subTitle[0]){
          repInfo.depFlag=true;    
        }else if(selectTitle==this.subTitle[1]){
          repInfo.depFlag=false;
        }else if(selectTitle==this.subTitle[2]){
          repInfo.depFlag=false;
        }else if(selectTitle==this.subTitle[3]){
          repInfo.depFlag=true;
        }else if(selectTitle==this.subTitle[4]){
          repInfo.depFlag=false;
        }else if(selectTitle==this.subTitle[5]){
          repInfo.depFlag=true;
        }else if(selectTitle==this.subTitle[6]){
          repInfo.depFlag=false;
        }else if(selectTitle==this.subTitle[7]){
          repInfo.depFlag=false;
          repInfo.annualFlag=false;
        }else if(selectTitle==this.subTitle[8]){
          repInfo.depFlag=false;
        }else{
          repInfo.depFlag=false;
        }
        this.$store.commit('updateRepShow',repInfo);
      }
    }
  }
}

</script>
<style lang="scss" module>
.menu{
  li{
    font-weight: bold;
    &:hover{
      font-size:0.9rem;
      color:#409EFF !important;
      border-bottom: 1px solid #409EFF !important;
    }
  }
}
</style>