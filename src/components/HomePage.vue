<template>
  <Layout>
    <template #header>
      <Header />
    </template>
    <template #body>
      <Body />
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
};
</script>
