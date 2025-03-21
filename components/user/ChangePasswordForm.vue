<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from '#imports';
import AuthService from '~/services/user/AuthService';
import ShowToast from '~/utils/showToast';
import { validatePassword } from '~/utils/login.validator';

const props = defineProps<{
  userId: string;
}>();

const newPassword = ref('');
const repeatPassword = ref('');

const { t } = useI18n();

const toast = useToast();
ShowToast.initialize(toast);

const changePassword = async (): Promise<void> => {
  try {
    const userId = props.userId;
    const password = newPassword.value;
    await AuthService.resetPassword(userId, password);
    ShowToast.success({
      detail: t('settings.changePasswordSuccess'),
    });
    newPassword.value = '';
    repeatPassword.value = '';
  } catch (e: any) {
    ShowToast.error({
      detail: e.message,
    });
  }
};

const handleChangePassword = async (): Promise<void> => {
  if (newPassword.value !== repeatPassword.value) {
    ShowToast.error({
      summary: t('errors.invalidData'),
      detail: t('settings.passwordsDontMatch'),
    });
    return;
  }

  if (!validatePassword(newPassword.value)) {
    ShowToast.error({
      detail: t('errors.invalidData'),
    });
    return;
  }
  await changePassword();
};
</script>

<template>
  <form @submit.prevent="handleChangePassword" class="flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <p class="text-ash-800 font-semibold">
        {{ $t('settings.changePassword') }}
      </p>
      <div class="flex gap-4">
        <UiuxInputNewPassword
          :password="newPassword"
          :width="59"
          @update:password="newPassword = $event"
          >{{ $t('placeholders.newPassword') }}
        </UiuxInputNewPassword>
        <FloatLabel variant="on" class="w-59">
          <Password
            id="repeatPassword"
            v-model="repeatPassword"
            minlength="8"
            maxlength="96"
            :feedback="false"
            toggleMask
            fluid
            required
          />
          <label for="repeatPassword">{{
            $t('placeholders.repeatPassword')
          }}</label>
        </FloatLabel>
      </div>
    </div>
    <UiuxGradientButton type="submit" class="shrink-0 w-28">
      {{ $t('buttons.edit') }}
    </UiuxGradientButton>
  </form>
</template>
