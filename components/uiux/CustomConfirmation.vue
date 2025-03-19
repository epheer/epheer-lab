<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps<{
  message: string;
  header?: string;
  rejectLabel?: string;
  acceptLabel?: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'reject'): void;
}>();

const confirm = useConfirm();

const open = () => {
  confirm.require({
    message: props.message,
    header: props.header,
    rejectProps: {
      label: props.rejectLabel,
    },
    acceptProps: {
      label: props.acceptLabel,
    },
    accept: () => emit('confirm'),
    reject: () => emit('reject'),
  });
};

watch(
  () => props.isOpen,
  value => {
    if (value) {
      open();
    }
  }
);
</script>

<template>
  <ConfirmDialog modal :pt="{ mask: 'backdrop-blur-xs' }">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="w-76 p-4">
        <header class="flex justify-between items-center mb-2">
          <span class="font-bold text-xl">{{ message.header }}</span>
          <Button
            unstyled
            ripple
            class="p-2 rounded-full text-ash-600 hover:text-ash-900"
            @click="rejectCallback"
          >
            <UiuxIconXClose />
          </Button>
        </header>
        <p class="mb-2">{{ message.message }}</p>
        <UiuxSeverityButton stretch @click="rejectCallback">
          {{ message.rejectProps.label }}
        </UiuxSeverityButton>
        <UiuxDangerButton stretch @click="acceptCallback" autofocus>
          {{ message.acceptProps.label }}
        </UiuxDangerButton>
      </div>
    </template>
  </ConfirmDialog>
</template>