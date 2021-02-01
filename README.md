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
        <template #header>
            <!-- Might be added sticky / floating header -->
        </template>
        <template #body>
            <!-- Might be added custom body which will overwrite DOM virtualization - useful for presenting placeholders in case that there is no data -->
        </template>
        <template #item="{ item, index }">
            <div v-text="item" />
        </template>
        <template #footer>
            <!-- Might be added sticky / floating footer -->
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

Wrapper for VirtualScroll. It adds simple functionality of flattening passed items. Allowing to render tree data structures.

Example: 

```vue
<template>
    <NestedList
        style="height: 200px"
        :items="items"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight">
        <template #header>
            <!-- Might be added sticky / floating header -->
        </template>
        <template #body>
            <!-- Might be added custom body which will overwrite DOM virtualization - useful for presenting placeholders in case that there is no data -->
        </template>
        <template #item="{ item, index }">
            <div v-text="item" />
        </template>
        <template #footer>
            <!-- Might be added sticky / floating footer -->
        </template>
    </NestedList>
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    id: 'root',
                    children: [
                        {
                            id: 'firstLevel - 1',
                            children: [
                                {
                                    id: 'secondLevel - 1',
                                }
                            ],
                        },
                        {
                            id: 'firstLevel - 2',
                        }
                    ]
                }
            ],
            renderAhead: 2, // Buffer, +2 at top / bottom in queue
            estimatedHeight: 20, // We need to assume that there is some default height for each row which will be recalculated later
        };       
    },
}
</script>
```

## ExpandingList

Wrapper for VirtualScroll. It adds simple functionality of flattening passed items and toggling visibility of groups. Allowing to render tree data structures. 

Example: 

```vue
<template>
    <ExpandingList
        style="height: 200px"
        :items="items"
        :render-ahead="renderAhead"
        :estimated-height="estimatedHeight"
        @expand="onExpandGroup">
        <template #header>
            <!-- Might be added sticky / floating header -->
        </template>
        <template #body>
            <!-- Might be added custom body which will overwrite DOM virtualization - useful for presenting placeholders in case that there is no data -->
        </template>
        <template #item="{ item, onExpand }">
            <div v-text="item" @click="onExpand(item)" />
        </template>
        <template #footer>
            <!-- Might be added sticky / floating footer -->
        </template>
    </ExpandingList>
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    id: 'root',
                    children: [
                        {
                            id: 'firstLevel - 1',
                            children: [
                                {
                                    id: 'secondLevel - 1',
                                }
                            ],
                        },
                        {
                            id: 'firstLevel - 2',
                        }
                    ]
                }
            ],
            renderAhead: 2, // Buffer, +2 at top / bottom in queue
            estimatedHeight: 20, // We need to assume that there is some default height for each row which will be recalculated later
        };       
    },
    methods: {
        onExpandGroup(item) {
            // We might want to asynchronously prefetch data for expanded group
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
| expanded | the flag which toggles between state of all items - only for ExpandingList    |    '' |

Events:

- expand: click event for group element which toggles between visible state of group items - only for ExpandingList

## Tips

> :x: Do not use margin directly for styling node items! Height won't be measured well.

> :information_source: Each virtualized component by default will fully expand, to make things happening you either have to set height / max-height of component or by implementing dynamic height content with flexbox / grid.

## License

[MIT](http://opensource.org/licenses/MIT)
