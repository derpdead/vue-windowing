<template>
    <VirtualScroll
        :items="flattenedItems"
        :root-height="rootHeight"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #item="{ item, index}">
            <div
                v-if="headers[index]"
                @click="onExpandItem(headers[index])">
                <slot
                    name="group"
                    :item="item" />
            </div>
            <slot
                v-else
                name="item"
                :index="index"
                :item="item" />
        </template>
    </VirtualScroll>
</template>

<script>
import VirtualScroll from '@/VirtualScroll';

export default {
  name: 'ExpandingList',
  components: {
    VirtualScroll,
  },
  props: {
    items: {
      type: Object,
      default: () => ({}),
    },
    expandedItem: {
      type: [
        String,
        Number,
      ],
      default: -1,
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

        if (Array.isArray(this.items[key]) && key === this.expandedItem) {
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
  methods: {
    onExpandItem(key) {
      this.$emit('expand', this.expandedItem === key ? -1 : key);
    },
  },
};
</script>
