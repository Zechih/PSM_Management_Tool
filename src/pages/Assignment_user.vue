<template>
    <div class="container">
      <h1 class="header">Assignment User View </h1>
      <div class="assignment-list">
        <div v-for="assignment in Assignment" :key="assignment.id" class="assignment-item">
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
        Assignment: [],
      };
    },
    methods: {
      fetchAll() {
      fetch('http://localhost/PSM%20Management%20Tool/index.php')
          .then(response => response.json())
          .then(data => {
              console.log("Fetched data:", data);
              this.Assignment = data;
              console.log("Component data:", this.Assignment); // Log component data after assignment
          })
          .catch(error => {
              console.error('Error fetching assignments:', error);
          });
  },
      calculateRemainingTime(setTime, dueTime) {
        const setTimeDate = new Date(setTime);
        const dueTimeDate = new Date(dueTime);
        
        if (isNaN(setTimeDate.getTime()) || isNaN(dueTimeDate.getTime())) {
          return 'Invalid time';
        }
        
        const diff = dueTimeDate - setTimeDate;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        
        return `${hours} hours ${minutes} minutes`;
      },
      formatDateTime(dateTimeString) {
    if (dateTimeString) {
      return dateTimeString.replace('T', ' ');
    } else {
      return '';
    }
  }
    },
    mounted() {
      this.fetchAll();
    }
  };
  </script>
  <style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 20px;
  }

  .assignment-list {
    list-style-type: none;
    padding: 0;
  }
  
  .assignment-item {
    background-color: #ffffff;
    padding: 20px;
    border: 1px solid #ced4da;
    border-radius: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .assignment-details h3 {
    margin: 0 0 10px 0;
  }
  
  .assignment-details p {
    margin: 5px 0;
  }
  
  .assignment-actions {
    display: flex;
    flex-direction: column;
  }
  
  .assignment-actions .button {
    margin-top: 5px;
  }
  </style>