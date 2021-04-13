const state = {
  instance: {
    context: "",
    mode: "",
    text: "",
  }
};

const getters = {
  instance: state => state.instance,
};

const mutations = {
  showMessage(state, payload) {
    state.instance={...state.instance,...payload};
  },
};

const actions = {

};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};
