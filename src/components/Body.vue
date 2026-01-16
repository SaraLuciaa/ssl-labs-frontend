<template>
  <main class="body-container">
    <div class="content">
      <h2 class="title">Analiza la seguridad de sitios web</h2>
      <p class="description">mediante el diagnóstico detallado de configuraciones SSL/TLS.</p>
      <SearchBar />
    </div>
  </main>
</template>

<script>
import SearchBar from './SearchBar.vue';

export default {
  name: 'Body',
  components: {
    SearchBar,
  },
};
</script>

<style scoped>  
.body-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.content {
  width: 100%;
  max-width: 80%;
  text-align: center;
}

@media (min-width: 1024px) {
  .content {
    max-width: 50%;
  }
}

.title {
  font-size: 2rem;
  color: var(--brand-secundary);
  margin: 0;
  font-weight: 700;
}

.description {
  font-size: 1rem;
  color: var(--text-primary);
  margin-top: 0.5rem;
  margin-bottom: 0;
}
</style>