<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArtistStore } from '~/stores/label/artists';
import ManagerService from '~/services/label/ManagerService';
import type { ArtistsList } from '~/types/label/IArtist';
import { UserRole } from '~/constants/roles';

const managers = ref();
const filters = ref({
  global: { value: null, matchMode: 'contains' },
});
const loading = ref(false);
const pagination = ref({ page: 1, limit: 10, total: 0 });
const dialogVisible = ref(false);

const artistStore = useArtistStore();
const { artists } = storeToRefs(artistStore);

const fetchManagers = async (params = {}) => {
  loading.value = true;
  try {
    const validatedParams = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: filters.value.global.value || undefined,
      ...params,
    };

    const response = await ManagerService.getAllManagers(validatedParams);
    managers.value = response.data.data;
    pagination.value.total = response.data.pagination.total;
  } catch (error) {
    console.error('Ошибка при получении менеджеров:', error);
  } finally {
    loading.value = false;
  }
};

const fetchArtists = async (managerId: string) => {
  try {
    await artistStore.fetchAllManagerArtists(managerId);
    dialogVisible.value = true;
  } catch (error) {
    console.error('Ошибка при получении артистов:', error);
  }
};

const onPageChange = (event: any) => {
  pagination.value.page = event.page + 1;
  fetchManagers();
};

const onSortChange = (event: any) => {
  const sortField = event.sortField;
  const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
  fetchManagers({ [`sort[${sortField}]`]: sortOrder });
};

onMounted(() => {
  fetchManagers();
});

watchDebounced(
  () => filters.value,
  newFilters => {
    const searchQuery = newFilters.global?.value;
    fetchManagers({ search: searchQuery || undefined });
  },
  {
    debounce: 300,
    maxWait: 2000,
    deep: true,
  }
);
</script>

<template>
  <DataTable
    :value="managers"
    :lazy="true"
    :loading="loading"
    :paginator="true"
    :rows="pagination.limit"
    :totalRecords="pagination.total"
    responsiveLayout="scroll"
    v-model:filters="filters"
    filterDisplay="menu"
    :globalFilterFields="['surname', 'firstname', 'contact']"
    stripedRows
    @page="onPageChange"
    @sort="onSortChange"
    :pt="{ mask: '!bg-transparent !text-ash-600 backdrop-blur-sm' }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <InputText
          v-model="filters['global'].value"
          :placeholder="$t('placeholders.search')"
        />
      </div>
    </template>

    <Column field="id" :header="$t('login.id')"></Column>
    <Column field="surname" :header="$t('info.surname')" sortable></Column>
    <Column field="firstname" :header="$t('info.firstname')" sortable></Column>
    <Column field="patronymic" :header="$t('info.patronymic')"></Column>
    <Column field="role" :header="$t('roles.root')">
      <template #body="slotProps">
        <div class="w-full text-center">
          <UiuxIconVCheck v-if="slotProps.data.role === UserRole.ROOT" />
        </div>
      </template>
    </Column>
    <Column field="contact" :header="$t('info.contact')"></Column>
    <Column :header="$t('placeholders.actions')">
      <template #body="slotProps">
        <UiuxSeverityButton @click="fetchArtists(slotProps.data.id)">
          {{ $t('managers.showArtists') }}
        </UiuxSeverityButton>
      </template>
    </Column>
  </DataTable>

  <LabelManagerPool
    :visible="dialogVisible"
    :artists="artists"
    @update:visible="dialogVisible = $event"
  />
</template>
