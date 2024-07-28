<template>
  <div>
    <h2>Grading Page</h2>
    <div v-for="submission in studentSubmissions" :key="submission.student_id">
      <h4>Student ID: {{ submission.student_id }}</h4>
      <h4>Student Name: {{ submission.studentName }}</h4>
      <div v-if="submission.file_url">
        <h3>Submitted File:</h3>
        <p><a :href="submission.file_url" target="_blank">{{ submission.file_url }}</a></p>
        <div>
          <label for="grade">Grade:</label>
          <input type="text" v-model="submission.grade" id="grade" />
        </div>
        <button @click="submitGrade(submission)">Submit Grade</button>
      </div>
      <p>Submitted Time: {{ submission.submittedtime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentSubmissions: []
    };
  },
  created() {
    this.fetchStudentSubmissions();
  },
  methods: {
    fetchStudentSubmissions() {
      const assignmentId = this.$route.params.assignmentId;
      fetch(`http://localhost/PSM_api_server/grade/grades.php/submissions?assignmentId=${assignmentId}`)
        .then(response => response.json())
        .then(data => {
          this.studentSubmissions = data;
        })
        .catch(error => {
          console.error('Error fetching student submissions:', error);
        });
    },
    submitGrade(submission) {
      const gradeData = {
        assignment_id: this.$route.params.assignmentId,
        student_id: submission.student_id,
        grade: submission.grade
      };

      fetch('http://localhost/PSM_api_server/grade/grades.php/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gradeData)
      })
        .then(response => response.json())
        .then(data => {
          alert(`Grade for ${submission.studentName} submitted successfully`);
        })
        .catch(error => {
          console.error('Error submitting grade:', error);
        });
    }
  }
};
</script>

<style scoped>
/* Add specific styles here */
</style>
