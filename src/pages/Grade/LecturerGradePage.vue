<template>
  <div>
    <h1>LecturerGradePage</h1>
    <p>Students for Assignment {{ assignmentId }}:</p>
    <div v-if="submissions.length === 0" class="text-center">No students found for this assignment.</div>
    <div v-else>
      <div v-for="submission in submissions" :key="submission.id" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">Student Name: {{ submission.student_name }}</h5>
          <p class="card-text">Grading Status: {{ submission.grading_status === 0 ? 'Not Graded' : 'Graded' }}</p>
          <p class="card-text">
            <button @click="downloadSubmissionFile(submission.file_name)" class="btn btn-info btn-sm">Download File</button>
          </p>
          <div class="form-group">
            <label for="grade">Grade:</label>
            <select v-model="submission.grade" class="form-control">
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="F">F</option>
            </select>
          </div>
          <button @click="submitGrade(submission)" class="btn btn-success btn-sm mt-2">Submit Grade</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assignmentId: this.$route.params.assignmentId,
      submissions: []
    };
  },
  created() {
    this.fetchSubmissions();
  },
  methods: {
    fetchSubmissions() {
      fetch(`http://localhost/PSM_api_server/grade/grades.php/submissions?assignment_id=${this.assignmentId}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            this.submissions = data.map(submission => ({
              ...submission,
              grade: submission.grade || '', // Initialize grade field
              grading_status: submission.grading_status // Ensure grading status is included
            }));
          } else {
            this.submissions = [];
          }
        })
        .catch(error => {
          console.error('Error fetching submissions:', error);
          this.submissions = [];
        });
    },
    downloadSubmissionFile(fileName) {
      const url = `http://localhost/PSM_api_server/grade/grades.php/downloadfile/${fileName}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
    },
    submitGrade(submission) {
      const payload = {
        student_id: submission.student_id,
        assignment_id: submission.assignment_id,
        grade: submission.grade,
        grading_status: submission.grade ? 1 : 0
      };
      fetch('http://localhost/PSM_api_server/grade/grades.php/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Grade was updated.') {
            alert('Grade updated successfully!');
            this.fetchSubmissions(); // Refresh the submissions list
          } else {
            alert('Failed to update grade.');
          }
        })
        .catch(error => {
          console.error('Error updating grade:', error);
          alert('Error updating grade.');
        });
    }
  }
};
</script>

<style>
.card {
  width: 100%;
  margin-top: 20px;
}
.text-center {
  text-align: center;
}
</style>
