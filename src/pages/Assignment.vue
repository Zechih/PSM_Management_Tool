<template>
  <div class="container">
    <h1 class="header">Assignment Management</h1>
    
    <div class="button-group">
      <button @click="startNewAssignment" class="button">Create New Assignment</button>
    </div>

    <form v-if="showForm" @submit.prevent="saveToAssignmentList" class="form">
      <input v-model="newAssignment.name" placeholder="Name" class="input" :class="{ 'is-invalid': !validName }"/><br>
      <div class="input-group">
        <input type="datetime-local" v-model="newAssignment.set_time" placeholder="Set Date" class="input" :class="{ 'is-invalid': !validSetTime }"/>
        <button type="button" @click="setCurrentTime" class="button small-button">Set Current Time</button>
      </div>
      <input type="datetime-local" v-model="newAssignment.due_date" placeholder="Due Date" class="input" :class="{ 'is-invalid': !validDueDate }"/><br>
      <input v-model="newAssignment.description" placeholder="Description" class="input" :class="{ 'is-invalid': !validDescription }"/><br>
      <div class="calculated-time">
        Remaining Time: {{ calculatedRemainingTime }}
      </div>
      <button type="submit" class="button" :disabled="!formIsValid">{{ editMode ? 'Update Assignment' : 'Save Assignment' }}</button>
      <button type="button" @click="cancelForm" class="button cancel-button">Cancel</button>
    </form>

    <div class="assignment-list">
      <div v-for="assignment in Assignment" :key="assignment.id" class="assignment-item">
        <div class="assignment-details">
          <h3>{{ assignment.name }}</h3>
          <p><strong>Set Date:</strong> {{ formatDateTime(assignment.set_time) }}</p>
          <p><strong>Due Date:</strong> {{ formatDateTime(assignment.due_date) }}</p>
          <p><strong>Description:</strong> {{ assignment.description }}</p>
          <p><strong>Remaining Time:</strong> {{ calculateRemainingTime(assignment.set_time, assignment.due_date) }}</p>
        </div>
        <div class="assignment-actions">
          <button @click="editAssignment(assignment)" class="button small-button">Edit</button>
          <button @click="deleteAssignment(assignment.id)" class="button small-button delete-button">Delete</button>
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
      newAssignment: {
        name: '',
        set_time: '',
        due_date: '',
        description: '',
        remaining_time: ''
      },
      showForm: false,
      editMode: false,
      editIndex: -1
    };
  },
  computed: {
    calculatedRemainingTime() {
    return this.calculateRemainingTime(this.newAssignment.set_time, this.newAssignment.due_date);
  },
  validName() {
    return this.newAssignment.name && this.newAssignment.name.trim() !== '';
  },
  validSetTime() {
    return this.newAssignment.set_time !== '';
  },
  validDueDate() {
    return this.newAssignment.due_date !== '';
  },
  validDescription() {
    return this.newAssignment.description && this.newAssignment.description.trim() !== '';
  },
  formIsValid() {
    return this.validName && this.validSetTime && this.validDueDate && this.validDescription;
  }
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
    startNewAssignment() {
      this.showForm = true;
      this.editMode = false;
    },
    saveToAssignmentList() {
      this.newAssignment.remaining_time = this.calculatedRemainingTime;
      
      if (this.editMode) {
        fetch('http://localhost/PSM%20Management%20Tool/index.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newAssignment)
        })
          .then(response => response.json())
          .then(data => {
            this.$set(this.Assignment, this.editIndex, data);
            this.showForm = false;
            this.newAssignment = { name: '', set_time: '', due_date: '', description: '', remaining_time: '' };
            this.editMode = false;
            this.editIndex = -1;
          })
          .catch(error => {
            console.error('Error updating assignment:', error);
          });
      } else {
        fetch('http://localhost/PSM%20Management%20Tool/index.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newAssignment)
        })
          .then(response => response.json())
          .then(data => {
            this.Assignment.push(data);
            this.showForm = false;
            this.newAssignment = { name: '', set_time: '', due_date: '', description: '', remaining_time: '' };
          })
          .catch(error => {
            console.error('Error saving assignment:', error);
          });
      }
    },
    editAssignment(assignment) {
      this.editMode = true;
      this.showForm = true;
      this.newAssignment = { ...assignment };
      this.editIndex = this.Assignment.findIndex(a => a.id === assignment.id);
    },
    deleteAssignment(id) {
      const isConfirmed = confirm('Are you sure you want to delete this assignment?');
      
      if (isConfirmed) {
        fetch(`http://localhost/PSM%20Management%20Tool/index.php?id=${id}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(() => {
            this.Assignment = this.Assignment.filter(assignment => assignment.id !== id);
          })
          .catch(error => {
            console.error('Error deleting assignment:', error);
          });
      }
    },
    cancelForm() {
      this.showForm = false;
      this.newAssignment = { name: '', set_time: '', due_date: '', description: '', remaining_time: '' };
    },
    setCurrentTime() {
      const now = new Date();
  
      // Adjust to Malaysia Time (UTC+8)
      now.setUTCHours(now.getUTCHours() + 8);
  
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  
      const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      this.newAssignment.set_time = currentDateTime;
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

.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.input[type="file"] {
  padding: 5px;
}

.button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.small-button {
  padding: 5px 10px;
  margin-left: 10px;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

.form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.input.is-invalid {
  border-color: #dc3545;
}

.input-group {
  display: flex;
  align-items: center;
}

.calculated-time {
  margin: 10px 0;
  font-weight: bold;
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