<template>
    <VirtualScroll
        :items="flattenedItems"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #header>
            <slot name="header" />
        </template>
        <template #body>
            <slot name="body" />
        </template>
        <template #item="{ item, index}">
            <slot
                v-if="parents[index]"
                name="group"
                :item="item" />
            <slot
                v-else
                name="item"
                :index="index"
                :item="item" />
        </template>
        <template #footer>
            <slot name="footer" />
        </template>
    </VirtualScroll>
</template>

<script>
import { getFlattenedItems } from '../utils';
import VirtualScroll from './VirtualScroll.vue';

export default {
  name: 'NestedList',
  components: {
    VirtualScroll,
  },
  props: {
    items: {
      type: [Array, Object],
      default: () => ({}),
    },
    renderAhead: {
      type: Number,
      default: 2,
    },
    estimatedHeight: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      flattenedItems: [],
      parents: {},
    };
  },
  watch: {
    items: {
      immediate: true,
      handler() {
        const {
          flattenedItems,
          parents,
        } = getFlattenedItems(this.items);

        this.flattenedItems = flattenedItems;
        this.parents = parents;
      },
    },
  },
};
</script>
