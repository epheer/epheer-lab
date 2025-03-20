<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from '#imports';
import type { Pagination } from '@/types/Pagination';
import type { InfoResponse } from '~/types/user/InfoResponse';
import { rolesList } from '~/constants/roles';
import AuthService from '~/services/user/AuthService';
import InfoService from '@/services/user/InfoService';
import ShowToast from '~/utils/showToast';

const { t } = useI18n();
const roles = rolesList(t);

const users = ref<InfoResponse[]>([]);
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  role: { value: null, matchMode: 'equals' },
});
const loading = ref(false);
const pagination = ref<Pagination>({
  total: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 10,
});

const blockConfirmModalVisible = ref(false);
const selectedUserId = ref<string | null>(null);

const openBlockConfirmModal = (userId: string) => {
  selectedUserId.value = userId;
  blockConfirmModalVisible.value = true;
};

const closeBlockConfirmModal = () => {
  selectedUserId.value = null;
  blockConfirmModalVisible.value = false;
};

const getTranslatedRole = (role: string) => {
  const roleItem = roles.find(r => r.value === role);
  return roleItem ? roleItem.label : role;
};

const clearRoleFilter = (applyFilter: () => void) => {
  applyFilter();
  filters.value.role.value = null;
};

const blockUser = async (): Promise<void> => {
  if (!selectedUserId.value) return;

  try {
    await AuthService.block(selectedUserId.value);
    await fetchUsers();
  } catch (e: any) {
    ShowToast.error({
      summary: t('errors.default'),
      detail: e.message,
      group: 'br',
    });
  } finally {
    closeBlockConfirmModal();
  }
};

const fetchUsers = async (params = {}) => {
  loading.value = true;
  try {
    const validatedParams = {
      page: pagination.value.currentPage,
      limit: pagination.value.limit,
      'filter[role]': filters.value.role.value || undefined,
      search: filters.value.global.value || undefined,
      ...params,
    };

    const response = await InfoService.getAllUsersInfo(validatedParams);

    users.value = response.data.data;
    pagination.value.total = response.data.pagination.total;
    pagination.value.totalPages = response.data.pagination.totalPages;
  } catch (e: any) {
    ShowToast.error({
      summary: t('errors.default'),
      detail: e.message,
      group: 'br',
    });
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event: any) => {
  pagination.value.currentPage = event.page + 1;
  pagination.value.limit = event.rows;
  fetchUsers();
};

const onSortChange = (event: any) => {
  const sortField = event.sortField;
  const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
  fetchUsers({ [`sort[${sortField}]`]: sortOrder });
};

onMounted(async () => {
  await fetchUsers();
});

watch(
  () => filters.value,
  newFilters => {
    const roleFilter = newFilters.role.value;
    const searchQuery = newFilters.global.value;

    fetchUsers({
      'filter[role]': roleFilter || undefined,
      search: searchQuery || undefined,
    });
  },
  { deep: true }
);
</script>

<template>
  <div>
    <DataTable
      :value="users"
      :lazy="true"
      :loading="loading"
      :paginator="true"
      :rows="pagination.limit"
      :totalRecords="pagination.total"
      @page="onPageChange"
      @sort="onSortChange"
      v-model:filters="filters"
      filterDisplay="menu"
      :globalFilterFields="[
        'login',
        'email',
        'surname',
        'firstname',
        'contact',
      ]"
      stripedRows
      sortField="createdAt"
      :sortOrder="-1"
      :pt="{ mask: '!bg-transparent !text-ash-600 backdrop-blur-sm' }"
    >
      <template #header>
        <div class="flex justify-content-between">
          <InputText
            v-model="filters['global'].value"
            :placeholder="$t('placeholders.search')"
          />
        </div>
      </template>

      <Column field="id" :header="$t('login.id')"></Column>
      <Column field="login" :header="$t('login.username')"></Column>
      <Column
        field="role"
        :header="$t('login.role')"
        sortable
        :showFilterMatchModes="false"
        :showApplyButton="false"
        :showClearButton="false"
        :filterMenuStyle="{ width: '14rem' }"
      >
        <template #body="{ data }">
          {{ getTranslatedRole(data.role) }}
        </template>
        <template #filter="{ filterModel, applyFilter }">
          <Select
            v-model="filterModel.value"
            :options="roles"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('placeholders.chooseRole')"
            @change="applyFilter"
          />
          <UiuxSeverityButton
            @click="() => clearRoleFilter(applyFilter)"
            type="reset"
          >
            {{ $t('buttons.clear') }}
          </UiuxSeverityButton>
        </template>
      </Column>
      <Column field="surname" :header="$t('info.surname')"></Column>
      <Column field="firstname" :header="$t('info.firstname')"></Column>
      <Column field="patronymic" :header="$t('info.patronymic')"></Column>
      <Column field="email" :header="$t('info.email')">
        <template #body="{ data }">
          <a
            :href="`mailto:${data.email}`"
            target="_blank"
            class="text-eph-700 hover:underline underline-offset-4"
            >{{ data.email }}</a
          >
        </template>
      </Column>
      <Column field="is_active" :header="$t('login.status')">
        <template #body="{ data }">
          <Tag
            :value="data.is_active ? $t('status.active') : $t('status.blocked')"
            :severity="data.is_active ? 'success' : 'danger'"
          />
        </template>
      </Column>
      <Column field="createdAt" :header="$t('login.createdAt')" sortable>
        <template #body="{ data }">
          {{ FormatDate.DDMMYYYY(data.createdAt) }}
        </template>
      </Column>
      <Column :header="$t('placeholders.actions')" style="width: 10rem">
        <template #body="{ data }">
          <UserActionsButtonGroup
            :user="data"
            @update="fetchUsers"
            @open-block-confirm="openBlockConfirmModal"
          />
        </template>
      </Column>
    </DataTable>

    <UiuxCustomConfirmation
      :message="
        t('confirm.block', {
          login: users.find(user => user.id === selectedUserId)?.login,
        })
      "
      :header="t('confirm.areYouSure')"
      :reject-label="t('buttons.cancel')"
      :accept-label="t('buttons.confirm')"
      :is-open="blockConfirmModalVisible"
      @confirm="blockUser"
      @reject="closeBlockConfirmModal"
    />
  </div>
</template>
