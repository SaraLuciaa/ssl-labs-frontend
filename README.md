# Vortex

Vortex analiza la seguridad de sitios web mediante el diagnóstico detallado de configuraciones SSL/TLS. Utiliza la API de SSL Labs para proporcionar información completa sobre certificados, protocolos, vulnerabilidades y políticas de seguridad.

## Configuración del Proyecto

### Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn
- Backend de Vortex corriendo (ver repositorio del backend)

## Como correr el proyecto

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:8081
```

4. Corre la aplicación en modo desarollo

```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`