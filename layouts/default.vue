<template>
  <div class="w-[100dvw] max-w-full md:flex md:flex-row">
    <aside class="flex md:block md:w-[18rem] md:flex-shrink-0 m-0 p-0">
      <AppSidebar />
    </aside>
    <main class="md:flex-grow m-0 overflow-auto">
      <AppHeader class="hidden md:block" />
      <div class="p-4 md:p-0">
        <slot></slot>
      </div>
    </main>
  </div>
  <section class="absolute bottom-0 left-0 w-full">
    <AudioPlayer />
  </section>
</template>
