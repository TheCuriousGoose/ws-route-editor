<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue';

const router = useRouter();
const isRouteEditor = ref(true);

function toggleEditor() {
  isRouteEditor.value = !isRouteEditor.value;

  if (isRouteEditor.value) {
    router.push({ name: 'editor' });
  } else {
    router.push({ name: 'viewer' });
  }
}

</script>

<template>
  <div class="position-fixed w-100 p-3 top-0">
    <button class="btn btn-secondary" @click="toggleEditor">
      {{ isRouteEditor ? 'Open viewer' : 'Open editor' }}
    </button>
  </div>
  <div class="mt-5 pt-5 px-4">
    <RouterView />
  </div>
</template>
