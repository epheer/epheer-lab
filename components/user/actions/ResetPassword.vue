<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from '#imports';
import AuthService from '~/services/user/AuthService';
import ShowToast from '~/utils/showToast';

const props = defineProps<{
  userId: string;
  login: string;
  modalVisible: boolean;
}>();
const emit = defineEmits<{
  (e: 'cancel'): void;
}>();

const visible = defineModel<boolean>('modalVisible', { required: true });

const newPassword = ref('');

const { t } = useI18n();

const toast = useToast();
ShowToast.initialize(toast);

const resetPassword = async (): Promise<void> => {
  try {
    const userId = props.userId;
    const password = newPassword.value;
    await AuthService.resetPassword(userId, password);
    ShowToast.success({
      summary: t('success'),
      detail: t('resetPassword.success'),
      group: 'br',
    });
    visible.value = false;
    newPassword.value = '';
    emit('cancel');
  } catch (error) {
    ShowToast.error({
      summary: t('errors.default'),
      detail: error.message,
      group: 'br',
    });
  }
};

const cancelModal = () => {
  visible.value = false;
  newPassword.value = '';
  emit('cancel');
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    :pt="{ mask: 'backdrop-blur-xs' }"
    class="w-76"
    @hide="cancelModal"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-4">
        <UiuxIconKeyPassword />
        <span class="font-bold whitespace-nowrap"
          >{{ $t('resetPassword.title') }}
        </span>
      </div>
    </template>
    <p class="text-ash-600 block text-wrap mb-6">
      {{ $t('resetPassword.description') }} <b>{{ login }}</b>
    </p>
    <UiuxInputNewPassword
      :password="newPassword"
      @update:password="newPassword = $event"
      >{{ $t('placeholders.newPassword') }}
    </UiuxInputNewPassword>
    <template #footer>
      <UiuxSeverityButton stretch @click="cancelModal"
        >{{ $t('buttons.cancel') }}
      </UiuxSeverityButton>
      <UiuxGradientButton stretch @click="resetPassword" autofocus
        >{{ $t('buttons.save') }}
      </UiuxGradientButton>
    </template>
  </Dialog>
</template>
