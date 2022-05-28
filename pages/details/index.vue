<template>
    <div class="container">
        <div class="details-page">
            <div v-if="loading" class="loading">
                We're processing your request..
            </div>
            <div v-if="!isSelected" class="no-trans">
                Kindly, choose a transaction.
            </div>
            <div v-if="isSelected" class="transaction">
                <div class="bottom">
                    <img src="~/assets/images/user.png" class="user-img" />
                    <p class="account">{{ this.transaction.account.name }}</p>
                    <p :class="['amount', Number(this.transaction.currency) > 0 ? 'pos' : 'neg']">{{
                            this.transaction.amount
                    }} {{ this.transaction.currency }}</p>
                </div>
                <div class="top">
                    <p class="date"> {{ new Date(this.transaction.date).toDateString() }}</p>
                    <div class="cate">
                        <Category v-if="this.transaction.category" :color="
                            this.transaction.category.color
                                ? this.transaction.category.color
                                : 'C2C2C2'
                        " :value="this.transaction.category.name" />
                    </div>
                    <p class="ref"> {{ this.transaction.reference }}</p>
                </div>
            </div>
            <div class="back" @click="goBack">
                <i class="fa-solid fa-circle-chevron-left arrow"></i> Show all transactions
            </div>
        </div>
    </div>
</template>


<script>
import Category from '~/components/shared/category/index.vue';
export default {
    layout: "defualt",
    data() {
        return {
            isSelected: false,
            transaction: {},
            loading: false,
        };
    },
    created() {
        this.loading = true;
        const isSelected = this.$store.getters["transactions/isTransactionSelected"];
        const transactionData = this.$store.getters["transactions/getTransactionDetails"];
        this.isSelected = isSelected;
        this.transaction = transactionData;
        this.loading = false;
    },
    methods: {
        goBack() {
            this.$store.dispatch("transactions/clearSelected");
            this.$router.push("/");
        }
    },
    components: { Category }
}
</script>



<style src="./style.scss" lang="scss" scoped />