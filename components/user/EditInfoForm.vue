<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from '#imports';
import ShowToast from '~/utils/showToast';
import InfoService from '~/services/user/InfoService';
import RegisterService from '~/services/user/RegisterService';
import AuthService from '~/services/user/AuthService';

interface IUserInfoForm {
  surname: string;
  firstname: string;
  patronymic: string;
  contact: string;
  email: string;
}

const props = defineProps<{
  userId: string;
}>();

const emit = defineEmits<{
  (e: 'updated'): void;
}>();

const { t } = useI18n();

const userInfoForm = ref<IUserInfoForm>({
  surname: '',
  firstname: '',
  patronymic: '',
  contact: '',
  email: '',
});

const loginRef = defineModel<string>('login', { required: true });

const fetchUserInfo = async (): Promise<void> => {
  try {
    const response = await InfoService.getUserInfoById(props.userId);
    const { surname, firstname, patronymic, contact, email, login } = response;
    userInfoForm.value = {
      surname,
      firstname,
      patronymic,
      contact,
      email,
    };
    loginRef.value = login;
  } catch (e: any) {
    ShowToast.error({
      summary: t('errors.default'),
      detail: e.message,
      group: 'br',
    });
  }
};

const saveEditInfo = async () => {
  try {
    const { surname, firstname, patronymic, contact, email } =
      userInfoForm.value;

    await RegisterService.addInfoAboutUserById({
      id: props.userId,
      surname,
      firstname,
      patronymic,
      contact,
    });
    await AuthService.changeEmail(props.userId, email);

    emit('updated');

    ShowToast.success({
      summary: t('success'),
      detail: t('updateUserInfo.success'),
      group: 'br',
    });

    await fetchUserInfo();
  } catch (e: any) {
    ShowToast.error({
      summary: t('errors.default'),
      detail: e.message,
      group: 'br',
    });
  }
};

onMounted(async () => {
  await fetchUserInfo();
});
</script>

<template>
  <form @submit.prevent="saveEditInfo" class="flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <p class="text-ash-800 font-semibold">Основная информация</p>
      <div class="flex flex-wrap gap-4">
        <FloatLabel variant="on">
          <InputText id="surname" v-model="userInfoForm.surname" required />
          <label for="surname">{{ $t('info.surname') }}</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="firstname" v-model="userInfoForm.firstname" required />
          <label for="firstname">{{ $t('info.firstname') }}</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="patronymic" v-model="userInfoForm.patronymic" />
          <label for="patronymic">{{ $t('info.patronymic') }}</label>
        </FloatLabel>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-ash-800 font-semibold">Контакты</p>
      <div class="flex flex-wrap gap-4">
        <FloatLabel variant="on">
          <InputText id="email" v-model="userInfoForm.email" required />
          <label for="email">{{ $t('info.email') }}</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="contact" v-model="userInfoForm.contact" required />
          <label for="contact">{{ $t('info.contact') }}</label>
        </FloatLabel>
      </div>
    </div>

    <UiuxGradientButton type="submit" class="shrink-0 w-fit">
      {{ $t('buttons.save') }}
    </UiuxGradientButton>
  </form>
</template>
