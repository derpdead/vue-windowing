<template>
    <div
        class="virtual-scroll"
        ref="root"
        :style="rootStyle"
        @scroll="onScroll">
        <div
            class="virtual-scroll__viewport"
            :style="viewportStyle">
            <div
                class="virtual-scroll__spacer"
                :style="spacerStyle">
                <AutoHeightMeasurer
                    v-for="(item, index) in visibleItems"
                    :key="index + startNode"
                    :index="index + startNode"
                    @height="onMeasuredHeight">
                    <slot
                        name="item"
                        :item="item"
                        :index="index + startNode" />
                </AutoHeightMeasurer>
            </div>
        </div>
    </div>
</template>

<script>
import AutoHeightMeasurer from './AutoHeightMeasurer.vue';

export default {
  name: 'VirtualScroll',
  components: {
    AutoHeightMeasurer,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
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
      scrollTop: 0,
      cachedHeight: {},
    };
  },
  watch: {
    items() {
      this.cachedHeight = {};
    },
  },
  computed: {
    childPositions() {
      const results = [
        0,
      ];
      for (let i = 1; i < this.rowCount; i += 1) {
        results.push(results[i - 1] + (this.cachedHeight[i - 1] || this.estimatedHeight));
      }
      return results;
    },
    totalHeight() {
      const offset = this.cachedHeight[this.rowCount - 1] || this.estimatedHeight;

      return this.rowCount
        ? this.childPositions[this.rowCount - 1] + offset
        : 0;
    },
    fixedRootHeight() {
      return this.rootHeight > this.totalHeight
        ? this.totalHeight
        : this.rootHeight;
    },
    firstVisibleNode() {
      let startRange = 0;
      let endRange = this.rowCount ? this.rowCount - 1 : this.rowCount;

      while (endRange !== startRange) {
        const middle = Math.floor((endRange - startRange) / 2 + startRange);

        if (
          this.childPositions[middle] <= this.scrollTop
                    && this.childPositions[middle + 1] > this.scrollTop
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
    startNode() {
      return Math.max(0, this.firstVisibleNode - this.renderAhead);
    },
    lastVisibleNode() {
      const offset = this.childPositions[this.firstVisibleNode] + this.fixedRootHeight;
      let endNode;

      for (endNode = this.firstVisibleNode; endNode < this.rowCount; endNode += 1) {
        if (this.childPositions[endNode] > offset) {
          return endNode;
        }
      }
      return endNode;
    },
    endNode() {
      return Math.min(this.rowCount - 1, this.lastVisibleNode + this.renderAhead);
    },
    visibleNodeCount() {
      return this.endNode - this.startNode + 1;
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
    rootStyle() {
      return {
        height: `${this.fixedRootHeight}px`,
      };
    },
  },
  methods: {
    onMeasuredHeight({
      index,
      height,
    }) {
      this.cachedHeight = {
        ...this.cachedHeight,
        [index]: height,
      };
    },
    onScroll() {
      window.requestAnimationFrame(() => {
        this.scrollTop = this.$refs.root.scrollTop;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.virtual-scroll {
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
