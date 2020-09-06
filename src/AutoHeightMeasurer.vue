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
    };
  },
  updated() {
    if (this.observer) {
      this.observer.observe(this.$el);
    }
  },
  mounted() {
    this.observer = new ResizeObserver(() => {
      this.$emit('height', {
        index: this.index,
        height: this.$el.offsetHeight,
      });
    });
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
