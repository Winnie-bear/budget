<template>
  <section :class="$style.wrapper">
    <div v-if="budgetFlag" :class="$style.budget">
      <p>收入管理</p>
      <p>单位名称：{{userName}}</p>
      <p>{{year+1}}年收入预算情况</p>
    </div>
    <div v-if="actualFlag" :class="$style.actual">
      <p>{{year}}年实际收入情况</p>
    </div>
    <div :class="$style.btn">
      <el-button size="mini" @click="addRevenue">添加</el-button>
    </div> 
    <el-table
    :data="revenueData"
    @cell-mouse-enter="throttleMouseEnter"
    height="300"
    border
    style="width: 100%">
      <el-table-column
        prop="RevenueTypeName"
        label="收入类别名称"
        width="70">
      </el-table-column>
      <el-table-column
        prop="ChargeProjectName"
        label="收费项目名称"
        width="70">
      </el-table-column>
      <el-table-column
        prop="CalculateUnitName"
        label="计费单位名称"
        width="70">
      </el-table-column>
      <el-table-column
        prop="ChargeStandard"
        label="收费标准"
        width="60">
      </el-table-column>
      <el-table-column
        prop="ChargeScopeName"
        label="收费范围名称"
        width="80">
      </el-table-column> 
      <el-table-column
        v-if="flags.budget"
        prop="BudgetTotalRrevenue"
        label="预算总收入"
        width="100">
      </el-table-column>
      <el-table-column
        v-if="flags.actual"
        prop="ActualTotalRrevenue"
        label="实际总收入">
      </el-table-column>
      <el-table-column
        v-if="flags.according"
        prop="BudgetAccding"
        label="测算依据"
        width="160">
      </el-table-column>
      <el-table-column
        label="文件下载"
        width="80">
        <template slot-scope="scope">
          <a :href=url style="margin-left: 10px" :class="$style.link">{{ scope.row.Downloads }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="Illustration"
        label="文件名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="Notes"
        label="备注"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div :class="$style.btns">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  props:{
    revenueData:{
      type:Array,
      default:[{
        "ApplyID": '',
        "RevenueTypeName":'',
        "ChargeProjectName":'',
        "CalculateUnitName":'',
        "ChargeStandard": '',
        "ChargeScopeName": '',
        "BudgetTotalRrevenue": '',
        "BudgetAccding": '',
        "Downloads": '',
        "Illustration": '',
        "Notes":'',
        "ActualTotalRrevenue":''
      }]
    },
    budgetFlag:{
      type:Boolean,
      default:false,
    },
    actualFlag:{
      type:Boolean,
      default:false,
    }
  },
  data () {
    return {
      userName:this.$store.state.userName,
      year:new Date().getFullYear(),
      flags:{
        budget:false,
        actual:false,
        according:false
      },
      url:''
    };
  },
  computed:{
    showFlag(){
      return {budFlag:this.budgetFlag,actFlag:this.actualFlag};//this不能掉
    },
  },
  watch:{
    showFlag:{
      handler:function(val,oldVal){
        if(val.budFlag==true){
          this.flags={
            budget:true,
            actual:false,
            according:true
          }
        }else{
          this.flags={
            budget:false,
            actual:true,
            according:false
          }
        }
      },
      immediate:true
    }
  },
  methods:{
    //触发父组件上的添加事件
    addRevenue(){
      this.$emit('addRev');
    },
    //触发父组件上的修改事件
    handleEdit(index, row) {
      this.$emit('editRev',row);
    },
    handleDelete(index, row) {
      this.$confirm('是否确认删除此项信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if(action=='confirm'){
          this.$emit('delRev',row);               
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
      this.throttle(this.handleMouseEnter(row),10000)();//最后的()不能掉
    }
  }
}

</script>
<style lang='scss' module>
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
  .btns{
    button{
      margin:5px;
    }
  }
  p{
    text-align: left;
    background-color: #fff;
    color:#5c87b2;
    padding: 10px 30px;
    font-weight: bold;
    font-size:0.8rem;
  }
  .budget{
    p{
      &:nth-child(1){
        font-size:1.2rem;
      }
      &:nth-child(3){
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
  .link{
    color:#606266;
    cursor: pointer;
    text-decoration: none;
  }
}
</style>