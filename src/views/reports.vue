<template>
  <div :class="$style.reports">
    <heador :show-flag="true"/>
    <navigation/>
    <rep-print/>
    <footor/>
  </div>
</template>

<script>
import Heador from '@/components/common/header'
import Footor from '@/components/common/footer'
import Navigation from '@/components/common/nav'
import RepPrint from '@/components/reports/repPrint'
import qs from 'qs'
export default {
  data () {
    return {
      departments:[],
      years:[],
      reportData:[]
    };
  },
  components: {
    Heador,
    Footor,
    Navigation,
    RepPrint
  }
}
</script>

<style lang='scss' module>
.reports{
  width:80vw;
  margin:0 auto;
}
</style>