<template>
  <section :class="$style.wrapper">
    <p>项目预算明细信息（多明细请分项添加)（项目编号：{{projectId}}）</p>
    <div :class="$style.btn">
      <el-button size="mini" @click="addDetail" v-if="showAdd">添加</el-button>
    </div> 
    <el-table
      :data="detailData"
      @cell-mouse-enter="throttleMouseEnter"
      stripe
      style="width: 100%">
      <el-table-column
        label="项目编码"
        width="100%/9">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ProjectID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="本项目预算明细之一"
        width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ProjectBudgetName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目预算金额"
        width="120">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ProjectBudgetMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="年度"
        width="100%/9">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.Annual }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="测算依据"
        width="130px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.BudgetAccding }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="文件下载"
        width="100%/9">
        <template slot-scope="scope">
          <a :href=url style="margin-left: 10px" :class="$style.link">{{ scope.row.Downloads }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        width="100%/9">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.Illustration }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.Notes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
  export default {
    props:{
      detailData:{
        type:Array,
        default:function(){
          return [{
            Annual:'',
            BudgetAccding:'',
            DSID:'',
            Downloads:'',
            Illustration:'',
            Notes:'',
            ProjectBudgetMoney:'',
            ProjectBudgetName:'',
            ProjectID:''
          }];
        }
      },
      projectId:{
        type:String,
        default:''
      },
      showAdd:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        projectId:'',
        url:''
      }
    },
    methods: {
      addDetail(){
        this.$emit('addDetail');
      },
      handleEdit(index, row) {
        this.$emit('editDetail',row);
      },
      handleDelete(index, row) {
        this.$confirm('是否确认删除此项信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((action) => {
          if(action=='confirm'){
            this.$emit('delDetail',row);               
          }
        }).catch((err) => {
          if(err=='cancel'){
            this.$message({
              type: 'info',
              message: '已取消删除'
            }); 
          }         
        });
      },
      handleMouseEnter(row){
        this.url=`http://210.42.144.62:8000${row.Illustration}`;
        console.log(this.url);
      },
      //节流
      throttle(method,delay){
        let timer=null,context,args;
        return function(){
          context=this;
          args=[].slice.call(arguments,0);
          if(!timer){
            timer=setTimeout(function(){
              timer=null;//函数执行以后清空延时器，以便下一次触发函数
              method.apply(context,args);
            },delay);
          }
        } 
      },
      //鼠标进入节流
      throttleMouseEnter(row){
        this.throttle(this.handleMouseEnter(row),5000)();//最后的()不能掉
      }
    }
  }
</script>
<style lang="scss" module>
.wrapper{
  .btn{
    background: #fff;
    height: 42px;
    border-bottom: 1px solid #ebeef5;
    padding:10px 0px 0px 10px;
    button{
      float: left;
    }
  }
  p{
    background-color: #fff;
    color:#5c87b2;
    text-align: left;
    padding: 10px 30px;
  }
  .link{
    color:#606266;
    cursor: pointer;
    text-decoration: none;
  }
}
</style>