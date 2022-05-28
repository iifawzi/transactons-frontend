export const state = () => ({
    transactionSelected: false,
    transactionDetails: {}
});

export const mutations = {
    toggleSelected(state, status) {
        state.transactionSelected = status;
    },
    updateDetails(state, transaction) {
        state.transactionDetails = transaction;
    }
};

export const actions = {
    clearSelected({ commit }) {
        commit("toggleSelected", false);
        commit("updateDetails", {});
    },
    updateDetails({ commit }, transaction) {
        commit("toggleSelected", true)
        commit("updateDetails", transaction)
    }
};

export const getters = {
    isTransactionSelected(state) {
        return state.transactionSelected;
    },
    getTransactionDetails(state) {
        return state.transactionDetails;
    }
}
