<template>
  <div class="relative">
    <UInput
      :type="showPassword ? 'text' : 'password'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      v-bind="$attrs"
      :ui="{ icon: { trailing: { pointer: '' } } }">
      <template #trailing>
        <UButton
          color="gray"
          variant="ghost"
          :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
          @click="showPassword = !showPassword"
          :padded="false" />
      </template>
    </UInput>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
</script>
