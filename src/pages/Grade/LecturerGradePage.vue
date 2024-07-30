<template>
  <div class="container">
    <h1>Lecturer Grading Page</h1>
    <p>Students for Assignment {{ assignmentId }}:</p>
    <div v-if="submissions.length === 0" class="text-center">
      No students found for this assignment.
    </div>
    <div v-else>
      <div
        v-for="submission in submissions"
        :key="submission.id"
        class="card mb-3"
      >
        <div class="card-body">
          <h5 class="card-title">
            Student Name: {{ submission.student_name }}
          </h5>
          <p class="card-text">
            Grading Status:
            <span :class="{'text-success': submission.grading_status == 1, 'text-danger': submission.grading_status == 0}">
              {{ submission.grading_status == 0 ? "Not Graded" : "Graded" }}
            </span>
          </p>
          <p class="card-text">
            <button style="background-color: #1394bb"
              @click="downloadSubmissionFile(submission.id)"
              class="btn btn-info btn-sm"
            >
              Download Student Submission
            </button>
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
          <button
            @click="submitGrade(submission)"
            class="btn btn-success btn-sm mt-2"
          >
            Submit Grade
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
      assignmentId: this.$route.params.assignmentId,
      submissions: [],
      notification: null,
    };
  },
  created() {
    this.fetchSubmissions();
  },
  methods: {
    async fetchSubmissions() {
      fetch(
        `http://localhost/PSM_api_server/grade/grades.php/submissions/${this.assignmentId}`,
      )
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            this.submissions = data.map((submission) => ({
              ...submission,
              grade: submission.grade || "", // Initialize grade field
              grading_status: submission.grading_status, // Ensure grading status is included
            }));
          } else {
            this.submissions = [];
          }
        })
        .catch((error) => {
          console.error("Error fetching submissions:", error);
          this.submissions = [];
        });
    },
    async downloadSubmissionFile(id) {
      const url = `http://localhost/PSM_api_server/grade/grades.php/downloadsubmission/${id}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    submitGrade(submission) {
      const payload = {
        student_id: submission.student_id,
        assignment_id: submission.assignment_id,
        grade: submission.grade,
        grading_status: submission.grade ? 1 : 0,
      };
      fetch("http://localhost/PSM_api_server/grade/grades.php/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == "Grade was updated.") {
            this.showNotification("Grade updated successfully!");
            this.fetchSubmissions(); // Refresh the submissions list
          } else {
            this.showNotification("Failed to update grade.");
          }
        })
        .catch((error) => {
          console.error("Error updating grade:", error);
          this.showNotification("Error updating grade.");
        });
    },
    showNotification(message) {
      this.notification = message;
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    },
  },
};
</script>

<style>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 15px;
  z-index: 1000;
}
.container {
  max-width: 800px;
}
.card {
  width: 100%;
  margin-top: 20px;
}
.text-center {
  text-align: center;
}
</style>
