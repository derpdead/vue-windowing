# vue-windowing

Set of components used for virtualizing DOM.

# Installation

```
npm install --save vue-windowing
```

## Import

Install all as a plugin:

```javascript
import Vue from 'vue'
import ViewWindowing from 'vue-windowing';

Vue.use(ViewWindowing)
```

Install only those which you want:

```javascript
import Vue from 'vue'
import {
    VirtualScroll,
    // ...
    NestedList,
} from 'vue-windowing';

Vue.component(VirtualScroll, 'VirtualScroll');
Vue.component(NestedList, 'NestedList');
```

# Usage

There are several components used for DOM virtualization:

## VirtualScroll

Component used for virtualizing vertical scrolling elements. It may handle dynamic height elements calculated on fly by AutoHeightMeasurer.

Example:

```vue
<template>
    <VirtualScroll
        style="height: 200px"
        :items="items"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #item="{ item, index}">
            <div v-text="item" />
        </template>
    </VirtualScroll>
</template>

<script>
export default {
    data() {
        return {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            renderAhead: 2, // Buffer, +2 at top / bottom in queue
            estimatedHeight: 20, // We need to assume that there is some default height for each row which will be recalculated later
        };       
    },
}
</script>
```

## NestedList

Wrapper for VirtualScroll. It adds simple functionality of flattening passed items.

Example: 

```vue
<template>
    <NestedList
        style="height: 200px"
        :items="items"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #group="{ item, index }">
            <h3 v-text="item" />
        </template>
        <template #item="{ item, index }">
            <div v-text="item" />
        </template>
    </NestedList>
</template>

<script>
export default {
    data() {
        return {
            items: {
                numberGroup: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                stringGroup: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
            },
            renderAhead: 2, // Buffer, +2 at top / bottom in queue
            estimatedHeight: 20, // We need to assume that there is some default height for each row which will be recalculated later
        };       
    },
}
</script>
```

## ExpandingList

Wrapper for VirtualScroll. It adds simple functionality of flattening passed items and toggling visibility of groups.

Example: 

```vue
<template>
    <ExpandingList
        style="height: 200px"
        :items="items"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight"
        :expanded-group="expandedGroup"
        @expand="onExpandGroup">
        <template #group="{ item, index }">
            <div v-text="item" />
        </template>
        <template #item="{ item, index }">
            <div v-text="item" />
        </template>
    </ExpandingList>
</template>

<script>
export default {
    data() {
        return {
            items: {
                numberGroup: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                stringGroup: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
            },
            renderAhead: 2, // Buffer, +2 at top / bottom in queue
            estimatedHeight: 20, // We need to assume that there is some default height for each row which will be recalculated later
            expandedGroup: '',
        };       
    },
    methods: {
        onExpandGroup(group) {
            // You may fetch data here and mutate items object
            // this.items[group] = ['a', 'b', 'c', 'd'];

            this.expandedGroup = group;
        }
    }   
}
</script>
```

Props:

| Prop name        | Description           | Default value  |
| ------------- |:-------------:| -----:|
| items      | list of items | [] or {} for Nested/Expanding List |
| renderAhead | number of buffered items at the top/bottom      |    2 |
| estimatedHeight | approximated value of each row height      |    30 |
| expandedGroup | key of expanded group - only for ExpandingList    |    '' |

Events:

- expand: click event for group element which toggles between visible state of group items - only for ExpandingList

### Tips

Do not use margin directly for styling node items! Height won't be measured well.
{: .alert .alert-danger}

Each virtualized component by default will expand height by 100%, to override it and make things happening you either have to set height / max-height of component or by implementing dynamic height content with flexbox / grid. 
{: .alert .alert-info}

## License

[MIT](http://opensource.org/licenses/MIT)

<style>
.alert-info {
  color: rgb(49,112,143) !important;
}

.alert-green {
  color: rgb(60,118,61) !important;
}

.alert-danger {
  color: rgb(169,68,66) !important;
}
</style>
