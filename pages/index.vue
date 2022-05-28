<template>
  <div class="container">
    <div class="transactions-page">
      <div class="transactions">
        <p class="title">Transactions</p>
        <Filters @accountChange="accountChange" @toChange="toChange" @fromChange="fromChange">
          <template v-if="!fromValid" v-slot:from_error>
            from Date is not valid
          </template>
          <template v-if="!toValid" v-slot:to_error>
            to Date is not valid
          </template>
        </Filters>
        <div class="table" v-if="!loading && !error">
          <ModernTable>
            <template v-slot:table__head>
              <th colspan="3">Reference</th>
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
              <tr v-for="(transaction, i) of transactions" :key="i" @click="showDetails(transaction)">
                <td colspan="3">
                  <p :class="[transaction.reference ? '' : 'no-ref']">{{ transaction.reference ? transaction.reference : 'no reference provided' }}</p>
                </td>
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
          <div class="before arrow" v-if="this.page >= 2" @click="beforePage()">
            <i class="fa-solid fa-circle-chevron-left"></i>
          </div>
          <div v-if="!stopNext" class="next arrow" @click="nextPage()">
            <i class="fa-solid fa-circle-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import transactionServices from "~/api/transaction.service.js";
import dateIsValid from "~/helpers/dateIsValid.js"
import ModernTable from "~/components/shared/modernTable";
import Category from "~/components/shared/category";
import Filters from "~/components/transactions/filters/index.vue"
import { DEBOUNCE_TIMER } from "~/constants"
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
      fromValid: true,
      toValid: true,
      dateArrowDown: true,
      transactions: [],
      AllTransactions: [],
      loadedToPage: 1,
      stopNext: false,
      page: 1,
      account: '',
      from: '',
      to: '',
      error: '',
    };
  },

  async created() {
    this.debouncedFrom = this.debounce(async (from) => {
      const curr = await this.getData(1, this.account, this.to, from);
      if (!this.dateArrowDown) {
        this.transactions = curr.reverse();
      } else {
        this.transactions = curr;
      }
      this.AllTransactions = curr;
      this.page = 1;
    }, DEBOUNCE_TIMER);

    this.debouncedTo = this.debounce(async (to) => {
      const curr = await this.getData(1, this.account, to, this.from);
      if (!this.dateArrowDown) {
        this.transactions = curr.reverse();
      } else {
        this.transactions = curr;
      }
      this.AllTransactions = curr;
      this.page = 1;
    }, DEBOUNCE_TIMER);

    this.debouncedAccount = this.debounce(async (account) => {
      const curr = await this.getData(1, account, this.to, this.from);
      if (!this.dateArrowDown) {
        this.transactions = curr.reverse();
      } else {
        this.transactions = curr;
      }
      this.AllTransactions = curr;
      this.page = 1;
    }, DEBOUNCE_TIMER);
  },


  async fetch() {
    const transactions = await this.getData();
    this.transactions = transactions;
    this.AllTransactions = transactions;
  },

  methods: {
    async getData(page, account, to, from) {
      this.error = '';
      try {
        this.loading = true;
        const apolloClient = this.$apolloProvider.defaultClient;
        const transactionsSettings = transactionServices.getAllTransactions(page, account, to, from);
        const response = await apolloClient.query({ query: transactionsSettings.query, variables: transactionsSettings.variables });
        const { getAllTransactions } = response.data;
        if (getAllTransactions.length < 20) {
          this.stopNext = true;
        } else {
          this.stopNext = false;
        }

        this.loading = false;
        return getAllTransactions;
      } catch (err) {
        console.log('Geeky checks! The site is not able to connect to the backend');
        this.error = 'Please try again later.'
      }
    },

    async nextPage() {
      const neededPage = this.page + 1;
      if (this.loadedToPage >= neededPage) {
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
        const newTrans = await this.getData(this.page + 1, this.account, this.to, this.from);
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
    },

    async beforePage() {
      if (this.page - 1 >= 1) {
        this.stopNext = false;
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
    },

    dateClicked() {
      this.dateArrowDown = !this.dateArrowDown;
      this.transactions.reverse();
    },

    accountChange(value) {
      this.loadedToPage = 1;
      this.account = value;
    },

    async fromChange(value) {
      const isValid = dateIsValid(value);
      if (isValid) {
        this.fromValid = true;
        this.loadedToPage = 1;
        this.from = value;
      } else {
        this.fromValid = false;
      }
    },

    async toChange(value) {
      const isValid = dateIsValid(value);
      if (isValid) {
        this.toValid = true;
        this.loadedToPage = 1;
        this.to = value;
      } else {
        this.toValid = false;
      }
    },

    showDetails(transaction) {
      this.$store.dispatch("transactions/updateDetails", transaction);
      this.$router.push({ name: 'details', params: { id: 1 } });
    }

  },
  watch: {
    account(value) {
      this.debouncedAccount(value);
    },
    from(value) {
      this.debouncedFrom(value);
    },
    to(value) {
      this.debouncedTo(value);
    }
  }
};
</script>




<style src="./style.scss" lang="scss" scoped  />