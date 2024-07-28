<template>
  <div>
    <h2>Lecturer Dashboard</h2>
    <p>Select an assignment to grade:</p>
    <button v-for="assignment in assignments" :key="assignment.id" @click="gradeAssignment(assignment.id)">
      {{ assignment.name }}
    </button>
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
      const token = localStorage.getItem('token');
      fetch('http://localhost/PSM_api_server/assignment/assignment.php/getassignmentlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })        .then(response => response.json())
        .then(data => {
          this.assignments = data;
        })
        .catch(error => {
          console.error('Error fetching assignments:', error);
        });
    },
    gradeAssignment(assignmentId) {
      this.$router.push(`/lecturer/grade/${assignmentId}`);
    }
  }
};
</script>
