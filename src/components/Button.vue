<template>
  <button class="custom-btn" @click="$emit('click')">
    <span class="btn-content">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "Button",
  emits: ["click"],
};
</script>

<style scoped>
.custom-btn {
  background-color: var(--brand-secundary);
  color: white;
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.8rem;
}

.custom-btn:hover {
  background-color: var(--brand-principal);
  cursor: pointer;
}
</style>