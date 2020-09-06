<script>
import Vue from 'vue';
import ExpandingList from '@/ExpandingList';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    ExpandingList,
  },
  data() {
    return {
      expandedGroup: -1,
      items: {
        number: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          4,
          21,
          3,
          213,
          32,
          123,
          312,
          231,
          321,
          321,
          321,
          321,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          4,
          21,
          3,
          213,
          32,
          123,
          312,
          231,
          321,
          321,
          321,
          321,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          4,
          21,
          3,
          213,
          32,
          123,
          312,
          231,
          321,
          321,
          321,
          321,
        ],
        string: [],
      },
      title: 'Take an action',
    };
  },
  methods: {
    onExpandGroup(key) {
      this.expandedGroup = key;

      if (key === 'string') {
        this.items.string = [
          'ads',
          'add',
          'asasa',
          'dasasd',
          'adsadsdsa',
          '12asdasdsad',
          'ads',
          'add',
          'asasa',
          'dasasd',
          'adsadsdsa',
          '12asdasdsad',
          'ads',
          'add',
          'asasa',
          'dasasd',
          'adsadsdsa',
          '12asdasdsad',
          'ads',
          'add',
          'asasa',
          'dasasd',
          'adsadsdsa',
          '12asdasdsad',
        ];
      }
    },
  },
});
</script>

<template>
  <div id="app">
    <ExpandingList
      :items="items"
      :expanded-item="expandedGroup"
      @expand="onExpandGroup">
      <template #group="{ item }">
        <span v-text="item" />
      </template>
      <template #item="{ item }">
        <li v-text="item" />
      </template>
    </ExpandingList>
  </div>
</template>
