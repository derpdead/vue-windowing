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
  updated() {
    if (this.$el) {
      this.onHeightChange(this.$el.offsetHeight);
    }
  },
  methods: {
    onHeightChange(height) {
      if (height !== this.height && height !== 0) {
        this.$emit('height', {
          index: this.index,
          height,
        });
      }
    },
  },
  mounted() {
    this.onHeightChange(this.$el.offsetHeight);
  },
  render() {
    return this.$scopedSlots.default();
  },
};
</script>
