<template>
  <section class="search-section">
    <div class="search-container">
      <input
        v-model="localHostname"
        type="text"
        placeholder="Ingresa el host a analizar (ej: example.com)"
        class="search-input"
        @keyup.enter="handleSearch"
      />
        <Button @click="handleSearch" :disabled="loading">
        {{ loading ? "Analizando..." : "Analizar" }}
      </Button>
    </div>
  </section>
</template>

<script>
import Button from "./Button.vue";

export default {
  name: "SearchBar",
  components: {
    Button,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["search"],
  data() {
    return {
      localHostname: "",
    };
  },
  methods: {
    handleSearch() {
      if (this.localHostname.trim()) {
        this.$emit("search", this.localHostname.trim());
      }
    },
  },
};
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
}

.search-input {
  background: none;
  font-size: 1rem;
  border-radius: 0.8rem;
  border-color: var(--brand-secundary);
  outline: none;
  padding: 0.6rem;
  width: 100%;
}
</style>