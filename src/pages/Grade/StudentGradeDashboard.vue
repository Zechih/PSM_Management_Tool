<template>
  <div>
    <h2>Your Submissions</h2>
    <div v-if="submissions.length === 0" class="text-center">No submissions found.</div>
    <div v-else>
      <div v-for="submission in submissions" :key="submission.id" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">Assignment: {{ submission.assignment_name }}</h5>
          <p class="card-text">
            Grading Status: 
            <span :class="{'text-success': submission.grading_status === 1, 'text-danger': submission.grading_status === 0}">
              {{ submission.grading_status === 1 ? 'Graded' : 'Submitted' }}
            </span>
          </p>
          <button 
            :class="{'btn btn-success': submission.grading_status === 1, 'btn btn-secondary': submission.grading_status === 0}"
            :disabled="submission.grading_status === 0"
            @click="checkGrade(submission)"
          >
            Check Grade
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submissions: []
    };
  },
  created() {
    this.fetchSubmissions();
  },
  methods: {
    fetchSubmissions() {
      const userId = 3; // Replace this with the actual method to get the userId
      fetch(`http://localhost/PSM_api_server/grade/grades.php/submissionsstudent?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data); // Log the response
          if (Array.isArray(data)) {
            this.submissions = data;
          } else {
            this.submissions = [];
          }
        })
        .catch(error => {
          console.error('Error fetching submissions:', error);
          this.submissions = [];
        });
    },
    checkGrade(submission) {
      if (submission.grading_status === 1) {
        // Logic for handling grade check (e.g., navigate to a grade details page)
        alert(`Grade for ${submission.assignment_name}: ${submission.grade}`);
      }
    }
  }
};
</script>

<style scoped>
.card {
  width: 100%;
  margin-top: 20px;
}
.text-success {
  color: green;
}
.text-danger {
  color: red;
}
.btn-secondary {
  cursor: not-allowed;
}
</style>
