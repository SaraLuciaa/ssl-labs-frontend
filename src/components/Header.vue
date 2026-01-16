<template>
  <header>
    <div class="logo-container">
      <img
        @click="reload"
        src="/public/logo.png"
        alt="Vortex Logo"
        class="logo"
      />
      <h1><span>Vor</span>tex</h1>
    </div>

    <Button @click="handleHistory">Historial</Button>
  </header>
</template>

<script>
import Button from "./Button.vue"; 

export default {
  name: "Header",
  components: {
    Button,
  },
  methods: {
    reload() {
      location.reload();
    },
    handleHistory() {
      console.log("Ver historial");
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  background: var(--brand-top);
  top: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 2.5rem;
}

h1 {
  font-size: 1.5rem;
  color: var(--brand-principal);
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

h1 span {
  color: var(--brand-secundary);
  font-weight: 700;
}
</style>
