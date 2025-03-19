<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '#imports';
import AuthService from '~/services/user/AuthService';
import ShowToast from '~/utils/showToast';
import { useToast } from 'primevue/usetoast';
import { type FullUserInfo } from '~/types/user/InfoResponse';

const { t } = useI18n();
const toast = useToast();
ShowToast.initialize(toast);

const props = defineProps<{
  user: FullUserInfo;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'open-block-confirm', userId: string): void;
}>();

const resetPasswordModalVisible = ref(false);

const showError = (message: string): void => {
  ShowToast.error({
    summary: t('errors.default'),
    detail: message,
    group: 'br',
  });
};

const unblockUser = async (userId: string): Promise<void> => {
  try {
    await AuthService.unblock(userId);
    emit('update');
  } catch (e: any) {
    showError(e.message);
  }
};
</script>

<template>
  <div class="flex justify-center gap-2 text-ash-500">
    <NuxtLink
      :to="`users/${props.user.id}`"
      v-tooltip.bottom="$t('menus.actions.edit')"
    >
      <UiuxIconPencilSquare class="hover:text-ash-800 duration-300" />
    </NuxtLink>
    <div v-if="props.user.role !== 'root'" class="flex justify-center gap-2">
      <Button
        v-tooltip.bottom="$t('menus.actions.reset')"
        unstyled
        @click="resetPasswordModalVisible = true"
      >
        <UiuxIconKeyPassword class="hover:text-ash-800 duration-300" />
      </Button>
      <Button
        v-if="props.user.is_active"
        v-tooltip.bottom="$t('menus.actions.block')"
        unstyled
        @click="emit('open-block-confirm', props.user.id)"
      >
        <UiuxIconLockClose class="hover:text-e-red duration-300" />
      </Button>
      <Button
        v-else
        v-tooltip.bottom="$t('menus.actions.unblock')"
        unstyled
        @click="unblockUser(props.user.id)"
      >
        <UiuxIconLockOpen class="hover:text-e-green duration-300" />
      </Button>
    </div>
  </div>

  <UserActionsResetPassword
    :user-id="props.user.id"
    :login="props.user.login"
    :modal-visible="resetPasswordModalVisible"
    @cancel="resetPasswordModalVisible = false"
  />
</template>
