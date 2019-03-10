<template>
  <section :class="$style.wrapper">
    <p>预算管理</p>
    <p>单位名称：{{userName}}</p>
    <p>项目信息</p>
    <div :class="$style.downLoad" v-if="showFlag">
      <el-button type="info"><a href="http://210.42.144.62:8000/download_all">旧批量下载</a></el-button>
      <el-button type="primary"><a href="http://210.42.144.62:8000/download_all2">新批量下载</a></el-button>
    </div>
    <div :class="$style.btn" v-if="showFlag">
      <el-button size="mini" @click="addPro">添加</el-button>
    </div> 
    <el-table
      ref="expTab"
      :data="projectData" 
      @row-click="handleCurClick"
      highlight-current-row
      stripe
      style="width: 100%">
      <el-table-column
        label="部门编码"
        width="120" v-if="showFlag" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.DepartmentID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="部门名字"
        width="150" v-if="showFlag" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.UserName }}</span>
        </template>
      </el-table-column>    
      <el-table-column
        label="项目编码"
        width="120" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ProjectID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称"
        width="250"
        align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ProjectName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        width="calc(100% - 120 - 250)"
        align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.Notes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  v-if="showFlag" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button
            size="mini"
            :type="scope.row.state==='1'? 'danger': 'primary' "
            @click="handleShow(scope.$index, scope.row)">{{ scope.row.state==='1'?'隐藏':'显示'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
    props:{
      projectData:{
        type:Array,
        default:function(){
          return [{
          Notes:'',
          ProjectID:'',
          ProjectName:''
          }]
        }
      },
      showFlag:{
        type:Boolean,
        default:false,
      },
      state:{
        type:Number,
        default:0
      }
    },
    data() {
      return {
        userName:this.$store.state.userName,
        curIndex:'',
        showText:'',
      }
    },
    methods: {
      addPro(){
        this.$emit('add');
      },
      //触发父组件上的edit方法
      handleEdit(index, row) {
        this.$emit('edit',row);
      },
      handleShow(index, row) {
        if(row.state==='1'){
          this.showText="隐藏"
        }else{
          this.showText="显示"
        }
        console.log(this.showText);
        this.$confirm(`是否${this.showText}该项?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((action) => {
          if(action=='confirm'){
            this.curIndex=index; 
            if(this.showText=='隐藏'){
              this.$emit('hidden',row); 
            }else{
              this.$emit('display',row);
            }              
          }
        }).catch((err) => {
          if(err=='cancel'){
            this.$message({
              type: 'info',
              message: `已取消${this.showText}`
            }); 
          }         
        }); 
        if(this.curIndex)
        {
          this.$refs.expTab.setCurrentRow(this.curIndex); 
        }
        console.log(row);
      },
      handleCurClick(row){
        this.$emit('getProId',row.ProjectID);
      }
    }
  }
</script>

<style lang="scss" module>
.wrapper{
  position: relative;
  .downLoad{
    position: absolute;
    right: 100px;
    top:50px;
    a{
      text-decoration: none;
      color: #fff;
    }
  }
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
    text-align: left;
    background-color: #fff;
    color:#5c87b2;
    padding: 10px 30px;
    font-weight: bold;
    font-size:0.8rem;
    &:nth-child(1){
      font-size:1.2rem;
    }
    &:nth-child(3){
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>