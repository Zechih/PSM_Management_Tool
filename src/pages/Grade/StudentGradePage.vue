<template>
  <div v-if="filteredAssignment">
    <h2>Your Grades</h2>
    <div>
      <h3>Assignment {{ filteredAssignment.id }}</h3>
      <p>Submission Time: {{ filteredAssignment.submissionTime }}</p>
      <p>Submission File: <a :href="filteredAssignment.fileUrl" target="_blank">{{ filteredAssignment.fileName }}</a></p>
      <p>Status of Grading: {{ filteredAssignment.gradingStatus }}</p>
      <p>Grade of the Project: {{ filteredAssignment.grade }}</p>
    </div>
  </div>
  <div v-else>
    <p>No assignment found with ID: {{ assignmentId }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assignments: [
        { 
          id: 1, 
          submissionTime: '2024-06-01 14:30:00', 
          fileName: 'Assignment1_Submission.pdf', 
          fileUrl: 'http://example.com/assignment1_submission.pdf', 
          gradingStatus: 'Graded', 
          grade: 'A' 
        },
        { 
          id: 2, 
          submissionTime: '2024-06-02 10:45:00', 
          fileName: 'Assignment2_Submission.docx', 
          fileUrl: 'http://example.com/assignment2_submission.docx', 
          gradingStatus: 'Viewed', 
          grade: '-' 
        },
        { 
          id: 3, 
          submissionTime: '2024-06-03 09:15:00', 
          fileName: 'Assignment3_Submission.txt', 
          fileUrl: 'http://example.com/assignment3_submission.txt', 
          gradingStatus: 'Submitted', 
          grade: '-' 
        }
      ],
      assignmentId: null // Variable to store the assignment ID from the URL
    };
  },
  computed: {
    filteredAssignment() {
      if (this.assignmentId) {
        return this.assignments.find(assignment => assignment.id === parseInt(this.assignmentId));
      } else {
        return null;
      }
    }
  },
  created() {
    // Extract the assignment ID from the URL
    const url = window.location.href;
    const lastSlashIndex = url.lastIndexOf('/');
    this.assignmentId = url.substring(lastSlashIndex + 1);
  }
};
</script>

<style scoped>
/* Add specific styles here */
</style>
