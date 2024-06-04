import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import UserProfile from "@/pages/UserProfile.vue";
import Assignment from "@/pages/Assignment.vue";
import Grade from "@/pages/Grade.vue";
import Meeting from "@/pages/Meeting.vue";

//auth pages
import WelcomePage from "@/pages/Auth/Welcome.vue";
import LoginPage from "@/pages/Auth/Login.vue";
import RegisterPage from "@/pages/Auth/Register.vue";
import Dashboard from "@/pages/Dashboard.vue"

const routes = [
  {
    path: "/",
    name: "welcome",
    component: WelcomePage
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage
  },
  {
    path: "/", //dont touch
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "profile",
        name: "profile",
        component: UserProfile,
      },

      {
        path: "meeting",
        name: "meeting",
        component: Meeting,
      },

      {
        path: "grade",
        name: "grade",
        component: Grade,
      },
      {
        path: "assignment",
        name: "assignment",
        component: Assignment,
      },
    ],
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
