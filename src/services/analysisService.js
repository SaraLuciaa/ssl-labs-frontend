const API_URL = import.meta.env.API_URL;

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

          if (data.analysis.status === "ready") {
            resolve(data);
          } else if (data.analysis.status === "error") {
            reject(new Error(data.message || "Análisis falló"));
          } else {
            setTimeout(poll, interval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },
};
