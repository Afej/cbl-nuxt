<template>
  <UModal
    :model-value="show"
    :prevent-close="loading"
    @update:model-value="$emit('update:show', $event)">
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold">{{ title }}</h3>
      </template>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end gap-2">
        <UButton
          @click="$emit('update:show', false)"
          variant="outline"
          :disabled="loading">
          Cancel
        </UButton>
        <UButton @click="handleConfirm" :loading="loading"> Confirm </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const loading = ref(false)

const props = defineProps<{
  show: boolean
  title: string
  message: string
  onConfirm: (() => Promise<void>) | (() => void)
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const handleConfirm = async () => {
  loading.value = true
  try {
    const result = props.onConfirm()
    if (result instanceof Promise) {
      await result
    }
    loading.value = false
    emit('update:show', false)
  } catch (error) {
    loading.value = false
  }
}
</script>
