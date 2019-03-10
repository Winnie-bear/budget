<template>
  <div>
    <el-dialog title="添加新项目信息" :visible.sync="addProVisible" @close="closeAdd">
      <el-form :model="proInfo">
        <el-form-item label="部门编号" :label-width="formLabelWidth">
          <el-input v-model="proInfo.DepartmentID" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目编码" :label-width="formLabelWidth">
          <el-input v-model="proInfo.ProjectID" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="proInfo.ProjectName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注（200字以内）" :label-width="formLabelWidth">
          <el-input v-model="proInfo.Notes" 
            autocomplete="off" 
            type="textarea"
            :rows="5">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="subProCancel">取 消</el-button>
        <el-button type="primary" @click="subPro">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    addProVisible:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      formLabelWidth: '140px',
      proInfo:{
        DepartmentID:'',
        ProjectID:'',
        ProjectName:'',
        Notes:''
      }
    };
  },

  components: {},

  mounted() {},

  methods: {
    subPro(){
      this.$emit('subPro',this.proInfo);
    },
    subProCancel(){
      this.$emit('subProCancel');
    },
    closeAdd(){
      this.proInfo={
        DepartmentID:'',
        ProjectID:'',
        ProjectName:'',
        Notes:''
      };
      this.$emit('closeAdd');
    }
  }
}

</script>
<style lang="scss" module>
</style>