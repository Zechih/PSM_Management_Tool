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
            <span :class="{'text-success': submission.grading_status == 1, 'text-danger': submission.grading_status == 0}">
              {{ submission.grading_status == 1 ? 'Graded' : 'Submitted' }}
            </span>
          </p>
          <button 
            :class="{'btn btn-success': submission.grading_status == 1, 'btn btn-secondary': submission.grading_status == 0}"
            @click="checkGrade(submission)"
          >
            Check Grade
          </button>
        </div>
      </div>
    </div>

    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submissions: [],
      error: null,
      notification: null,
    };
  },
  created() {
    this.fetchSubmissions();
  },
  methods: {
    decodeToken() {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    },
    async fetchSubmissions() {
      const studentId = this.decodeToken();
      if (!studentId) {
        this.error = "Failed to decode token.";
        return;
      }

      try {
        const response = await fetch(`http://localhost/PSM_api_server/grade/grades.php/submissionsstudent/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          this.submissions = data;
        } else {
          this.error = data.message || "Failed to fetch submissions.";
        }
      } catch (error) {
        this.error = "An error occurred. Please try again.";
      }
    },
    checkGrade(submission) {
      if (submission.grading_status == 1) {
        this.showNotification(`Grade for ${submission.assignment_name}: ${submission.grade}`);
      } else {
        this.showNotification("The assignment is still grading. Please wait patiently.");
      }
    },
    showNotification(message) {
      this.notification = message;
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    },
  }
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 15px;
  z-index: 1000;
}
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
