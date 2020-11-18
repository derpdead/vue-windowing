<script>
export default {
  name: 'AutoHeightMeasurer',
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
  data() {
    return {
      observer: null,
      isObserving: false,
    };
  },
  updated() {
    if (this.observer && !this.isObserving) {
      this.observer.observe(this.$el);
      this.isObserving = true;
    }
  },
  mounted() {
    this.observer = new ResizeObserver(([entry]) => {
      this.onHeightChange(entry.contentRect.height);
    });

    if (!this.isObserving) {
      this.onHeightChange(this.$el.offsetHeight);
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
  methods: {
    onHeightChange(height) {
      if (height !== this.height
        && height !== 0) {
        this.$emit('height', {
          index: this.index,
          height,
        });
      }
    },
  },
};
</script>
