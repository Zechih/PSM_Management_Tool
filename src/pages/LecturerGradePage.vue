<template>
  <div>
    <h2>Grading Page</h2>
    <p>Student ID: {{ studentId }}</p>
    <div v-if="studentSubmission">
      <h3>Submitted File:</h3>
      <p><a :href="studentSubmission.file_url" target="_blank">{{ studentSubmission.file_name }}</a></p>
      <div>
        <label for="grade">Grade:</label>
        <input type="number" v-model="grade" id="grade" />
      </div>
      <button @click="submitGrade">Submit Grade</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentId: null,
      studentSubmission: {
        file_name: "Assignment1_Submission.pdf", // Changed file name
        file_url: "http://example.com/assignment1_submission.pdf", // Simulated file URL
      },
      grade: null
    };
  },
  methods: {
    submitGrade() {
      // Simulate successful grade submission
      alert('Grade submitted successfully');
      // Redirect back to the lecturer dashboard
      this.$router.push('/lecturer');
    }
  },
  mounted() {
    // Extract the studentId parameter from the route
    this.studentId = this.$route.params.studentId;
    // Fetch student submission data based on the studentId
    // This is where you would make an API call to get the submission data
    // For demonstration purposes, I'm using simulated data
    this.studentSubmission = {
      file_name: `Assignment${this.studentId}_Submission.pdf`, // Modified file name
      file_url: `http://example.com/assignment${this.studentId}_submission.pdf`, // Modified file URL
    };
  }
};
</script>

<style scoped>
/* Add specific styles here */
</style>
