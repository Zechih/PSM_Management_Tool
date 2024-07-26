import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";

import NotFound from "@/pages/NotFoundPage.vue";

import UserProfile from "@/pages/Profile/UserProfile.vue";

import Assignment from "@/pages/Assignment/Assignment.vue";
import StudentAssignment from "@/pages/Assignment/StudentAssignment.vue";
import LecturerAssignment from "@/pages/Assignment/LecturerAssignment.vue";

import Grade from "@/pages/Grade/Grade.vue";
import StudentGradePage from "@/pages/Grade/StudentGradePage.vue"; 
import LecturerGradePage from "@/pages/Grade/LecturerGradePage.vue"; 
import StudentDashboard from "@/pages/Grade/StudentGradeDashboard.vue"; 
import LecturerDashboard from "@/pages/Grade/LecturerGradeDashboard.vue"; 

import Meeting from "@/pages/Meeting/Meeting.vue";
import StudentMeeting from "@/pages/Meeting/StudentMeeting.vue";
import LecturerMeeting from "@/pages/Meeting/LecturerMeeting.vue";

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
      {
        path: "student/assignment",
        name: "StudentAssignment",
        component: StudentAssignment,
      },
      {
        path: "lecturer/assignment",
        name: "LecturerAssignment",
        component: LecturerAssignment,
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