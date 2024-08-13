import { createRouter, createWebHistory } from "vue-router";
import RouteViewerView from "@/views/RouteViewerView.vue";
import RouteEditorView from "@/views/RouteEditorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/editor",
      name: "editor",
      component: RouteEditorView,
    },
    {
      path: "/viewer",
      name: "viewer",
      component: RouteViewerView,
    },
    {
      path: "/",
      redirect: "/editor",
    }
  ],
});

export default router;
