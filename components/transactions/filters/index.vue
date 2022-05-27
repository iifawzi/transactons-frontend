<template>
    <div class="filters">
        <div class="filters-inputs">
            <div class="input-container">
                <label for="account" class="input-label">Account</label>
                <inputField class="input" type="text" placeholder="Account Name" id="account"
                    @input="$emit('accountChange', $event)" />
                <div class="account-error">
                    <slot name="account_error"></slot>
                </div>
            </div>
            <div class="input-container">
                <label for="from" class="input-label">From</label>
                <inputField class="input" type="date" id="from" @input="$emit('fromChange', $event)" />
            </div>
            <div class="input-container">
                <label for="to" class="input-label">To</label>
                <inputField class="input" type="date" id="to" @input="$emit('toChange', $event)" />
            </div>

        </div>
    </div>
</template>
<script>
import InputField from "~/components/shared/inputField"
export default {
    components: {
        InputField
    }
}
</script>





<style src="./style.scss" lang="scss" scoped />

