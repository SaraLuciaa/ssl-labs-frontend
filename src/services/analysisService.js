const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

export default {
  async startAnalysis(host) {
    const body = { "host": host };
    
    const response = await fetch(`${API_URL}/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error al iniciar análisis: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },

  async getAnalysisStatus(id) {
    const response = await fetch(`${API_URL}/analysis/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener estado: ${response.status}`);
    }

    return await response.json();
  },

  async pollAnalysis(id, onUpdate, interval = 5000) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const data = await this.getAnalysisStatus(id);
          
          if (onUpdate) {
            onUpdate(data);
          }

          const analysisStatus = data.analysis?.status?.toUpperCase();
          
          if (analysisStatus === "READY") {
            const allEndpointsReady = data.analysis.endpoints?.every(
              endpoint => endpoint.status_message === "Ready" || endpoint.progress === 100
            );
            
            if (allEndpointsReady || data.analysis.endpoints?.length === 0) {
              resolve(data);
              return;
            }
          } else if (analysisStatus === "ERROR" || analysisStatus === "UNABLE TO CONNECT TO THE SERVER") {
            reject(new Error(data.message || "Análisis falló"));
            return;
          }
          
          setTimeout(poll, interval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },

  async getHistory() {
    const response = await fetch(`${API_URL}/analysis`);

    if (!response.ok) {
      throw new Error(`Error al obtener historial: ${response.status}`);
    }

    return await response.json();
  },
};
