<template>
  <Layout>
    <template #header>
      <Header 
        :currentPage="currentPage"
        @navigate="$emit('navigate', $event)"
      />
    </template>
    <template #body>
      <Body 
        :analysisData="analysisData"
        @update:analysisData="$emit('update:analysisData', $event)"
      />
    </template>
  </Layout>
</template>

<script>
import Layout from "./Layout.vue";
import Header from "./Header.vue";
import Body from "./Body.vue";

export default {
  name: "HomePage",
  components: {
    Layout,
    Header,
    Body,
  },
  props: {
    currentPage: {
      type: String,
      default: 'home',
    },
    analysisData: {
      type: Object,
      default: null,
    },
  },
  emits: ['navigate', 'update:analysisData'],
};
</script>
