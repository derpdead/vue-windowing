<template>
    <VirtualScroll
        :items="expandedItems"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #header>
            <slot name="header" />
        </template>
        <template #body>
            <slot name="body" />
        </template>
        <template #item="{ item, index }">
            <slot
                name="item"
                :index="index"
                :item="item"
                :on-expand="onExpandItem" />
        </template>
        <template #footer>
            <slot name="footer" />
        </template>
    </VirtualScroll>
</template>

<script>
import { getExpandingFlattenedItems } from '../utils';
import VirtualScroll from './VirtualScroll.vue';

export default {
  name: 'ExpandingList',
  components: {
    VirtualScroll,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    renderAhead: {
      type: Number,
      default: 2,
    },
    estimatedHeight: {
      type: Number,
      default: 30,
    },
    expanded: {
      type: [Object, Boolean],
      default: false,
    },
  },
  data() {
    return {
      flattenedItems: [],
    };
  },
  computed: {
    expandedItems() {
      const expandedItems = [];
      const expandedParents = {};

      this.flattenedItems.forEach((item) => {
        if (typeof expandedParents[item.id] !== 'undefined') {
          delete expandedParents[item.id];
        }

        if (item.expanded) {
          expandedParents[item.id] = true;
        }

        if (expandedParents[item.rootId] || item.level === 0) {
          expandedItems.push(item);
        }
      });

      return expandedItems;
    },
  },
  mounted() {
    this.$watch((vm) => [vm.items, vm.expanded], ([items, expanded]) => {
      this.flattenedItems = getExpandingFlattenedItems({
        items,
        expanded,
      });
    }, {
      immediate: true,
    });
  },
  methods: {
    onExpandItem(item) {
      const itemIndex = this.flattenedItems.findIndex(({
        id,
        rootId,
      }) => id === item.id && rootId === item.rootId);

      if (itemIndex !== -1) {
        this.flattenedItems[itemIndex].expanded = !this.flattenedItems[itemIndex].expanded;

        if (!this.flattenedItems[itemIndex].expanded) {
          let i = itemIndex + 1;

          while (i < this.flattenedItems.length - 1
            && this.flattenedItems[i].level > this.flattenedItems[itemIndex].level) {
            this.flattenedItems[i].expanded = false;

            i += 1;
          }
        }

        this.$emit('expand', item);
      }
    },
  },
};
</script>
