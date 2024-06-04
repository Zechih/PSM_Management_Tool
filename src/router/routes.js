import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import NotFound from "@/pages/NotFoundPage.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Assignment from "@/pages/Assignment.vue";
import Grade from "@/pages/Grade.vue";
import Meeting from "@/pages/Meeting.vue";
import StudentDashboard from "@/pages/StudentDashboard.vue"; // Import the StudentDashboard component
import StudentGradePage from "@/pages/StudentGradePage.vue"; // Import the StudentGradePage component
import LecturerDashboard from "@/pages/LecturerDashboard.vue"; // Import the LecturerDashboard component
import LecturerGradePage from "@/pages/LecturerGradePage.vue"; // Import the LecturerGradePage component

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
      {
        path: "lecturer/dashboard", // Define the route for the lecturer dashboard
        name: "LecturerDashboard", // Assign a name to the route
        component: LecturerDashboard, // Specify the component for the route
      },
      {
        path: "lecturer/grade/:assignmentId", // Define the route for the lecturer grade page
        name: "LecturerGradePage", // Assign a name to the route
        component: LecturerGradePage, // Specify the component for the route
      },
      {
        path: "student/dashboard", // Define the route for the student dashboard
        name: "StudentDashboard", // Assign a name to the route
        component: StudentDashboard, // Specify the component for the route
      },
      {
        path: "student/assignment/:assignmentId", // Define the route for the student grade page
        name: "StudentGradePage", // Assign a name to the route
        component: StudentGradePage, // Specify the component for the route
      },
    ],
  },
  { path: "*", component: NotFound },
];

export default routes;
