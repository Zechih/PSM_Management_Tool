<!-- <template>
  <div>
    <h2>Select Your Role</h2>
    <button @click="selectRole('lecturer')">Lecturer</button>
    <button @click="selectRole('student')">Student</button>
  </div>
</template>

<script>
export default {
  methods: {
    selectRole(role) {
      if (role === 'lecturer') {
        this.$router.push('/lecturer/dashboard');
      } else if (role === 'student') {
        this.$router.push('/student/dashboard');
      }
    }
  }
};

</script> -->

<template>
  <div>
    <LecturerGradeDashboard v-if="userRole === 'lecturer'" />
    <StudentGradeDashboard v-else />
  </div>
</template>

<script>
import LecturerGradeDashboard from './LecturerGradeDashboard.vue';
import StudentGradeDashboard from './StudentGradeDashboard.vue';

export default {
  components: {
    LecturerGradeDashboard,
    StudentGradeDashboard
  },
  data() {
    return {
      userRole: ''
    };
  },
  mounted() {
    // Get user role from JWT token
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    this.userRole = payload.role;
  }
};
</script>

<style></style>