<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from '#imports';
import ShowToast from '~/utils/showToast';
import InfoService from '~/services/user/InfoService';
import RegisterService from '~/services/user/RegisterService';
import AuthService from '~/services/user/AuthService';

interface IUserMainInfo {
  surname: string;
  firstname: string;
  patronymic: string;
  contact: string;
}

interface IUserInfoForm extends IUserMainInfo {
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

const originalUserInfo = ref<IUserInfoForm>({
  surname: '',
  firstname: '',
  patronymic: '',
  contact: '',
  email: '',
});

const loginRef = defineModel<string>('login');

const fetchUserInfo = async (): Promise<void> => {
  try {
    const response = await InfoService.getUserInfoById(props.userId);
    const { surname, firstname, patronymic, contact, email, login } = response;

    userInfoForm.value = { surname, firstname, patronymic, contact, email };
    originalUserInfo.value = { surname, firstname, patronymic, contact, email };

    loginRef.value = login;
  } catch (e: any) {
    ShowToast.error({
      summary: t('errors.default'),
      detail: e.message,
      group: 'br',
    });
  }
};

const hasChanged = <T,>(current: T, original: T): boolean => {
  return JSON.stringify(current) !== JSON.stringify(original);
};

const updateMainInfo = async (mainInfo: IUserMainInfo) => {
  await RegisterService.addInfoAboutUserById({
    id: props.userId,
    ...mainInfo,
  });
};

const updateEmail = async (email: string) => {
  await AuthService.changeEmail(props.userId, email);
};

const saveEditInfo = async () => {
  try {
    const currentMainInfo: IUserMainInfo = {
      surname: userInfoForm.value.surname,
      firstname: userInfoForm.value.firstname,
      patronymic: userInfoForm.value.patronymic,
      contact: userInfoForm.value.contact,
    };

    const originalMainInfo: IUserMainInfo = {
      surname: originalUserInfo.value.surname,
      firstname: originalUserInfo.value.firstname,
      patronymic: originalUserInfo.value.patronymic,
      contact: originalUserInfo.value.contact,
    };

    const mainInfoChanged = hasChanged(currentMainInfo, originalMainInfo);
    const emailChanged = hasChanged(
      userInfoForm.value.email,
      originalUserInfo.value.email
    );

    if (mainInfoChanged) {
      await updateMainInfo(currentMainInfo);
    }

    if (emailChanged) {
      await updateEmail(userInfoForm.value.email);
    }

    originalUserInfo.value = { ...userInfoForm.value };

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
      <p class="text-ash-800 font-semibold">{{ $t('updateUserInfo.main') }}</p>
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
      <p class="text-ash-800 font-semibold">
        {{ $t('updateUserInfo.contacts') }}
      </p>
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

    <UiuxGradientButton type="submit" class="shrink-0 w-28">
      {{ $t('buttons.save') }}
    </UiuxGradientButton>
  </form>
</template>
