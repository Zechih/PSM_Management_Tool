<template>
  <div>
    <LecturerMeeting v-if="userRole === 'lecturer'" />
    <StudentMeeting v-else />
  </div>
</template>

<script>
import LecturerMeeting from './LecturerMeeting.vue';
import StudentMeeting from './StudentMeeting.vue';

export default {
  components: {
    LecturerMeeting,
    StudentMeeting
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