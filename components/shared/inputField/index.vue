<template>
    <div class="input-field">
        <input class="input" @input="$emit('input', $event.target.value)" v-bind="$attrs" />
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
};
</script>


<style src="./style.scss" lang="scss" scoped />