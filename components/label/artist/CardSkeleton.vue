<template>
  <div>
    <Card
      class="inline-flex justify-center items-center w-36 md:w-48"
      :pt="{ root: '!shadow-none' }"
    >
      <template #title>
        <Avatar unstyled class="w-24 h-24 md:w-36 md:h-36 rounded-full">
          <Skeleton shape="circle" class="!w-full !h-full" />
        </Avatar>
      </template>
      <template #content>
        <Skeleton class="w-full !h-6 mt-2" />
      </template>
    </Card>
  </div>
</template>
<script setup lang="ts"></script>
