<template>
  <div v-if="analysis" class="container">
    <div class="container">
        <div class="header">
            <h3>{{ analysis.host }}</h3>
            <span class="status" :class="statusClass">
            {{ getStatusText(analysis.status) }}
            </span>
        </div>

        <div class="body">
            <div class="column">
            <div class="info-item">
                <span>Versión de criterios: {{ analysis.criteria_version }}</span>
            </div>
            <div class="info-item">
                <span>Versión del motor: {{ analysis.engine_version }}</span>
            </div>
            
            </div>

            <div class="divider"></div>

            <div class="column">
            
            <div class="info-item">
                <span>Última actualización: {{ formatTime(analysis.test_time) }}</span>
            </div>
            <div class="info-item">
                <span>Fuente: SSL Labs</span>
            </div>
            </div>
        </div>
    </div>



    <div v-if="analysis.endpoints && analysis.endpoints.length > 0" class="endpoints-section">
        <h4>Endpoints ({{ analysis.endpoints.length }})</h4>
      
        <div class="endpoint-divider"></div>
        <div v-for="(endpoint, index) in analysis.endpoints" :key="index">
            <div class="endpoint-divider" v-if="index > 0"></div>
            
            <div class="container">
            <div class="header">
                <h3>{{ endpoint.ip_address }} </h3>

                <span v-if="endpoint.server_name" class="server-name">{{ endpoint.server_name }}</span>

                <div v-if="endpoint.status_message" class="status">
                    <template v-if="endpoint.progress >= 0">
                        {{ endpoint.progress }}% 
                    </template>
                    <template v-else>
                        {{ endpoint.status_message }}
                    </template>
                </div>
            </div>

            
            <div v-if="endpoint.details" class="endpoint">
                <div v-if="endpoint.details.cert">
                    <h5>Certificado SSL</h5>
                    <div class="cert-validity">
                        <span v-if="isCertValid(endpoint.details.cert)" class="cert-valid">
                            ✓ Válido - {{ getDaysRemaining(endpoint.details.cert) }} días restantes
                        </span>
                        <span v-else class="cert-invalid">
                            ✗ Inválido o expirado
                        </span>
                    </div>
                </div>

                <span v-if="endpoint.grade" class="grade">
                    {{ endpoint.grade }}
                </span>

                <div v-if="endpoint.details.protocols">
                    <h5>Protocolos</h5>
                    <div class="protocols-list">
                    <span 
                        v-for="protocol in endpoint.details.protocols" 
                        :key="protocol.id"
                        class="protocol-badge"
                    >
                    {{ protocol.name }} {{ protocol.version }}
                    </span>
                    </div>
                </div>
            </div>

            <div v-if="endpoint.details" class="vulnerabilities-hsts">
                <div class="vuln-section">
                    <h5>Análisis de Vulnerabilidades</h5>
                    <div class="vuln-grid">
                        <div class="vuln-item" :class="getVulnClass(endpoint.details.heartbleed)">
                            <span class="vuln-name">Heartbleed</span>
                            <span class="vuln-result">{{ getVulnStatus(endpoint.details.heartbleed) }}</span>
                        </div>
                        <div class="vuln-item" :class="getVulnClass(endpoint.details.poodle)">
                            <span class="vuln-name">POODLE</span>
                            <span class="vuln-result">{{ getVulnStatus(endpoint.details.poodle) }}</span>
                        </div>
                        <div class="vuln-item" :class="getVulnClass(endpoint.details.freak)">
                            <span class="vuln-name">FREAK</span>
                            <span class="vuln-result">{{ getVulnStatus(endpoint.details.freak) }}</span>
                        </div>
                        <div class="vuln-item" :class="getVulnClass(endpoint.details.logjam)">
                            <span class="vuln-name">Logjam</span>
                            <span class="vuln-result">{{ getVulnStatus(endpoint.details.logjam) }}</span>
                        </div>
                        <div class="vuln-item" :class="getVulnClass(endpoint.details.open_ssl_ccs)">
                            <span class="vuln-name">OpenSSL CCS</span>
                            <span class="vuln-result">{{ getVulnStatus(endpoint.details.open_ssl_ccs) }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="endpoint.details.hstsPolicy" class="hsts-section">
                    <h5>Política HSTS</h5>
                    <div class="hsts-grid">
                        <div class="hsts-item">
                            <span class="hsts-label">Estado:</span>
                            <span class="hsts-value" :class="getHstsClass(endpoint.details.hstsPolicy.status)">
                                {{ getHstsStatus(endpoint.details.hstsPolicy.status) }}
                            </span>
                        </div>
                        <div class="hsts-item">
                            <span class="hsts-label">Incluye subdominios:</span>
                            <span class="hsts-value">{{ endpoint.details.hstsPolicy.includeSubDomains ? '✓ Sí' : '✗ No' }}</span>
                        </div>
                        <div class="hsts-item">
                            <span class="hsts-label">Precarga:</span>
                            <span class="hsts-value">{{ endpoint.details.hstsPolicy.preload ? '✓ Sí' : '✗ No' }}</span>
                        </div>
                    </div>
                    <div v-if="getPresentPreloads(endpoint.details.hstsPreloads).length > 0" class="preloads-section">
                        <span class="preloads-title">Precargado en:</span>
                        <div class="preloads-list">
                            <span v-for="(preloadName, idx) in getPresentPreloads(endpoint.details.hstsPreloads)" :key="idx" class="preload-badge">
                                {{ preloadName }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>

    <div v-else-if="analysis.status === 'IN_PROGRESS' || analysis.status === 'DNS'" class="loading-message">
        <p>{{ getLoadingMessage(analysis.status) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultsDisplay",
  props: {
    analysis: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statusClass() {
      const status = this.analysis.status;
      return {
        'status-dns': status === 'DNS',
        'status-progress': status === 'IN_PROGRESS',
        'status-ready': status === 'READY',
        'status-error': status === 'ERROR',
      };
    },
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        'DNS': 'Resolviendo DNS',
        'IN_PROGRESS': 'Análisis en Progreso',
        'READY': 'Completado',
        'ERROR': 'Error',
      };
      return statusMap[status] || status;
    },
    
    getLoadingMessage(status) {
      const messages = {
        'DNS': 'Resolviendo dirección DNS...',
        'IN_PROGRESS': 'Analizando configuración SSL/TLS...',
      };
      return messages[status] || 'Procesando...';
    },
    
    formatTime(timestamp) {
      if (!timestamp) return 'N/A';
      return new Date(timestamp).toLocaleString();
    },
    
    isCertValid(cert) {
      if (!cert || !cert.notBefore || !cert.notAfter) return false;
      const now = Date.now();
      const notBefore = cert.notBefore;
      const notAfter = cert.notAfter;
      return now >= notBefore && now <= notAfter;
    },
    
    getDaysRemaining(cert) {
      if (!cert || !cert.notAfter) return 0;
      const now = Date.now();
      const notAfter = cert.notAfter;
      const msPerDay = 24 * 60 * 60 * 1000;
      const daysRemaining = Math.floor((notAfter - now) / msPerDay);
      return daysRemaining > 0 ? daysRemaining : 0;
    },
    
    getVulnClass(vulnerable) {
      return {
        'vuln-safe': !vulnerable,
        'vuln-vulnerable': vulnerable,
      };
    },
    
    getVulnStatus(vulnerable) {
      return vulnerable ? 'Vulnerable' : 'Seguro';
    },
    
    getHstsClass(status) {
      return {
        'hsts-present': status === 'present',
        'hsts-absent': status === 'absent',
      };
    },
    
    getHstsStatus(status) {
      const statusMap = {
        'present': '✓ Presente',
        'absent': '✗ Ausente',
      };
      return statusMap[status] || status;
    },
    
    getPresentPreloads(preloads) {
      if (!preloads || !Array.isArray(preloads)) return [];
      return preloads
        .filter(p => p.status === 'present')
        .map(p => p.source);
    },
  },
};
</script>

<style scoped>
.container {
  background: var(--brand-top);
  border-radius: 0.8rem;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.endpoint-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brand-secundary) 20%, var(--brand-secundary) 80%, transparent);
  margin: 2rem 0;
  opacity: 0.3;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--brand-secundary);
}

.header h3 span {
    font-weight: 500;
    font-size: 0.9rem;
}

.status {
  padding: 0.3rem 1rem;
  border-radius: 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--brand-top);
  background-color: var(--brand-secundary);
}

.body {
  display: flex;
  align-items: center;
  gap: 24px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.divider {
  width: 2px;
  height: 44px;
  background: #e5e7eb;
  border-radius: 2px;
}

.info-item {
  display: flex;
  gap: 6px;
  font-size: 0.85rem;
}

.endpoint {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
}


.cert-validity {
    margin-top: 0.5rem;
}

.cert-valid {
    color: #22c55e;
    font-weight: 600;
    font-size: 0.875rem;
}

.cert-invalid {
    color: #ef4444;
    font-weight: 600;
    font-size: 0.875rem;
}

.grade {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 6rem;
    height: 6rem;
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--brand-principal) 20%, transparent);
    color: var(--brand-principal);
}

h5 {
    margin: 0.5rem;
    padding: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--brand-secundary);
}

h4 {
    margin: 0;
    padding: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--brand-secundary);
}

p {
    margin: 0;
    padding: 0;
}

.protocol-badge {
    border-radius: 0.8rem;
    border: 1px solid var(--brand-principal);
    padding: 0.2rem 0.6rem;
}

.detail-section {
    min-width: 50%;
}

.vulnerabilities-hsts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1rem;
}

.vuln-section, .hsts-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.vuln-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.vuln-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background-color: color-mix(in srgb, var(--brand-secundary) 5%, transparent);
    gap: 0.5rem;
}

.vuln-safe {
    background-color: color-mix(in srgb, #22c55e 5%, transparent);
}

.vuln-vulnerable {
    background-color: color-mix(in srgb, #ef4444 5%, transparent);
}

.vuln-name {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--text-primary);
}

.vuln-result {
    font-size: 0.8rem;
    font-weight: 500;
}

.vuln-safe .vuln-result {
    color: #22c55e;
}

.vuln-vulnerable .vuln-result {
    color: #ef4444;
}

.hsts-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.hsts-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.hsts-item:last-child {
    border-bottom: none;
}

.hsts-label {
    font-size: 0.875rem;
    color: var(--text-primary);
}

.hsts-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--brand-secundary);
}

.hsts-present {
    color: #22c55e !important;
}

.hsts-absent {
    color: #ef4444 !important;
}

.preloads-section {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid color-mix(in srgb, var(--brand-secundary) 10%, transparent);
}

.preloads-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--brand-secundary);
    display: block;
    margin-bottom: 0.5rem;
}

.preloads-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
}

.preload-badge {
    background-color: color-mix(in srgb, var(--brand-principal) 15%, transparent);
    color: var(--brand-principal);
    padding: 0.3rem 0.8rem;
    border-radius: 0.8rem;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid var(--brand-principal);
}
</style>
