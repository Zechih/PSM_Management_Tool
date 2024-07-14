import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";

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
import Dashboard from "@/pages/Dashboard/Dashboard.vue"
import DashboardCalendar from "@/pages/Dashboard/DashboardCalendar.vue"

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
        path: "calendar",
        name: "calendar",
        component: DashboardCalendar,
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
        path: "meeting",
        name: "StudentMeeting",
        component: StudentMeeting,
      },
      {
        path: "meeting",
        name: "LecturerMeeting",
        component: LecturerMeeting,
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

export default routes;
