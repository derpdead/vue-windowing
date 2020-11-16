<script>
export default {
  name: 'AutoHeightMeasurer',
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      observer: null,
      isObserving: false,
    };
  },
  updated() {
    if (this.observer) {
      this.observer.observe(this.$el);
      this.isObserving = true;
    }
  },
  mounted() {
    this.observer = new ResizeObserver(([entry]) => {
      this.$emit('height', {
        index: this.index,
        height: entry.contentRect.height,
      });
    });

    if (!this.isObserving) {
      this.$emit('height', {
        index: this.index,
        height: this.$el.offsetHeight,
      });
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  render() {
    if (this.$scopedSlots && this.$scopedSlots.default) {
      return this.$scopedSlots.default();
    }

    return null;
  },
};
</script>
