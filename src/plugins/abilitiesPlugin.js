function abilitiesPlugin(Vue) {
  let instance = null;

  let can=function(...args) {
    return instance.can(...args);
  }
  let ability=function(value) {
    instance=value;
  }

  Vue.$ability = ability;
  Vue.$can = can;

  Object.defineProperty(Vue.prototype, '$ability', {
    value: ability
  });
  Object.defineProperty(Vue.prototype, '$can', {
    value: can
  });
}

export default abilitiesPlugin;