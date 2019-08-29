import treeSelect from './src/index.vue';
treeSelect.install = function(Vue) {
    Vue.component(treeSelect.name, treeSelect);
};
export default treeSelect;
