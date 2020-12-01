<template>
    <ResizeObserver @resize="onResize">
        <slot />
    </ResizeObserver>
</template>

<script>

import ResizeObserver from './ResizeObserver.vue';

export default {
  name: 'AutoHeightMeasurer',
  components: {
    ResizeObserver,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onResize(entry) {
      const { height } = entry.contentRect;

      if (height !== this.height && height !== 0) {
        this.$emit('height', {
          index: this.index,
          height,
        });
      }
    },
  },
};
</script>
