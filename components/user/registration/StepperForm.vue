<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { UserRole, rolesList } from "~/constants/roles";
import { validateLoginData } from "~/utils/login.validator";
import ShowToast from '~/utils/showToast';
import RegisterService from "~/services/user/RegisterService";
import type { IAuthData, IArtistData, IInfoData, IRegisterForm } from "~/types/user/IRegister";

const toast = useToast();
ShowToast.initialize(toast);
const { t } = useI18n();

const registerForm = ref<IRegisterForm>({
  login: "",
  password: "",
  role: UserRole.ARTIST,
  email: "",
  stageName: "",
  surname: "",
  firstname: "",
  patronymic: "",
  contact: "",
  isRegistered: false,
});

const showError = (message: string): void => {
  ShowToast.error({
    summary: t("errors.register"),
    detail: message,
    group: "br",
  });
};

const validateStep1 = (): boolean => {
  if (!validateLoginData(registerForm.value.login, registerForm.value.password)) {
    showError(t("errors.invalidData"));
    return false;
  }
  return true;
};

const validateStep2 = (): boolean => {
  return Object.values(UserRole).includes(registerForm.value.role);
};

const hasMissingRequiredContactData = (): boolean => {
  return (
    !registerForm.value.surname ||
    !registerForm.value.firstname ||
    !registerForm.value.contact ||
    (registerForm.value.role === UserRole.ARTIST && !registerForm.value.stageName)
  );
};

const validateStep3 = (): boolean => {
  if (hasMissingRequiredContactData()) {
    showError(t("errors.missingRequiredData"));
    return false;
  }
  return true;
};

const handleRegister = async (): Promise<void> => {
  try {
    const authData = <IAuthData>{
      login: registerForm.value.login,
      password: registerForm.value.password,
      role: registerForm.value.role,
      email: registerForm.value.email,
    };
    const result = await RegisterService.registerUser(authData);
    const userId = result.data.user.id;

    await addInfoByUser(userId);

    registerForm.value.isRegistered = true;

    ShowToast.success({
      summary: t("registration.success"),
      detail: `${t("registration.successMessage")} ${userId}`,
      group: "br",
    });
  } catch (e: any) {
    showError(e.response.data.message);
  }
};

const addInfoByUser = async (id: string): Promise<void> => {
  try {
    const infoData = <IInfoData>{
      id,
      surname: registerForm.value.surname,
      firstname: registerForm.value.firstname,
      patronymic: registerForm.value.patronymic,
      contact: registerForm.value.contact,
    };
    await RegisterService.addInfoAboutUserById(infoData);

    if (registerForm.role === UserRole.ARTIST) {
      await addStageName(id);
    }
  } catch (e: any) {
    showError(e.response.data.message);
  }
};

const addStageName = async (id: string): Promise<void> => {
  try {
    const artistData = <IArtistData>{
      id,
      stageName: registerForm.value.stageName,
    };
    await RegisterService.addStageNameById(artistData);
  } catch (e: any) {
    showError(e.response.data.message);
  }
};

const clearForm = (): void => {
  registerForm.value.login = "";
  registerForm.value.password = "";
  registerForm.value.role = UserRole.ARTIST;
  registerForm.value.email = "";
  registerForm.value.stageName = "";
  registerForm.value.surname = "";
  registerForm.value.firstname = "";
  registerForm.value.patronymic = "";
  registerForm.value.contact = "";
  registerForm.value.isRegistered = false;
};
</script>

<template>
  <Stepper value="1" linear>
    <StepList>
      <Step value="1"
      ><span class="hidden lg:block">{{
          $t("registration.loginData")
        }}</span></Step
      >
      <Step value="2"
      ><span class="hidden lg:block">{{
          $t("registration.role")
        }}</span></Step
      >
      <Step value="3"
      ><span class="hidden lg:block">{{
          $t("registration.contactInfo")
        }}</span></Step
      >
      <Step value="4"
      ><span class="hidden lg:block">{{
          $t("registration.confirmData")
        }}</span></Step
      >
    </StepList>
    <StepPanels>
      <StepPanel
        v-slot="{ activateCallback }"
        value="1"
        unstyled
        class="bg-ash-100"
      >
        <UserRegistrationStepLoginData
          :login="registerForm.login"
          :password="registerForm.password"
          @update:login="(value) => (registerForm.login = value)"
          @update:password="(value) => (registerForm.password = value)"
          @next-step="
            if (validateStep1()) {
              activateCallback('2');
            }
          "
        />
      </StepPanel>
      <StepPanel
        v-slot="{ activateCallback }"
        value="2"
        unstyled
        class="bg-ash-100"
      >
        <UserRegistrationStepSelectRole
          :role="registerForm.role"
          :roles-list="rolesList(t)"
          @update:role="(value) => (registerForm.role = value)"
          @next-step="
            if (validateStep2()) {
              activateCallback('3');
            }
          "
          @prev-step="activateCallback('1')"
        />
      </StepPanel>
      <StepPanel
        v-slot="{ activateCallback }"
        value="3"
        unstyled
        class="bg-ash-100"
      >
        <UserRegistrationStepContactInfo
          :stage-name="registerForm.stageName"
          :surname="registerForm.surname"
          :firstname="registerForm.firstname"
          :patronymic="registerForm.patronymic"
          :contact="registerForm.contact"
          :email="registerForm.email"
          :role="registerForm.role"
          @update:stage-name="(value) => (registerForm.stageName = value)"
          @update:surname="(value) => (registerForm.surname = value)"
          @update:firstname="(value) => (registerForm.firstname = value)"
          @update:patronymic="(value) => (registerForm.patronymic = value)"
          @update:contact="(value) => (registerForm.contact = value)"
          @update:email="(value) => (registerForm.email = value)"
          @next-step="
            if (validateStep3()) {
              activateCallback('4');
            }
          "
          @prev-step="activateCallback('2')"
        />
      </StepPanel>
      <StepPanel
        v-slot="{ activateCallback }"
        value="4"
        unstyled
        class="bg-ash-100"
      >
        <UserRegistrationStepConfirmData
          :login="registerForm.login"
          :password="registerForm.password"
          :role="registerForm.role"
          :email="registerForm.email"
          :stage-name="registerForm.stageName"
          :surname="registerForm.surname"
          :firstname="registerForm.firstname"
          :patronymic="registerForm.patronymic"
          :contact="registerForm.contact"
          :is-registered="registerForm.isRegistered"
          @prev-step="activateCallback('3')"
          @register="handleRegister"
          @clear-form="clearForm(); activateCallback('1')"
        />
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>