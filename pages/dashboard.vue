<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
})
</script>

<style></style>
