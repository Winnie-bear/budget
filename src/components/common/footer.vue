<template>
  <div :class="$style.footer">
    <p>版权所有© 2013-2020 中南民族大学财务处 </p>
    <p>技术支持：<a title="中南民族大学NewThread团队" href="http://www.new-thread.com/" target="_blank">中南民族大学NewThread团队</a></p>
    <p>如遇到报表无法正常显示,请换个浏览器尝试,推荐使用谷歌chrome浏览器.<a href="http://210.42.144.62:8000/Downloads3/ChromeSetup_64.exe">浏览器下载 </a></p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
}

</script>
<style lang="scss" module>
.footer{
  height: 70px;
  color:#CED8DC;
  a{
    color:#FAF3F3;
    transition: font-size 0.2s;
    &:hover{
      font-size:1.1rem;
    }
  }
}
</style>