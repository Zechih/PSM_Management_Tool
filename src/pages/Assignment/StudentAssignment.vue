<template>
  <div class="student-container">
    <h1 class="header">Student Assignment Submissions</h1>

    <div class="assignment-list">
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else-if="assignments.length === 0" class="no-assignments">No assignments available.</div>
      <div v-else v-for="assignment in assignments" :key="assignment.id" class="assignment-item">
        <div class="assignment-details">
          <h3>{{ assignment.name }}</h3>
          <p><strong>Set Date:</strong> {{ formatDateTime(assignment.set_time) }}</p>
          <p><strong>Due Date:</strong> {{ formatDateTime(assignment.due_date) }}</p>
          <p><strong>Description:</strong> {{ assignment.description }}</p>
          <p><strong>Remaining Time:</strong> {{ calculateRemainingTime(assignment.due_date) }}</p>
          <p v-if="assignment.file_name">
            <strong>File:</strong> {{ assignment.file_name }}
            <button @click="downloadFile(assignment.id)" style="background-color: #1394bb" class="button small-button">Download</button>
          </p>
        </div>

        <div class="assignment-form">
          <form @submit.prevent="submitAssignment(assignment.id)">
            <div>
              <label for="file">File:</label>
              <input type="file" :data-assignment-id="assignment.id" @change="handleFileUpload" required />
            </div>
            <button type="submit">Submit Assignment</button>
          </form>
        </div>

        <div class="submission-list">
          <div v-if="getSubmissions(assignment.id).length === 0" class="no-submissions">No submissions found.</div>
          <div v-else v-for="submission in getSubmissions(assignment.id)" :key="submission.id" class="submission-item">
            <h3>{{ submission.assignmentName }}</h3>
            <p><strong>Your Submission:</strong></p>
            <p v-if="submission.file_name">
              <strong>File:</strong> {{ submission.file_name }}
              <button style="background-color: #1394bb" @click="downloadFile(submission.id)" class="button small-button">Download</button>
            </p>
            <button @click="deleteSubmission(submission.id)" class="button delete-button">Delete</button>
          </div>
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
      assignments: [],
      submissions: [],
      files: {},
      error: null,
      notification: null // Add notification state
    };
  },
  methods: {
    decodeToken() {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    },
    async fetchAll() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost/PSM_api_server/assignment/assignment.php/getassignmentlist', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          this.assignments = data;
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred. Please try again.";
      }
    },
    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleDateString('en-GB', options);
    },
    calculateRemainingTime(dueDate) {
    const currentTime = new Date();
    const dueTimeDate = new Date(dueDate);
    const remainingTime = dueTimeDate - currentTime;

    if (isNaN(remainingTime) || remainingTime < 0) {
      return 'Assignment overdue';
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  },
    async fetchSubmissions() {
    const studentId = this.decodeToken();
    if (!studentId) {
      this.error = "Failed to decode token.";
      return;
    }
    
    try {
      const response = await fetch(`http://localhost/PSM_api_server/assignment/submission.php/getsubmissions/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        this.submissions = data;
      } else {
        this.error = data.message;
      }
    } catch (error) {
      this.error = "An error occurred. Please try again.";
    }
  },
    async submitAssignment(assignmentId) {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
      const studentId = payload.user_id; // Extract the user ID from the token payload

      const url = 'http://localhost/PSM_api_server/assignment/submission.php/submitassignment';

      const formData = new FormData();
      if (this.files[assignmentId]) {
        formData.append('file', this.files[assignmentId]);
        formData.append('assignment_id', assignmentId);
        formData.append('student_id', studentId); // Add student_id to FormData
      }

      if (!assignmentId || !this.files[assignmentId]) {
        this.error = "Please select a file.";
        return;
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          this.submissions.push(data);
          this.showNotification('Submit successfully.');
          this.fetchSubmissions();
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred. Please try again.";
      } 
    },
    async deleteSubmission(id) {
      try {
        const response = await fetch(`http://localhost/PSM_api_server/assignment/submission.php/deletesubmission/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          this.fetchSubmissions();
          this.showNotification('Submission deleted successfully.');
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred. Please try again.";
      }
    },
    handleFileUpload(event) {
      this.files[event.target.dataset.assignmentId] = event.target.files[0];
    },
    getSubmissions(assignmentId) {
      return this.submissions.filter(submission => submission.assignment_id === assignmentId);
    },
    async downloadFile(id) {
      const url = `http://localhost/PSM_api_server/assignment/submission.php/downloadsubmission/${id}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    showNotification(message) {
      // Implement a notification mechanism if needed
      alert(message);
    },
    showNotification(message) {
      this.notification = message;
      setTimeout(() => {
        this.notification = null;
      }, 3000); // Clear notification after 3 seconds
    }
  },
  mounted() {
    this.fetchAll();
    this.fetchSubmissions();
  }
}
</script>

<style>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.student-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px; /* Increased spacing between header and content */
}

.assignment-list {
  margin-bottom: 40px; /* Spacing between assignment list and any following content */
}

.assignment-item {
  background: #ecebeb;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px; /* Increased space between each assignment item */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for better separation */
  border: 1px solid #e0e0e0; /* Light border for clear separation */
}

.assignment-item h3 {
  margin-top: 0; /* Remove margin-top for heading to reduce extra space */
}

.assignment-form {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px; /* Space between form fields */
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.button {
  background-color: #1394bb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.button.small-button {
  background-color: #007bff;
}

.button.delete-button {
  background-color: #dc3545;
}

.button:hover {
  opacity: 0.9;
}

.submission-list {
  margin-top: 20px;
}

.submission-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px; /* Space between submission items */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for better separation */
  border: 1px solid #e0e0e0; /* Light border for clear separation */
}

.no-assignments, .no-submissions {
  text-align: center;
  font-style: italic;
  margin-top: 20px;
}

.error {
  color: red;
  text-align: center;
  margin-bottom: 20px;
}

</style>
