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
        <template #item="{ item, index }">
            <slot
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
  },
  data() {
    return {
      flattenedItems: [],
    };
  },
  watch: {
    items: {
      immediate: true,
      handler() {
        this.flattenedItems = getFlattenedItems({ items: this.items });
      },
    },
  },
};
</script>
