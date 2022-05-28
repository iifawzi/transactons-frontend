import Vue from 'vue';
export default (context, inject) => {
  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
  inject('debounce', debounce)
  Vue.prototype.debounce = debounce;
}