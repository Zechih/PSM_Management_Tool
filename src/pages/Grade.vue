<template>
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

</script>
