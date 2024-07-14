<template>
  <div>
    <h2>Grading Page</h2>
    <div v-for="submission in studentSubmissions" :key="submission.studentId">
      <h4>Student ID: {{ submission.studentId }}</h4>
      <h4>Student Name: {{ submission.studentName }}</h4>
      <div v-if="submission.studentSubmission">
        <h3>Submitted File:</h3>
        <p><a :href="submission.studentSubmission.file_url" target="_blank">{{ submission.studentSubmission.file_name }}</a></p>
        <div>
          <label for="grade">Grade:</label>
          <input type="number" v-model="submission.grade" id="grade" />
        </div>
        <button @click="submitGrade(submission)">Submit Grade</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentSubmissions: [
        {
          studentId: "A21EC0150",
          studentName: "Yong Kok Siong",
          studentSubmission: {
            file_name: "Assignment1_Submission.pdf",
            file_url: "http://example.com/assignment1_submission.pdf",
          },
          grade: null
        },
        {
          studentId: "A21EC0021",
          studentName: "Darren Leong Kah Xiang",
          studentSubmission: {
            file_name: "Assignment2_Submission.pdf",
            file_url: "http://example.com/assignment2_submission.pdf",
          },
          grade: null
        },
        {
          studentId: "A21EC0146",
          studentName: "Yam Yuan Zhan",
          studentSubmission: {
            file_name: "Assignment3_Submission.pdf",
            file_url: "http://example.com/assignment3_submission.pdf",
          },
          grade: null
        }
      ]
    };
  },
  methods: {
    submitGrade(submission) {
      // Simulate successful grade submission
      alert(`Grade for ${submission.studentName} submitted successfully`);
      // Redirect back to the lecturer dashboard
      this.$router.push('/lecturer');
    }
  }
};
</script>

<style scoped>
/* Add specific styles here */
</style>
