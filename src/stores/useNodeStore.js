import { defineStore } from "pinia";

export const useNodeStore = defineStore("nodeStore", {
  state: () => ({
    draggedNode: null,
    dragged: false,
    links: [],
    nodes: [
      {
        id: 1,
        description: "This is a description",
        interfaceVisible: false,
        x: 0,
        y: 0,
        connections: new Map(),
      },
    ],
    nodeToBeEdited: null,
    form: {
      description: "",
    },
  }),
  actions: {
    setDraggedNode(index) {
      this.draggedNode = index;
    },
    clearDraggedNode() {
      this.draggedNode = null;
      this.dragged = false;
    },
    updateNodePosition(index, x, y) {
      const node = this.nodes[index];
      node.x = x;
      node.y = y;
      this.dragged = true;
      this.updateLinks();
    },
    deleteNode(index) {
      if (this.nodes.length === 1 || index === 0) return;

      const node = this.nodes[index];

      if (node.connections.size > 1) {
        return;
      }

      this.nodes = this.nodes.filter((n) => n.id !== node.id);
      this.links = this.links.filter((link) => {
        return (
          link.start.x !== node.x &&
          link.start.y !== node.y &&
          link.end.x !== node.x &&
          link.end.y !== node.y
        );
      });

      this.nodes.forEach((n) => {
        n.connections.forEach((value, key) => {
          if (value.id === node.id) {
            n.connections.delete(key);
          }
        });
      });

      this.updateLinks();
    },
    editNode(index) {
      this.nodeToBeEdited = index;
      let node = this.nodes[index];

      if (node) {
        this.form.description = node.description;
      }
    },
    saveNode(nodeId, description) {
      const node = this.nodes.find((n) => n.id === nodeId);

      if (node) {
        node.description = description;
      }
    },
    addNode(parentIndex, direction) {
      if (this.dragged) {
        this.dragged = false;
        return;
      }

      const parent = this.nodes[parentIndex];
      if (parent.connections.has(direction)) return;

      const newNode = {
        id: this.nodes.length + 1,
        description: "This is node " + (this.nodes.length + 1),
        interfaceVisible: false,
        x: 0,
        y: 0,
        connections: new Map(),
      };

      this.nodes.push(newNode);

      parent.connections.set(direction, {
        id: newNode.id,
        name: "",
      });
      this.nodes[this.nodes.length - 1].connections.set(5 - direction, {
        id: parent.id,
        name: "",
      });

      const nodeSize = 100;
      const newPosition = this.calculateNewPosition(parentIndex, direction);

      newNode.x = newPosition.x;
      newNode.y = newPosition.y;

      this.links.push({
        start: { x: parent.x + nodeSize / 2, y: parent.y + nodeSize / 2 },
        end: { x: newNode.x + nodeSize / 2, y: newNode.y + nodeSize / 2 },
      });
    },
    calculateNewPosition(parentIndex, direction) {
      const parent = this.nodes[parentIndex];
      const offset = 150;
      let x = parent.x;
      let y = parent.y;

      switch (direction) {
        case 1:
          y -= offset; // Up
          break;
        case 2:
          x += offset; // Right
          break;
        case 3:
          x -= offset; // Left
          break;
        case 4:
          y += offset; // Down
          break;
      }

      const { width, height } = this.getMainBounds();

      x = Math.max(0, Math.min(x, width - 100));
      y = Math.max(0, Math.min(y, height - 100));

      return { x, y };
    },
    updateLinks() {
      this.links = [];
      this.nodes.forEach((node) => {
        node.connections.forEach((connection) => {
          const parent = this.nodes.find((n) => n.id === node.id);
          const child = this.nodes.find((n) => n.id === connection.id);

          if (parent && child) {
            this.links.push({
              start: { x: parent.x + 50, y: parent.y + 50 },
              end: { x: child.x + 50, y: child.y + 50 },
            });
          }
        });
      });
    },
    getMainBounds() {
      const mainElement = document.getElementById("main");
      return mainElement
        ? {
            left: mainElement.offsetLeft,
            top: mainElement.offsetTop,
            width: mainElement.offsetWidth,
            height: mainElement.offsetHeight,
          }
        : { left: 0, top: 0, width: 0, height: 0 };
    },
  },
});
