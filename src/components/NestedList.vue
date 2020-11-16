<template>
    <VirtualScroll
        :items="flattenedItems"
        :root-height="rootHeight"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #item="{ item, index}">
            <slot
                v-if="headers[index]"
                name="group"
                :item="item" />
            <slot
                v-else
                name="item"
                :index="index"
                :item="item" />
        </template>
    </VirtualScroll>
</template>

<script>
import VirtualScroll from './VirtualScroll.vue';

export default {
  name: 'NestedList',
  components: {
    VirtualScroll,
  },
  props: {
    items: {
      type: Object,
      default: () => ({}),
    },
    rootHeight: {
      type: Number,
      default: 400,
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
      headers: {},
    };
  },
  computed: {
    flattenedItems() {
      let items = [];

      Object.keys(this.items).forEach((key) => {
        this.headers[items.length] = key;

        if (Array.isArray(this.items[key])) {
          // Flattening structure
          items = [
            ...items,
            key,
            ...this.items[key],
          ];
        } else {
          // Nesting
          items.push(key);
        }
      });

      return items;
    },
  },
};
</script>
