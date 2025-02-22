<template>
  <UModal
    :model-value="activeModal === type"
    @close="handleClose"
    :prevent-close="isLoading">
    <UCard class="bg-gray-800">
      <template #header>
        <h3 class="text-xl font-bold">{{ modalConfig.title }}</h3>
      </template>
      <form @submit.prevent="onSubmit">
        <slot></slot>
        <div class="flex justify-end gap-2 mt-4">
          <UButton
            @click="handleClose"
            variant="ghost"
            color="white"
            :disabled="isLoading">
            Cancel
          </UButton>
          <UButton
            type="submit"
            :color="modalConfig.buttonColor"
            :loading="isLoading"
            :disabled="isLoading">
            {{ modalConfig.buttonText }}
            <!-- {{ isLoading ? 'Processing...' : modalConfig.buttonText }} -->
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { TransactionModalType } from '~/common/types'

type ModalType = TransactionModalType

interface ModalConfig {
  title: string
  buttonText: string
  buttonColor: string
}

const MODAL_CONFIGS: Record<string, ModalConfig> = {
  deposit: {
    title: 'Deposit Money',
    buttonText: 'Deposit',
    buttonColor: 'green',
  },
  withdraw: {
    title: 'Withdraw Money',
    buttonText: 'Withdraw',
    buttonColor: 'orange',
  },
  transfer: {
    title: 'Transfer Money',
    buttonText: 'Transfer',
    buttonColor: 'white',
  },
}

const props = defineProps<{
  type: ModalType
  activeModal: ModalType | null
  isLoading: boolean
}>()

const modalConfig = computed(() => MODAL_CONFIGS[props.type])

const emit = defineEmits<{
  close: []
  submit: []
}>()

const handleClose = () => {
  if (!props.isLoading) {
    emit('close')
  }
}

const onSubmit = () => {
  emit('submit')
}
</script>
