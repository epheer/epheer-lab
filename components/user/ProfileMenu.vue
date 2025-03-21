<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/user/auth';
import { useInfoStore } from '~/stores/user/info';
import { navigateTo } from '#app';
import { useI18n } from '#imports';

const { t } = useI18n();

const authStore = useAuthStore();
const infoStore = useInfoStore();
const { user } = storeToRefs(authStore);

const menu = ref<any>(null);
const isMenuVisible = ref<boolean>(false);

interface MenuItem {
  label?: string;
  route?: string;
  url?: string;
  separator?: boolean;
  command?: () => void;
}

const items = ref<Array<MenuItem>>([
  { label: t('title.settings'), route: '/settings' },
  { label: t('menus.profile.backToSite'), url: 'https://epheer.ru' },
  { separator: true },
  {
    label: t('menus.profile.logout'),
    command: () => {
      logout();
    },
  },
]);

async function logout(): Promise<void> {
  toggleMenu();

  try {
    await authStore.logout();
    navigateTo('/login');
    infoStore.clearUserInfo();
  } catch (error: any) {
    console.log(error);
  }
}

function toggleMenu(event?: Event): void {
  menu.value?.toggle(event);
}

function onMenuFocus(): void {
  isMenuVisible.value = true;
}

function onMenuBlur(): void {
  isMenuVisible.value = false;
}
</script>

<template>
  <div>
    <Menu
      ref="menu"
      :model="items"
      :popup="true"
      @focus="onMenuFocus"
      @blur="onMenuBlur"
    >
      <template #start>
        <span class="inline-flex px-4 pt-3 pb-1 font-bold">
          {{ user.login || 'Логин' }}
        </span>
      </template>
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else-if="item.url"
          v-ripple
          :href="item.url"
          v-bind="props.action"
          target="_self"
          >{{ item.label }}</a
        >
        <a v-else v-ripple v-bind="props.action">
          <span class="text-e-red">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
    <Button
      type="button"
      @click="toggleMenu"
      class="rounded-full p-4 flex gap-2 hover:text-eph-black duration-300"
      unstyled
    >
      <UiuxIconUserProfile />
      <UiuxToggleExpand :expanded="isMenuVisible" />
    </Button>
  </div>
</template>
