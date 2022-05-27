import gql from "graphql-tag";

const getAllTransactions = (page, account, to, from) => {
    const query = gql`
    query getTransactions($page: Int, $from: String, $to: String, $account: String) {
        getAllTransactions(page: $page, from: $from, to: $to, account: $account) {
            id,
            account {
                name
            },
            category {
                name,
                color
            }
            date
            reference
            description
            currency
            amount
        }
    }
  `;

    const variables = {
        page,
        account,
        to,
        from,
    }

    return {
        query,
        variables
    }
};

export default {
    getAllTransactions,
}