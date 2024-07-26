<template>
    <div class="student-container">
      <h1 class="header">Student Assignment List</h1>
  
      <div class="assignment-list">
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else-if="assignments.length === 0" class="no-assignments">No assignments available.</div>
        <div v-else v-for="assignment in assignments" :key="assignment.id" class="assignment-item">
          <div class="assignment-details">
            <h3>{{ assignment.name }}</h3>
            <p><strong>Set Date:</strong> {{ formatDateTime(assignment.set_time) }}</p>
            <p><strong>Due Date:</strong> {{ formatDateTime(assignment.due_date) }}</p>
            <p><strong>Description:</strong> {{ assignment.description }}</p>
            <p><strong>Remaining Time:</strong> {{ calculateRemainingTime(assignment.set_time, assignment.due_date) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        assignments: [],
        error: null
      };
    },
    methods: {
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
      calculateRemainingTime(setTime, dueDate) {
        const setDateTime = new Date(setTime);
        const dueDateTime = new Date(dueDate);
        const remainingTime = dueDateTime - setDateTime;
  
        if (isNaN(remainingTime)) {
          return '';
        }
  
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60)) / (1000 * 60));
  
        return `${days}d ${hours}h ${minutes}m`;
      }
    },
    mounted() {
      this.fetchAll();
    }
  };
  </script>
  
  <style>
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
    margin-bottom: 20px;
  }
  
  .assignment-list {
    margin-top: 20px;
  }
  
  .assignment-item {
    background: #f8f9fa;
    padding: 15px;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  .assignment-details h3 {
    margin: 0 0 10px;
  }
  
  .assignment-details p {
    margin: 5px 0;
  }
  
  .error {
    color: #dc3545;
    text-align: center;
  }
  
  .no-assignments {
    text-align: center;
  }
  </style>
  