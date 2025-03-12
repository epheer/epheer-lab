<template>
  <div
    class="absolute top-0 left-0 w-screen h-screen bg-ash-100 flex flex-col gap-2 justify-center items-center"
  >
    <div class="loader"></div>
  </div>
  <div class="absolute bottom-0 w-screen flex justify-center items-center">
    <BrandLogo class="mb-10 h-6 w-auto" />
  </div>
</template>

<style scoped>
.loader {
  width: 15px;
  aspect-ratio: 1;
  position: relative;
  animation: l9-0 1.5s infinite steps(2);
}
.loader::before,
.loader::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #000000;
}
.loader::before {
  box-shadow: 26px 0;
  transform: translateX(-26px);
  animation: l9-1 0.75s infinite linear alternate;
}
.loader::after {
  transform: translateX(13px) rotate(0deg) translateX(13px);
  animation: l9-2 0.75s infinite linear alternate;
}
@keyframes l9-0 {
  0%,
  49.9% {
    transform: scale(1);
  }
  50%,
  100% {
    transform: scale(-1);
  }
}
@keyframes l9-1 {
  100% {
    box-shadow: 52px 0;
  }
}
@keyframes l9-2 {
  100% {
    transform: translateX(13px) rotate(-180deg) translateX(13px);
  }
}
</style>
