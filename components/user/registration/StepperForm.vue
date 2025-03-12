<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { UserRole, rolesList } from "~/constants/roles";
import { validateLoginData } from "~/utils/login.validator";
import RegisterService from "~/services/user/RegisterService";
import type { IAuthData, IArtistData, IInfoData } from "~/types/user/IRegister";

const toast = useToast();
const { t } = useI18n();

const login = ref<string>("");
const password = ref<string>("");
const role = ref<UserRole>(UserRole.ARTIST);
const email = ref<string>("");
const stageName = ref<string>("");
const surname = ref<string>("");
const firstname = ref<string>("");
const patronymic = ref<string>("");
const contact = ref<string>("");
const isRegistered = ref<boolean>(false);

const showError = (message: string): void => {
  toast.add({
    severity: "error",
    summary: t("errors.register"),
    detail: message,
    life: 3000,
    group: "br",
  });
};

const validateStep1 = (): boolean => {
  if (!validateLoginData(login.value, password.value)) {
    showError(t("errors.invalidData"));
    return false;
  }
  return true;
};

const validateStep2 = (): boolean => {
  return Object.values(UserRole).includes(role.value);
};

const validateStep3 = (): boolean => {
  if (
    !surname.value ||
    !firstname.value ||
    !contact.value ||
    (role.value === UserRole.ARTIST && !stageName.value)
  ) {
    showError(t("errors.missingRequiredData"));
    return false;
  }
  return true;
};

const handleRegister = async (): Promise<void> => {
  try {
    const authData = <IAuthData>{
      login: login.value,
      password: password.value,
      role: role.value,
      email: email.value,
    };
    const result = await RegisterService.registerUser(authData);
    const userId = result.data.user.id;

    await addInfoByUser(userId);

    isRegistered.value = true;

    toast.add({
      severity: "success",
      summary: t("registration.success"),
      detail: `${t("registration.successMessage")} ${userId}`,
      life: 5000,
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
      surname: surname.value,
      firstname: firstname.value,
      patronymic: patronymic.value,
      contact: contact.value,
    };
    await RegisterService.addInfoAboutUserById(infoData);

    if (role.value === UserRole.ARTIST) {
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
      stageName: stageName.value,
    };
    await RegisterService.addStageNameById(artistData);
  } catch (e: any) {
    showError(e.response.data.message);
  }
};

const clearForm = (): void => {
  login.value = "";
  password.value = "";
  role.value = UserRole.ARTIST;
  email.value = "";
  stageName.value = "";
  surname.value = "";
  firstname.value = "";
  patronymic.value = "";
  contact.value = "";
  isRegistered.value = false;
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
          :login="login"
          :password="password"
          @update:login="login = $event"
          @update:password="password = $event"
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
          :role="role"
          :roles-list="rolesList(t)"
          @update:role="role = $event"
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
          :stage-name="stageName"
          :surname="surname"
          :firstname="firstname"
          :patronymic="patronymic"
          :contact="contact"
          :email="email"
          :role="role"
          @update:stage-name="stageName = $event"
          @update:surname="surname = $event"
          @update:firstname="firstname = $event"
          @update:patronymic="patronymic = $event"
          @update:contact="contact = $event"
          @update:email="email = $event"
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
          :login="login"
          :password="password"
          :role="role"
          :email="email"
          :stage-name="stageName"
          :surname="surname"
          :firstname="firstname"
          :patronymic="patronymic"
          :contact="contact"
          :is-registered="isRegistered"
          @prev-step="activateCallback('3')"
          @register="handleRegister"
          @clear-form="clearForm(), activateCallback('1')"
        />
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>
