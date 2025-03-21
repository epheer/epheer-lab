<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useI18n } from '#imports';
import { useAuthStore } from '~/stores/user/auth';
import { UserRole } from '~/constants/roles';

const { t } = useI18n();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const items = ref<Array<MenuItem>>([
  { label: t('title.dashboard'), route: '/' },
  { label: t('title.artists'), route: '/artists', access: UserRole.MANAGER },
  { label: t('title.managers'), route: '/managers', access: UserRole.ROOT },
  {
    label: t('menus.sidebar.releases'),
    items: [
      { label: t('title.releases.new'), route: '/new' },
      { label: t('title.releases.all'), route: '/releases' },
    ],
  },
  {
    label: t('title.royalties.default'),
    route: '/royalties',
    items: [
      {
        label: t('title.royalties.manage'),
        route: '/royalties/manage',
        access: UserRole.ROOT,
      },
    ],
    access: UserRole.ARTIST,
  },
  {
    label: t('title.contracts.default'),
    route: '/contracts',
    items: [
      {
        label: t('title.contracts.register'),
        route: '/contracts/new',
        access: UserRole.ROOT,
      },
    ],
  },
  { label: t('title.guides'), route: '/guides' },
  {
    label: t('menus.sidebar.users'),
    items: [
      { label: t('title.users.register'), route: '/users/register' },
      { label: t('title.users.all'), route: '/users' },
    ],
    access: UserRole.ROOT,
  },
]);

const expandedItems = ref<number[]>([]);
const isSidebarVisible = ref<boolean>(false);

type MenuItem = {
  label: string;
  route?: string;
  items?: MenuItem[];
  access?: UserRole;
};

const filterItemsByRole = (role: string): void => {
  const hasAccess = (itemRole?: UserRole): boolean => {
    if (role === UserRole.ROOT) return true;

    return !itemRole || itemRole === role;
  };

  const filterMenu = (menuItems: MenuItem[]): MenuItem[] => {
    return menuItems
      .map(item => {
        if (!hasAccess(item.access)) {
          return null;
        }

        if (item.items) {
          const filteredSubItems = filterMenu(item.items);

          if (filteredSubItems.length > 0) {
            return { ...item, items: filteredSubItems };
          }

          delete item.items;
        }

        if (
          item.route ||
          (Array.isArray(item.items) && item.items.length > 0)
        ) {
          return item;
        }

        return null;
      })
      .filter(Boolean) as MenuItem[];
  };

  items.value = filterMenu(items.value);
};

onBeforeMount(() => {
  filterItemsByRole(user.value.role);
});

onMounted(() => {
  isSidebarVisible.value = window.innerWidth >= 768;
});

const toggleSidebar = (): void => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const hideSidebarOnMobile = (): void => {
  if (window.innerWidth < 768) {
    isSidebarVisible.value = false;
  }
};

const toggleExpand = (index: number): void => {
  if (expandedItems.value.includes(index)) {
    expandedItems.value = expandedItems.value.filter(i => i !== index);
  } else {
    expandedItems.value.push(index);
  }
};
</script>

<template>
  <div class="flex flex-col w-screen md:w-auto md:h-screen md:p-4">
    <div
      :class="[
        'flex bg-ash-100 items-center justify-between pl-4 py-1 md:p-4 z-20',
        { '!bg-ash-50 md:!bg-ash-100': isSidebarVisible },
      ]"
    >
      <UiuxToggleBurger :isOpened="isSidebarVisible" @toggle="toggleSidebar" />
      <NuxtLink to="/" class="flex flex-nowrap items-baseline gap-3">
        <BrandLogo class="h-5 md:h-6 w-auto" />
        <span class="font-sans text-nowrap text-md md:text-lg text-ash-800">
          {{ $t('brand.shortLab') }}</span
        >
      </NuxtLink>
      <UserProfileMenu class="block md:hidden" />
    </div>
    <nav
      :class="[
        'absolute md:static bg-ash-50 top-16 left-0 z-10 md:z-0 w-full mb-2 rounded-2xl shadow-e border-1 border-ash-200 transition-all md:transition-none duration-300',
        { 'invisible -translate-y-full': !isSidebarVisible },
      ]"
    >
      <ol>
        <li
          v-for="(item, index) in items"
          :key="item.label"
          class="w-full flex items-center justify-between"
        >
          <template v-if="item.route && !item.items">
            <NuxtLink
              :to="item.route"
              class="font-medium rounded-2xl py-3 px-4 w-full hover:bg-ash-200 border-1 border-ash-200/10 hover:border-ash-200"
              @click="hideSidebarOnMobile"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
          <template v-else-if="item.items">
            <div class="block w-full">
              <div
                v-if="item.route"
                class="flex justify-between w-full items-center cursor-pointer rounded-2xl border-1 border-ash-200/10 hover:border-ash-200"
              >
                <NuxtLink
                  :to="item.route"
                  class="font-medium rounded-l-2xl pl-4 py-3 w-full hover:bg-ash-200"
                  @click="hideSidebarOnMobile"
                >
                  {{ item.label }}
                </NuxtLink>
                <div class="flex">
                  <Divider
                    layout="vertical"
                    class="border-s-1 border-s-ash-200"
                    unstyled
                  />
                  <div
                    class="rounded-r-2xl h-full w-full py-3 px-4 hover:bg-ash-200"
                  >
                    <UiuxToggleExpand
                      :expanded="expandedItems.includes(index)"
                      @click="toggleExpand(index)"
                      class="text-ash-800 hover:text-ash-900"
                    />
                  </div>
                </div>
              </div>
              <div
                v-else
                class="flex justify-between items-center font-medium py-3 px-4 w-full cursor-pointer rounded-2xl border-1 border-ash-200/10 hover:border-ash-200 hover:bg-ash-200 text-ash-800 hover:text-ash-900"
                @click="toggleExpand(index)"
              >
                <span class="text-ash-900">{{ item.label }}</span>
                <UiuxToggleExpand
                  :expanded="expandedItems.includes(index)"
                  class="text-ash-800 hover:text-ash-900"
                />
              </div>
              <ul v-if="expandedItems.includes(index)">
                <li
                  v-for="subitem in item.items"
                  :key="subitem.label"
                  class="w-full flex items-center justify-between"
                >
                  <NuxtLink
                    :to="subitem.route"
                    class="w-full py-3 pr-4 pl-8 rounded-2xl hover:bg-ash-200 border-1 border-ash-200/10 hover:border-ash-200"
                    @click="hideSidebarOnMobile"
                  >
                    {{ subitem.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </template>
        </li>
      </ol>
    </nav>
    <span class="hidden md:block text-ash-500 mt-2"
      >&copy; {{ $t('brand.name') }} 2025</span
    >
  </div>
</template>

<style scoped>
.router-link-exact-active {
  color: var(--color-eph-700);
}
</style>
