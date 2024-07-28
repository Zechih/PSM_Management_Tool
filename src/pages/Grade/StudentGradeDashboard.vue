<template>
  <div>
    <h2>Your Assignments Status</h2>
    <div v-for="assignment in assignments" :key="assignment.id">
      <p>{{ assignment.name }} - {{ assignment.status }}</p>
      <button v-if="assignment.status === 'Graded'" @click="selectAssignment(assignment.id)">Check Grade</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assignments: []
    };
  },
  created() {
    this.fetchAssignments();
  },
  methods: {
    fetchAssignments() {
      const userId = this.$route.params.userId;
      fetch(`http://localhost/PSM_api_server/grade/grades.php/assignments?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          // Sort assignments by status: Submitted (0) before Graded (1)
          this.assignments = data.sort((a, b) => {
            if (a.status === 'Submitted' && b.status === 'Graded') return -1;
            if (a.status === 'Graded' && b.status === 'Submitted') return 1;
            return 0;
          });
        })
        .catch(error => {
          console.error('Error fetching assignments:', error);
        });
    },
    selectAssignment(assignmentId) {
      this.$router.push({ name: 'StudentGradePage', params: { assignmentId } });
    }
  }
};
</script>

<style scoped>
/* Add specific styles here */
</style>
