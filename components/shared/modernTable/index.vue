<template>
  <table class="modernTable" cellspacing="12" cellpadding="16">
    <tr>
      <slot name="table__head"></slot>
    </tr>
    <slot name="table__data"></slot>
  </table>
</template>




<style lang="scss" src="./style.scss" scoped />