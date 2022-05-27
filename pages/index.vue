<template>
  <div class="container">
    <div class="transactions-page">
      <div class="transactions">
        <div class="filters">
          <p class="title">Transactions</p>
        </div>
        <div class="table">
          <modernTable>
            <template v-slot:table__head>
              <th colspan="3">Account</th>
              <th colspan="2">Category</th>
              <th @click="dateClicked">
                <p class="col-date">
                  Date
                  <i
                    v-if="dateArrowDown"
                    class="date-arrow fa-solid fa-caret-down"
                  ></i>
                  <i v-else class="date-arrow fa-solid fa-caret-up"></i>
                </p>
              </th>
              <th>Amount</th>
            </template>
            <template
              v-if="!loading"
              class="transactions__data"
              v-slot:table__data
            >
              <tr v-for="(transaction, i) of transactions" :key="i">
                <td colspan="3">{{ transaction.account.name }}</td>
                <td colspan="2">
                  <category
                    v-if="transaction.category"
                    :color="
                      transaction.category.color
                        ? transaction.category.color
                        : 'C2C2C2'
                    "
                    :value="transaction.category.name"
                  />
                </td>
                <td>
                  {{ new Date(transaction.date).toDateString() }}
                </td>
                <td>{{ transaction.amount + " " + transaction.currency }}</td>
              </tr>
            </template>
          </modernTable>
        </div>
        <div class="tools">
          <div
            class="before arrow"
            v-if="this.page >= 2"
            @click="updateData('before')"
          >
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
import modernTable from "~/components/shared/modernTable";
import category from "~/components/shared/category";
import transactionServices from "~/api/transaction.service.js";
export default {
  layout: "default",
  components: {
    modernTable,
    category,
  },

  data() {
    return {
      loading: false,
      transactions: [],
      AllTransactions: [],
      loadedToPage: 1,
      page: 1,
      dateArrowDown: true,
    };
  },

  async fetch() {
    const transactions = await this.getData();
    this.transactions = transactions;
    this.AllTransactions = transactions;
  },

  methods: {
    async getData(page, account, to, from) {
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
  },
};
</script>

<style src="./style.scss" lang="scss" scoped  />