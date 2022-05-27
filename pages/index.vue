<template>
  <div class="container">
    <div class="transactions-page">
      <div class="transactions">
        <p class="title">Transactions</p>
        <Filters @accountChange="accountChange" @toChange="toChange" @fromChange="fromChange">
          <template v-if="!accountValid" v-slot:account_error>
            Account must be a string
          </template>
        </Filters>
        <div class="table" v-if="!loading && !error">
          <ModernTable>
            <template v-slot:table__head>
              <th colspan="3">Account</th>
              <th colspan="2">Category</th>
              <th @click="dateClicked">
                <p class="col-date">
                  Date
                  <i v-if="dateArrowDown" class="date-arrow fa-solid fa-caret-down"></i>
                  <i v-else class="date-arrow fa-solid fa-caret-up"></i>
                </p>
              </th>
              <th>Amount</th>
            </template>
            <template class="transactions__data" v-slot:table__data>
              <tr v-for="(transaction, i) of transactions" :key="i">
                <td colspan="3">{{ transaction.account.name }}</td>
                <td colspan="2">
                  <Category v-if="transaction.category" :color="
                    transaction.category.color
                      ? transaction.category.color
                      : 'C2C2C2'
                  " :value="transaction.category.name" />
                </td>
                <td>
                  {{ new Date(transaction.date).toDateString() }}
                </td>
                <td>{{ transaction.amount + " " + transaction.currency }}</td>
              </tr>
            </template>
          </ModernTable>
        </div>
        <div v-else>
          <div class="feedback">
            <img v-if="error" src="~/assets/images/ops.png" class="error-img" />
          </div>
        </div>
        <div class="tools" v-if="!loading && !error">
          <div class="before arrow" v-if="this.page >= 2" @click="updateData('before')">
            <i class="fa-solid fa-circle-chevron-left"></i>
          </div>
          <div class="next arrow" @click="updateData('next')">
            <i class="fa-solid fa-circle-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import transactionServices from "~/api/transaction.service.js";
import ModernTable from "~/components/shared/modernTable";
import Category from "~/components/shared/category";
import Filters from "../components/transactions/filters/index.vue"
export default {
  layout: "default",
  components: {
    ModernTable,
    Category,
    Filters,
  },

  data() {
    return {
      loading: false,
      accountValid: true,
      dateArrowDown: true,
      transactions: [],
      AllTransactions: [],
      loadedToPage: 1,
      page: 1,
      error: ''
    };
  },

  async fetch() {
    const transactions = await this.getData();
    this.transactions = transactions;
    this.AllTransactions = transactions;
  },

  methods: {
    async getData(page, account, to, from) {
      try {
        this.loading = true;
        const apolloClient = this.$apolloProvider.defaultClient;
        const transactionsSettings = transactionServices.getAllTransactions(
          page,
          account,
          to,
          from
        );
        const response = await apolloClient.query({
          query: transactionsSettings.query,
          variables: transactionsSettings.variables,
        });
        const { getAllTransactions } = response.data;
        this.loading = false;
        return getAllTransactions;
      } catch (err) {
        console.log('Geeky checks! The site is not able to connect to the backend');
        this.error = 'Please try again later.'
      }
    },

    async updateData(type) {
      if (type === "next") {
        const neededPage = this.page + 1;
        if (this.loadedToPage > neededPage) {
          this.page += 1;
          const startIndex = (neededPage - 1) * 20;
          const endIndex = neededPage * 20;
          const curr = this.AllTransactions.slice(startIndex, endIndex);
          if (!this.dateArrowDown) {
            this.transactions = curr.reverse();
          } else {
            this.transactions = curr;
          }
        } else {
          const newTrans = await this.getData(this.page + 1);
          if (newTrans.length) {
            this.AllTransactions.push(...newTrans);
            this.page += 1;
            this.loadedToPage += 1;
            if (!this.dateArrowDown) {
              this.transactions = newTrans.reverse();
            } else {
              this.transactions = newTrans;
            }
          }
        }
      } else {
        if (this.page - 1 >= 1) {
          this.page -= 1;
          const neededPage = this.page;
          const startIndex = (neededPage - 1) * 20;
          const endIndex = neededPage * 20;
          const curr = this.AllTransactions.slice(startIndex, endIndex);
          if (!this.dateArrowDown) {
            this.transactions = curr.reverse();
          } else {
            this.transactions = curr;
          }
        }
      }
    },

    dateClicked() {
      this.dateArrowDown = !this.dateArrowDown;
      this.transactions.reverse();
    },

    accountChange(value) {
      if (!value || typeof value !== 'string') {
        console.log(!value, typeof value !== 'string')
        this.accountValid = false;
      } else {
        this.accountValid = true;
      }
    },
    fromChange(value) {
      console.log(value);
    },
    toChange(value) {
      console.log(value);
    }
  },
};
</script>

<style src="./style.scss" lang="scss" scoped  />