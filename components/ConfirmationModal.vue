<template>
  <UModal
    :model-value="show"
    @update:model-value="$emit('update:show', $event)">
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold">{{ title }}</h3>
      </template>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end gap-2">
        <UButton @click="$emit('update:show', false)" variant="ghost"
          >Cancel</UButton
        >
        <UButton
          @click="
            () => {
              onConfirm()
              $emit('update:show', false)
            }
          ">
          Confirm
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  onConfirm: () => void
}>()

defineEmits<{
  'update:show': [value: boolean]
}>()
</script>
