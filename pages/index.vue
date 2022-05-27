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
              <th colspan="5">Account</th>
              <th colspan="3">Category</th>
              <th>Date</th>
              <th>Amount</th>
            </template>
            <template class="transactions__data" v-slot:table__data>
              <tr>
                <td colspan="5">fawzi</td>
                <td colspan="3">
                  <category color="#B7A3D1" value="Home" />
                </td>
                <td>Fawzi</td>
                <td>Fawzi</td>
              </tr>
            </template>
          </modernTable>
        </div>
        <div class="tools"></div>
      </div>
    </div>
  </div>
</template>

<script>
import modernTable from "~/components/shared/modernTable";
import category from "~/components/shared/category";
export default {
  layout: "default",
  components: {
    modernTable,
    category,
  },
};
</script>

<style src="./style.scss" lang="scss" scoped  />