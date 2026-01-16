<template>
  <main class="body-container">
    <div class="content">
      <h2 class="title">Analiza la seguridad de sitios web</h2>
      <p class="description">mediante el diagnóstico detallado de configuraciones SSL/TLS.</p>
      <SearchBar :loading="isLoading" @search="handleSearch" />
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-if="analysisData" class="result">
        <pre>{{ analysisData }}</pre>
      </div>
    </div>
  </main>
</template>

<script>
import SearchBar from './SearchBar.vue';
import sslAnalysisService from '../services/analysisService.js';

export default {
  name: 'Body',
  components: {
    SearchBar,
  },
  data() {
    return {
      isLoading: false,
      analysisData: null,
      error: null,
    };
  },
  methods: {
    async handleSearch(host) {
      this.isLoading = true;
      this.error = null;
      this.analysisData = null;
      
      try {
        const { id } = await sslAnalysisService.startAnalysis(host);
        
        const result = await sslAnalysisService.pollAnalysis(
          id,
          (data) => {
            this.analysisData = data;
          }
        );
        
        this.analysisData = result;
      } catch (err) {
        this.error = err.message;
        console.error('Error:', err);
      } finally {
        this.isLoading = false;
      }
    },
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

.error-message {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fee;
  color: #c33;
  border-radius: 0.8rem;
}

.result {
  margin-top: 2rem;
  text-align: left;
  max-width: 100%;
  overflow-x: auto;
}
</style>