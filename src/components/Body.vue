<template>
  <main class="body-container">
    <div class="content">
      <h2 class="title">Analiza la seguridad de sitios web</h2>
      <p class="description">mediante el diagnóstico detallado de configuraciones SSL/TLS.</p>
      <SearchBar :loading="isLoading" @search="handleSearch" />
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <ResultsDisplay v-if="currentAnalysisData" :analysis="currentAnalysisData" />
    </div>
  </main>
</template>

<script>
import SearchBar from './SearchBar.vue';
import ResultsDisplay from './ResultsDisplay.vue';
import sslAnalysisService from '../services/analysisService.js';

export default {
  name: 'Body',
  components: {
    SearchBar,
    ResultsDisplay,
  },
  props: {
    analysisData: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:analysisData'],
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    currentAnalysisData() {
      return this.analysisData;
    },
  },
  methods: {
    async handleSearch(host) {
      this.isLoading = true;
      this.error = null;
      this.$emit('update:analysisData', null);
      
      try {
        const response = await sslAnalysisService.startAnalysis(host);
        
        const analysisId = response.id || response.analysis?.id;
        if (!analysisId) {
          throw new Error('No se recibió ID del análisis');
        }
        
        const result = await sslAnalysisService.pollAnalysis(
          analysisId,
          (data) => {
            this.$emit('update:analysisData', data.analysis || data);
          }
        );
        
        this.$emit('update:analysisData', result.analysis || result);
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
    max-width: 60%;
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
</style>