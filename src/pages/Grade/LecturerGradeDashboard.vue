<template>
  <div class="container mt-5">
    <h1 class="mb-4">Lecturer Grade Dashboard</h1>
    <p>Select an assignment to grade:</p>
    <div v-if="assignments.length === 0" class="alert alert-info" role="alert">
      No assignments found.
    </div>
    <ul class="list-group" v-else>
      <li
        class="list-group-item list-group-item-action"
        v-for="assignment in assignments"
        :key="assignment.id"
        @click="gradeAssignment(assignment.id)"
      >
        {{ assignment.name }} - Due: {{ assignment.due_date }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assignments: []
    };
  },
  mounted() {
    this.fetchAssignments();
  },
  methods: {
    fetchAssignments() {
      fetch('http://localhost/PSM_API_SERVER/assignment/assignment.php/getassignmentlist')
        .then(response => response.json())
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

<style>
.container {
  max-width: 800px;
}
.list-group-item-action {
  cursor: pointer;
}
</style>
