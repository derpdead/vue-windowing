import VirtualScroll from '@/VirtualScroll.vue';
import AutoHeightMeasurer from '@/AutoHeightMeasurer.vue';
import ExpandingList from '@/ExpandingList.vue';
import NestedList from '@/NestedList.vue';

export {
  VirtualScroll,
  AutoHeightMeasurer,
  ExpandingList,
  NestedList,
};

function registerComponents(Vue) {
  Vue.component('virtual-scroll', VirtualScroll);
  Vue.component('VirtualScroll', VirtualScroll);
  Vue.component('auto-height-measurer', AutoHeightMeasurer);
  Vue.component('AutoHeightMeasurer', AutoHeightMeasurer);
  Vue.component('expanding-list', ExpandingList);
  Vue.component('ExpandingList', ExpandingList);
  Vue.component('nested-list', NestedList);
  Vue.component('NestedList', NestedList);
}

const plugin = {
  // eslint-disable-next-line no-undef
  version: '0.1.0',
  install(Vue) {
    registerComponents(Vue);
  },
};

export default plugin;

// Auto-install
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}
