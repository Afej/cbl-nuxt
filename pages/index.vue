<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4 text-white">
        Welcome to Central Bank of Learnable
      </h1>
      <p class="text-gray-400 mb-8">Secure and easy way to manage your money</p>
      <div class="flex gap-4 justify-center">
        <UButton to="/login" size="lg" color="primary">Login</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
})
</script>
