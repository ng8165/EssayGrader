import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import FeedbackView from "../views/Feedback.vue";
import AdminView from "../views/Admin.vue";
import NotFoundView from "../views/NotFound.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", component: HomeView },
        { path: "/feedback/:id", component: FeedbackView },
        { path: "/admin", component: AdminView },
        { path: "/:pathMatch(.*)*", component: NotFoundView }
    ]
})

export default router;
