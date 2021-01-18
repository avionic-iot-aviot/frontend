const state = {
  connected: false
};

const getters = {
  connected: state => state.connected,
};

const mutations = {
  setConnected(state, connected) {
    state.connected=connected;
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
