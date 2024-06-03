import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import UserProfile from "@/pages/UserProfile.vue";
import Assignment from "@/pages/Assignment.vue";
import Grade from "@/pages/Grade.vue";
import Meeting from "@/pages/Meeting.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/profile",
    children: [
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
