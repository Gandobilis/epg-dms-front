import {createRouter} from "vue-router"
import {createWebHistory} from "vue-router"
import routes from "./routes"

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router