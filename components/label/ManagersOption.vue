<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '#imports';
import ManagerService from '~/services/label/ManagerService';
import type { ManagerResponse } from '~/types/label/ManagerResponse';
import type { IManager } from '~/types/label/IManager';
import { ManagerQueryParams } from '~/types/label/ManagerRequest';
import { useToast } from 'primevue/usetoast';
import ShowToast from '~/utils/showToast';

const queryParams = ref(new ManagerQueryParams());
const managers = ref<IManager[]>([]);
const selectedManager = ref<string>('');
const loading = ref(false);
const totalRecords = ref(0);
const isFiltered = ref(false);
const searchQuery = ref<string>('');

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

ShowToast.initialize(useToast());

const loadManagers = async () => {
  loading.value = true;
  try {
    const response = await ManagerService.getAllManagers(queryParams.value);
    const data: ManagerResponse = response.data;

    if (queryParams.value.page === 1) {
      managers.value = data.data;
    } else {
      managers.value = [...managers.value, ...data.data];
    }

    totalRecords.value = data.pagination.total;
  } catch (e: any) {
    console.log(e.response.data.message);
  } finally {
    loading.value = false;
  }
};

const onLazyLoad = (event: any) => {
  const newPage = Number(event.page) || 1;
  const newLimit = Number(event.rows) || 10;

  queryParams.value.page = newPage;
  queryParams.value.limit = newLimit;

  loadManagers();
};

const onSelect = (event: any) => {
  const managerId = event.value.id;
  emit('select', managerId);
};

const onFilter = useDebounceFn(() => {
  if (searchQuery.value !== queryParams.value.search) {
    queryParams.value.page = 1;
    managers.value = [];
    queryParams.value.search = searchQuery.value;
    isFiltered.value = !!searchQuery.value;
    loadManagers();
  }
}, 300);
</script>

<template>
  <div>
    <Select
      v-model="selectedManager"
      :options="managers"
      optionLabel="firstname"
      placeholder="Выберите менеджера"
      :loading="loading"
      @change="onSelect"
      class="w-84"
      :virtualScrollerOptions="{ lazy: true, onLazyLoad, itemSize: 40 }"
    >
      <template #header>
        <InputText
          v-model="searchQuery"
          @update:model-value="onFilter"
          :placeholder="t('placeholders.search')"
          class="m-2 !w-80"
        />
      </template>
      <template #option="slotProps">
        <span class="text-wrap">
          {{ slotProps.option.surname }} {{ slotProps.option.firstname }}
          {{ slotProps.option.patronymic }}
        </span>
      </template>
    </Select>
  </div>
</template>
