<template>
  <div>
    <LecturerAssignment v-if="userRole === 'lecturer'" />
    <StudentAssignment v-else />
  </div>
</template>

<script>
import LecturerAssignment from './LecturerAssignment.vue';
import StudentAssignment from './StudentAssignment.vue';

export default {
  components: {
    LecturerAssignment,
    StudentAssignment
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