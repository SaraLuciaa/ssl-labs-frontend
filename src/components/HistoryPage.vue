<template>
  <main class="body-container">
    <div class="content">
      <h2 class="title">Analiza la seguridad de sitios web</h2>
      <p class="description">mediante el diagnóstico detallado de configuraciones SSL/TLS.</p>
      
      <div v-if="history.length === 0" class="empty-state">
        <p>No hay consultas en el historial</p>
      </div>
      
      <div v-else class="history-container">
        <div 
          v-for="(item, index) in history" 
          :key="index"
          class="history-item"
          @click="selectItem(item)"
        >
          <div class="history-item-header">
            <h3>{{ item.host }}</h3>
            <span class="history-item-date">{{ formatDate(item.timestamp) }}</span>
          </div>
          <div class="history-item-info">
            <span class="status-badge" :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
            <span v-if="item.endpoints" class="endpoints-count">
              {{ item.endpoints.length }} endpoint(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'HistoryPage',
  props: {
    history: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['select'],
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Ahora';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours}h`;
      if (diffDays < 7) return `Hace ${diffDays}d`;
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    getStatusClass(status) {
      return {
        'status-ready': status === 'READY',
        'status-error': status === 'ERROR',
        'status-progress': status === 'IN_PROGRESS' || status === 'DNS',
      };
    },
    getStatusText(status) {
      const statusMap = {
        'DNS': 'Resolviendo DNS',
        'IN_PROGRESS': 'En Progreso',
        'READY': 'Terminado',
        'ERROR': 'Error',
      };
      return statusMap[status] || status;
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
  text-align: center;
}

.description {
  font-size: 1rem;
  color: var(--text-primary);
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.empty-subtitle {
  font-size: 0.95rem !important;
  color: var(--text-secondary);
  opacity: 0.7;
}

.history-container {
  margin-top: 2rem;
}

.history-item {
  background: var(--brand-top);
  border-radius: 0.8rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.history-item:hover {
  border-color: var(--brand-secundary);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.history-item-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  word-break: break-all;
}

.history-item-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.history-item-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.status-badge {
  padding: 0.3rem 0.85rem;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: var(--brand-principal);
  color: var(--brand-top);
}

.endpoints-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
