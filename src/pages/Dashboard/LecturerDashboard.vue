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
      assignments: [
        { id: 1, name: 'Assignment 1' },
        { id: 2, name: 'Assignment 2' },
        { id: 3, name: 'Assignment 3' }
      ]
    };
  },
  methods: {
    gradeAssignment(assignmentId) {
      this.$router.push(`/lecturer/grade/${assignmentId}`);
    }
  }
};
</script>
