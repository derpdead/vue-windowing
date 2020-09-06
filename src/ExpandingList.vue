<template>
    <VirtualScroll
        :items="flattenedItems"
        :root-height="rootHeight"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #item="{ item, index}">
            <div
                v-if="typeof headers[item] !== 'undefined'"
                @click="onExpandGroup(item)">
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
    expandedGroup: {
      type: [
        String,
        Number,
      ],
      default: '',
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
        this.headers[key] = items.length;

        if (Array.isArray(this.items[key]) && key === this.expandedGroup) {
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
    onExpandGroup(key) {
      this.$emit('expand', this.expandedGroup === key ? '' : key);
    },
  },
};
</script>
