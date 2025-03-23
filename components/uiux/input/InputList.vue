<script setup lang="ts">
import ShowToast from '~/utils/showToast';

const props = defineProps<{
  limit?: number;
  title?: string;
  placeholder?: string;
}>();

const localList = defineModel<string[]>('list', {
  required: true,
  default: [],
});

ShowToast.initialize(useToast());

const addItem = (): void => {
  if (props.limit === undefined || localList.value.length < props.limit) {
    localList.value = [...localList.value, ''];
  } else {
    ShowToast.error({ detail: `Достигнуто максимальное количество` });
  }
};

const removeItem = (index: number): void => {
  localList.value = localList.value.filter((_, i) => i !== index);
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-ash-700">{{ title }}</span>
      <Button
        @click="addItem"
        unstyled
        class="text-ash-600 hover:text-ash-800 duration-300"
      >
        <UiuxIconPlus />
      </Button>
    </div>

    <TransitionGroup name="list" tag="div" class="flex flex-col gap-2">
      <div
        v-for="(item, index) in localList"
        :key="index"
        class="flex items-center justify-between gap-3"
      >
        <FloatLabel variant="on" class="w-full">
          <InputText v-model="localList[index]" type="text" fluid />
          <label>{{ placeholder }} {{ index + 1 }}</label>
        </FloatLabel>

        <Button
          @click="removeItem(index)"
          unstyled
          class="text-ash-600 hover:text-ash-800 duration-300 ease-in-out"
        >
          <UiuxIconTrashBox />
        </Button>
      </div>
    </TransitionGroup>
  </div>
</template>
