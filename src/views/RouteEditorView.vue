<script setup>
import { ref, onMounted } from 'vue';
import { useNodeStore } from '@/stores/useNodeStore';

const nodeStore = useNodeStore();
const nodeToBeEdited = ref(null);
const form = ref({
    description: ''
});

function startNodeDrag(index) {
    nodeStore.setDraggedNode(index);
    document.addEventListener('mousemove', moveNode);
    document.addEventListener('mouseup', stopNodeDrag);
}

function stopNodeDrag() {
    nodeStore.clearDraggedNode();
    document.removeEventListener('mousemove', moveNode);
    document.removeEventListener('mouseup', stopNodeDrag);
}

function moveNode(event) {
    if (nodeStore.draggedNode === null) return;

    const { left, top, width, height } = nodeStore.getMainBounds();
    const nodeSize = 100;

    let newX = event.clientX - left - nodeSize / 2;
    let newY = event.clientY - top - nodeSize / 2;

    newX = Math.max(0, Math.min(newX, width - nodeSize));
    newY = Math.max(0, Math.min(newY, height - nodeSize));

    nodeStore.updateNodePosition(nodeStore.draggedNode, newX, newY);
}

function startEditingNode(node) {
    nodeToBeEdited.value = node;
    form.value.description = node.description;
}

function saveNode() {
    if (nodeToBeEdited.value) {
        nodeStore.saveNode(nodeToBeEdited.value.id, form.value.description);
        nodeToBeEdited.value = null;
    }
}

onMounted(() => {
    if (nodeStore.nodes.length > 1) return;

    const { width, height } = nodeStore.getMainBounds();
    const nodeSize = 100;

    nodeStore.nodes[0].x = width / 2 - nodeSize / 2;
    nodeStore.nodes[0].y = height / 2 - nodeSize / 2;
});
</script>

<template>
    <main id="main">
        <svg class="link-canvas" xmlns="http://www.w3.org/2000/svg">
            <line v-for="(link, index) in nodeStore.links" :key="index" :x1="link.start.x" :y1="link.start.y"
                :x2="link.end.x" :y2="link.end.y" stroke="black" stroke-width="2" @click.stop="deleteLink(index)"
                class="link" />
        </svg>

        <div v-for="(node, index) in nodeStore.nodes" :key="node.id">
            <div class="node" :style="{ left: node.x + 'px', top: node.y + 'px' }" @mousedown="startNodeDrag(index)"
                @mouseenter="nodeStore.nodes[index].interfaceVisible = true"
                @mouseleave="nodeStore.nodes[index].interfaceVisible = false">
                <div class="node-interface" v-if="node.interfaceVisible == true">
                    <div class="buttons">
                        <button class="btn btn-danger" v-if="index > 0" @click="nodeStore.deleteNode(index)">
                            Delete
                        </button>
                        <button class="btn btn-primary" @click="startEditingNode(node)">
                            Edit
                        </button>
                    </div>
                    <div class="quadrant top" @click="nodeStore.addNode(index, 1)"
                        :class="{ active: node.connections.has(1) }">
                        <span>1</span>
                    </div>
                    <div class="quadrant right" @click="nodeStore.addNode(index, 2)"
                        :class="{ active: node.connections.has(2) }">
                        <span>2</span>
                    </div>
                    <div class="quadrant left" @click="nodeStore.addNode(index, 3)"
                        :class="{ active: node.connections.has(3) }">
                        <span>3</span>
                    </div>
                    <div class="quadrant bottom" @click="nodeStore.addNode(index, 4)"
                        :class="{ active: node.connections.has(4) }">
                        <span>4</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="position-absolute w-25" id="edit" v-if="nodeToBeEdited">
            <div class="card">
                <div class="card-header">
                    <h1>Route Editor</h1>
                </div>
                <div class="card-body">
                    <label for="description">Description</label>
                    <textarea id="description" class="form-control mb-2" rows="6" v-model="form.description"></textarea>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary" @click="nodeToBeEdited = null">Cancel</button>
                    <button class="btn btn-primary" @click="saveNode">Save</button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
#edit {
    width: 100% !important;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 30;
    background-color: rgba(0, 0, 0, 0.5);

    .card {
        width: 25%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

main {
    position: relative;
    width: 100%;
    height: 85vh;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    overflow: hidden;

    .link-canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}

.node {
    position: absolute;
    background-color: #2ac386;
    height: 100px;
    width: 100px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s;
    z-index: 3;

    .node-interface {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        transform: translate(25%, 25%);

        .buttons {
            position: absolute;
            display: flex;
            top: 0;
            justify-content: space-between;
            width: 235px;
            transform: translate(-43%, 15%);
            left: 0;
        }

        .quadrant {
            position: absolute;
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            rotate: 45deg;
            border: 2px solid black;

            span {
                transform: rotate(-45deg);
            }

            &:hover {
                background-color: #383e3c;
            }

            &.active {
                background-color: #606b67;
            }
        }

        .top {
            transform: translate(-50%, -50%);
            border-radius: 100% 0 0 0;
        }

        .right {
            transform: translate(50%, -50%);
            border-radius: 0 100% 0 0;
        }

        .left {
            transform: translate(-50%, 50%);
            border-radius: 0 0 0 100%;
        }

        .bottom {
            transform: translate(50%, 50%);
            border-radius: 0 0 100% 0;
        }
    }
}
</style>
