<template>
  <div class="header">
    <slot name="header"></slot>
  </div>
  <div class="body">
    <slot name="body"></slot>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 14px 0;
  box-sizing: border-box;
}
header {
  position: fixed;
  width: 100vw;
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}
.body {
  height: 75vh;
  width: 100%;
}
.head .grip {
  width: 120px;
  height: 8px;
  background-color: #e5e5e5;
  border-radius: 4px;
}
</style>
