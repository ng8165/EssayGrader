import { createRouter, createWebHistory } from 'vue-router'
import SubmitView from "../views/Submit.vue";
import FeedbackView from "../views/Feedback.vue";
import AdminView from "../views/Admin.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", component: SubmitView },
        { path: "/feedback/:id", component: FeedbackView },
        { path: "/admin", component: AdminView },
    ]
})

export default router;
