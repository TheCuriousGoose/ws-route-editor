<script setup>
import { ref, computed } from 'vue';
import { useNodeStore } from '@/stores/useNodeStore';

const nodeStore = useNodeStore();
const currentNodeId = ref(nodeStore.nodes[0]?.id); // Start with the root node
const currentNode = computed(() => nodeStore.nodes.find(node => node.id === currentNodeId.value));

function navigate(direction) {
  const node = currentNode.value;
  const connection = node.connections.get(direction);
  if (connection) {
    const targetNode = nodeStore.nodes.find(n => n.id === connection.id);
    if (targetNode) {
      currentNodeId.value = targetNode.id;
    }
  }
}

function canNavigate(direction) {
  return currentNode.value.connections.has(direction);
}

</script>

<template>
  <div class="view-mode d-flex flex-column justify-content-center align-items-center">

    <div v-if="currentNode" class="node-content text-center p-3 bg-light border rounded">
      <h1>{{ currentNode.description }}</h1>
    </div>

    <!-- Navigation controls -->
    <div class="controls mt-3 d-flex justify-content-around w-75 p-3">
      <button v-if="canNavigate(1)" class="btn btn-primary" @click="navigate(1)">Up</button>
      <button v-if="canNavigate(4)" class="btn btn-primary" @click="navigate(4)">Down</button>
      <button v-if="canNavigate(3)" class="btn btn-primary" @click="navigate(3)">Left</button>
      <button v-if="canNavigate(2)" class="btn btn-primary" @click="navigate(2)">Right</button>
    </div>

  </div>
</template>

<style scoped>
.view-mode {
  position: relative;
  width: 100%;
  height: 85vh;
  border-radius: 1rem;
  overflow: hidden;
  background-color: #f8f9fa;
  color: black;
}

.node-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.controls button {
  width: 100px;
  z-index: 50;
}

.position-indicator {
  z-index: 10;
}
</style>
