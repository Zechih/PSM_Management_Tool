<template>
  <div>
    <h2>Your Assignments Status</h2>
    <div v-for="assignment in assignments" :key="assignment.id">
      <p>{{ assignment.name }} - {{ assignment.status }}</p>
      <button @click="selectAssignment(assignment.id)">Check Grade</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assignments: [
        { id: 1, name: 'Assignment 1', status:'Graded'  },
        { id: 2, name: 'Assignment 2', status: 'Viewed' },
        { id: 3, name: 'Assignment 3', status:  'Submitted' }
        // Simulated assignment data with static statuses
      ]
    };
  },
  methods: {
    selectAssignment(assignmentId) {
      this.$router.push({ name: 'StudentGradePage', params: { assignmentId } }); // Route to the student grade page with the selected assignment ID
    }
  }
};
</script>

<style scoped>
/* Add specific styles here */
</style>
