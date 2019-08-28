import elTreeSelect from './src/index.vue';

elTreeSelect.install = function(Vue) {
  Vue.component(elTreeSelect.name, elTreeSelect);
};

export default elTreeSelect;
