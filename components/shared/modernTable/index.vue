<template>
  <table class="modernTable" cellspacing="12" cellpadding="16">
    <thead>
      <tr>
        <slot name="table__head"></slot>
      </tr>
    </thead>
    <tbody>
      <slot name="table__data"></slot>
    </tbody>
  </table>
</template>


<style lang="scss" src="./style.scss" scoped />