<template>
    <IntersectionObserver @intersect="onIntersect">
        <ResizeObserver @resize="onResize">
            <div
                class="virtual-scroll"
                ref="root"
                @scroll="onScroll">
                <slot name="header" />
                <slot name="body">
                    <div
                        :style="viewportStyle"
                        class="virtual-scroll__viewport">
                        <div
                            :style="spacerStyle"
                            class="virtual-scroll__spacer">
                            <AutoHeightMeasurer
                                v-for="(item, index) in visibleItems"
                                :key="`${index + startNode} | ${item.id || item}`"
                                :index="index + startNode"
                                :height="cachedHeight[index + startNode] || estimatedHeight"
                                @height="onMeasuredHeight">
                                <slot
                                    name="item"
                                    :item="item"
                                    :index="index + startNode" />
                            </AutoHeightMeasurer>
                        </div>
                    </div>
                </slot>
                <slot name="footer" />
            </div>
        </ResizeObserver>
    </IntersectionObserver>
</template>

<script>
import ResizeObserver from './ResizeObserver.vue';
import AutoHeightMeasurer from './AutoHeightMeasurer.vue';
import IntersectionObserver from './IntersectionObserver.vue';

export default {
  name: 'VirtualScroll',
  components: {
    AutoHeightMeasurer,
    ResizeObserver,
    IntersectionObserver,
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
      height: 0,
      totalHeight: this.items.length * this.estimatedHeight,
      scrollTop: 0,
      cachedHeight: {},
      firstVisibleNode: 0,
      lastVisibleNode: 0,
      childPositions: {
        0: 0,
      },
    };
  },
  watch: {
    items(newValue, oldValue) {
      if (newValue.length !== oldValue.length) {
        const startNode = this.getFirstVisibleNode();
        const endNode = this.getLastVisibleNode(startNode);

        this.firstVisibleNode = startNode;
        this.lastVisibleNode = endNode;

        this.totalHeight = this.items.length * this.estimatedHeight;
        this.childPositions = {
          0: 0,
        };
        this.cachedHeight = {};
      }
    },
  },
  computed: {
    startNode() {
      return Math.max(0, this.firstVisibleNode - this.renderAhead);
    },
    endNode() {
      return Math.min(this.rowCount, this.lastVisibleNode + this.renderAhead);
    },
    visibleNodeCount() {
      return this.endNode - this.startNode;
    },
    offsetY() {
      return this.childPositions[this.startNode];
    },
    visibleItems() {
      return this.items.slice(
        this.startNode,
        this.startNode + this.visibleNodeCount,
      );
    },
    rowCount() {
      return this.items.length;
    },
    spacerStyle() {
      return {
        transform: `translateY(${this.offsetY}px)`,
      };
    },
    viewportStyle() {
      return {
        height: `${this.totalHeight}px`,
      };
    },
    fixedHeight() {
      return this.height > this.totalHeight
        ? this.totalHeight
        : this.height;
    },
  },
  mounted() {
    requestAnimationFrame(() => {
      this.height = this.$el.offsetHeight;

      const start = 0;
      const end = Math.ceil((this.height * 2) / this.estimatedHeight);

      for (let i = start + 1; i < end + this.renderAhead; i += 1) {
        this.childPositions[i] = this.childPositions[i - 1] + this.estimatedHeight;
      }

      this.firstVisibleNode = start;
      this.lastVisibleNode = end;
    });
  },
  methods: {
    onIntersect(isIntersecting) {
      if (isIntersecting
        && this.firstVisibleNode !== 0
        && this.scrollTop > 0
        && this.scrollTop !== this.$refs.root.scrollTop) {
        window.requestAnimationFrame(() => {
          this.$refs.root.scrollTo(0, this.scrollTop);
        });
      }
    },
    onResize(entry) {
      this.height = entry.contentRect.height;
    },
    onMeasuredHeight({
      index,
      height,
    }) {
      const heightToAdd = height - this.estimatedHeight;

      this.totalHeight += heightToAdd;

      this.cachedHeight[index] = height;
      for (let i = this.startNode; i < this.endNode; i += 1) {
        const prevIndex = i - 1;

        const prevPosition = typeof this.childPositions[prevIndex] === 'undefined'
          ? prevIndex * this.estimatedHeight
          : this.childPositions[prevIndex];

        const position = prevPosition + (this.cachedHeight[prevIndex] || this.estimatedHeight);

        this.childPositions[i] = position;
      }
    },
    onScroll() {
      window.requestAnimationFrame(() => {
        this.scrollTop = this.$refs.root.scrollTop;

        const startNode = this.getFirstVisibleNode();
        const endNode = this.getLastVisibleNode(startNode);

        const offsetStart = Math.max(0, startNode - this.renderAhead);

        for (let i = offsetStart; i < endNode; i += 1) {
          const prevIndex = i - 1;

          const prevPosition = typeof this.childPositions[prevIndex] === 'undefined'
            ? prevIndex * this.estimatedHeight
            : this.childPositions[prevIndex];

          const position = prevPosition + (this.cachedHeight[prevIndex] || this.estimatedHeight);

          this.childPositions[i] = position;
        }

        this.firstVisibleNode = startNode;
        this.lastVisibleNode = endNode;
      });
    },
    getFirstVisibleNode() {
      let startRange = 0;
      let endRange = this.rowCount ? this.rowCount - 1 : this.rowCount;

      while (endRange !== startRange) {
        const middle = Math.floor((endRange - startRange) / 2 + startRange);

        if (
          (this.childPositions[middle] <= this.scrollTop
            && this.childPositions[middle + 1] > this.scrollTop)
        ) {
          return middle;
        }

        if (middle === startRange) {
          return endRange;
        }

        if (this.childPositions[middle] <= this.scrollTop) {
          startRange = middle;
        } else {
          endRange = middle;
        }
      }
      return this.rowCount;
    },
    getLastVisibleNode(startNode) {
      const offset = this.childPositions[startNode] + this.fixedHeight;
      let endNode;

      for (endNode = startNode; endNode < this.rowCount; endNode += 1) {
        if (typeof this.childPositions[endNode] === 'undefined') {
          return Math.min(startNode + this.visibleNodeCount, this.rowCount - 1);
        }

        if (this.childPositions[endNode] > offset) {
          return endNode;
        }
      }

      return endNode;
    },
  },
};
</script>

<style lang="scss" scoped>
.virtual-scroll {
    position: relative;
    overflow: auto;

    &__spacer {
        will-change: transform;
    }

    &__viewport {
        position: relative;
        width: 100%;
        will-change: transform;
        overflow: hidden;
    }
}
</style>
