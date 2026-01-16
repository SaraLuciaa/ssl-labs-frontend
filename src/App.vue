<script setup>
import { ref, onMounted } from 'vue';
import HomePage from './components/HomePage.vue';
import Layout from './components/Layout.vue';
import Header from './components/Header.vue';
import HistoryPage from './components/HistoryPage.vue';
import sslAnalysisService from './services/analysisService.js';

const currentPage = ref('home');
const searchHistory = ref([]);
const analysisData = ref(null);
const isLoadingHistory = ref(false);

const navigateTo = (page) => {
  currentPage.value = page;
  if (page === 'history') {
    loadHistory();
  }
};

const loadHistory = async () => {
  isLoadingHistory.value = true;
  try {
    const response = await sslAnalysisService.getHistory();
    searchHistory.value = Array.isArray(response) ? response : (response.analyses || response.data || []);
    
    searchHistory.value = searchHistory.value.map(item => ({
      host: item.host,
      status: item.status,
      endpoints: item.endpoints || [],
      timestamp: item.test_time || item.timestamp || Date.now(),
      data: item,
    })).slice(0, 10);
  } catch (err) {
    console.error('Error al cargar historial:', err);
    searchHistory.value = [];
  } finally {
    isLoadingHistory.value = false;
  }
};

const loadFromHistory = (item) => {
  analysisData.value = item.data;
  currentPage.value = 'home';
};

const updateAnalysisData = (data) => {
  analysisData.value = data;
  if (data && currentPage.value === 'history') {
    loadHistory();
  }
};

onMounted(() => {
  loadHistory();
});
</script>

<template>
  <HomePage 
    v-if="currentPage === 'home'"
    :currentPage="currentPage"
    :analysisData="analysisData"
    @navigate="navigateTo"
    @update:analysisData="updateAnalysisData"
  />
  
  <Layout v-else-if="currentPage === 'history'">
    <template #header>
      <Header 
        :currentPage="currentPage"
        @navigate="navigateTo"
      />
    </template>
    <template #body>
      <HistoryPage 
        :history="searchHistory"
        @select="loadFromHistory"
      />
    </template>
  </Layout>
</template>

<style scoped>
</style>
