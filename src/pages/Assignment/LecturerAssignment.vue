<template>
  <div class="container">
    <h1 class="header">Assignment Management</h1>

    <div class="button-group">
      <button @click="startNewAssignment" style="background-color: #1394bb" class="button">Create New Assignment</button>
    </div>

    <form v-if="showForm" @submit.prevent="editMode ? updateAssignment() : createAssignment()" class="form">
      <input v-model="newAssignment.name" placeholder="Name" class="input" :class="{ 'is-invalid': !validName }"/><br>
      <div class="input-group">
        <input type="datetime-local" v-model="newAssignment.set_time" placeholder="Set Date" class="input" :class="{ 'is-invalid': !validSetTime }"/>
        <button type="button" style="background-color: #1394bb" @click="setCurrentTime" class="button small-button">Set Current Time</button>
      </div>
      <input type="datetime-local" v-model="newAssignment.due_date" placeholder="Due Date" class="input" :class="{ 'is-invalid': !validDueDate }"/><br>
      <input v-model="newAssignment.description" placeholder="Description" class="input" :class="{ 'is-invalid': !validDescription }"/><br>
      <div class="calculated-time">
        Remaining Time: {{ calculatedRemainingTime }}
      </div>
      <input type="file" @change="handleFileUpload" class="input"/><br>
      <button type="submit" style="background-color: #1394bb" class="button" :disabled="!formIsValid">{{ editMode ? 'Update Assignment' : 'Save Assignment' }}</button>
      <button type="button" @click="cancelForm" class="button cancel-button">Cancel</button>
    </form>

    <div class="assignment-list">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-item">
        <div class="assignment-details">
          <h3>{{ assignment.name }}</h3>
          <p><strong>Set Date:</strong> {{ formatDateTime(assignment.set_time) }}</p>
          <p><strong>Due Date:</strong> {{ formatDateTime(assignment.due_date) }}</p>
          <p><strong>Description:</strong> {{ assignment.description }}</p>
          <p><strong>Remaining Time:</strong> {{ calculateRemainingTime(assignment.set_time, assignment.due_date) }}</p>
          <p v-if="assignment.file_name"><strong>File: </strong> {{ assignment.file_name }} <button style="background-color: #1394bb" @click="downloadFile(assignment.id)" class="button small-button">Download</button></p>
        </div>
        <div class="assignment-actions">
          <button style="background-color: #1394bb" @click="editAssignment(assignment)" class="button small-button">Edit</button>
          <button @click="deleteAssignment(assignment.id)" class="button small-button delete-button">Delete</button>
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
      newAssignment: {
        id: null,
        name: '',
        set_time: '',
        due_date: '',
        description: '',
        remaining_time: '',
        file_name: '',
        file: null // Add file attribute
      },
      showForm: false,
      editMode: false,
      editIndex: -1,
      error: null,
      notification: null // Add notification state
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
          console.log("Assignments fetched:", this.assignments); // Debugging: Check the fetched data
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred. Please try again.";
      }
    },
    startNewAssignment() {
      this.showForm = true;
      this.editMode = false;
      this.newAssignment = { // Reset newAssignment for creating a new assignment
        id: null,
        name: '',
        set_time: '',
        due_date: '',
        description: '',
        remaining_time: '',
        file_name: '',
        file: null
      };
    },
    handleFileUpload(event) {
      this.newAssignment.file = event.target.files[0];
    },
    async createAssignment() {
      this.newAssignment.remaining_time = this.calculatedRemainingTime;

      const token = localStorage.getItem('token');
      const url = 'http://localhost/PSM_api_server/assignment/assignment.php/createassignment';

      const formData = new FormData();
      formData.append('name', this.newAssignment.name);
      formData.append('set_time', this.newAssignment.set_time);
      formData.append('due_date', this.newAssignment.due_date);
      formData.append('description', this.newAssignment.description);
      formData.append('remaining_time', this.newAssignment.remaining_time);
      if (this.newAssignment.file) {
        formData.append('file', this.newAssignment.file);
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
          this.assignments.push(data);
          this.showNotification('Assignment created successfully.');
          this.cancelForm();
          this.fetchAll(); // Fetch updated list
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred. Please try again.";
      }
    },
    async updateAssignment() {
  this.newAssignment.remaining_time = this.calculatedRemainingTime;

  const token = localStorage.getItem('token');
  const url = `http://localhost/PSM_api_server/assignment/assignment.php/updateassignment/${this.newAssignment.id}`;

  const formData = new FormData();
  formData.append('name', this.newAssignment.name);
  formData.append('set_time', this.newAssignment.set_time);
  formData.append('due_date', this.newAssignment.due_date);
  formData.append('description', this.newAssignment.description);
  formData.append('remaining_time', this.newAssignment.remaining_time);
  if (this.newAssignment.file) {
    formData.append('file', this.newAssignment.file);
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
    console.log('Response:', response); // Debugging
    console.log('Data:', data); // Debugging
    if (response.ok) {
      this.assignments.splice(this.editIndex, 1, data);
      this.showNotification('Assignment updated successfully.');
      this.cancelForm();
      this.fetchAll(); // Fetch updated list
    } else {
      this.error = data.message || 'Update failed. Please check your input.';
    }
  } catch (error) {
    console.error('Error:', error); // Debugging
    this.error = "An error occurred. Please try again.";
  }
},
    editAssignment(assignment) {
      this.newAssignment = { ...assignment };
      this.showForm = true;
      this.editMode = true;
      this.editIndex = this.assignments.indexOf(assignment);
    },
    async deleteAssignment(id) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost/PSM_api_server/assignment/assignment.php/deleteassignment/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          this.assignments = this.assignments.filter(assignment => assignment.id !== id);
          this.showNotification('Assignment deleted successfully.');
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred. Please try again.";
      }
    },
    //download file
    async downloadFile(id) {
      // Create a hidden iframe to handle the download
      const url = `http://localhost/PSM_api_server/assignment/assignment.php/downloadfile/${id}`;
      
      // Create an anchor element and set its href to the download URL
      const a = document.createElement('a');
      a.href = url;
      a.download = ''; // The browser will use the filename from the Content-Disposition header

      // Append the anchor to the body and trigger a click
      document.body.appendChild(a);
      a.click();

      // Remove the anchor from the DOM
      document.body.removeChild(a);
    },

    cancelForm() {
      this.newAssignment = {
        name: '',
        set_time: '',
        due_date: '',
        description: '',
        remaining_time: '',
        file: null // Reset file attribute
      };
      this.showForm = false;
      this.editMode = false;
    },
    setCurrentTime() {
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
      this.newAssignment.set_time = localISOTime;
    },
    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleDateString('en-GB', options);
    },
    calculateRemainingTime(setTime, dueDate) {
      const setDateTime = new Date(setTime);
      const dueDateTime = new Date(dueDate);
      const remainingTime = dueDateTime - setDateTime;

      if (isNaN(remainingTime) || remainingTime < 0) {
        return 'Invalid due date';
      }

      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

      return `${days}d ${hours}h ${minutes}m`;
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
  }
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  z-index: 1000;
}
    body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
  }
  
  .container {
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
  
  .button-group {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .button:hover {
    background-color: #0056b3;
  }
  
  .form {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .input {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .input-group {
    display: flex;
    align-items: center;
  }
  
  .input-group .input {
    flex: 1;
    margin-right: 10px;
  }
  
  .small-button {
    padding: 5px 10px;
  }
  
  .is-invalid {
    border-color: #dc3545;
  }
  
  .calculated-time {
    margin: 15px 0;
    font-weight: bold;
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
  
  .assignment-actions {
    text-align: right;
  }
  
  .delete-button {
    background-color: #dc3545;
    color: white;
  }
  
  .cancel-button {
    background-color: #6c757d;
    color: white;
  }
  
  .delete-button:hover, .cancel-button:hover {
    background-color: #c82333;
  }
  
  .button-group, .assignment-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  @media (max-width: 600px) {
    .container {
      margin: 20px;
      padding: 15px;
    }
  
    .button, .small-button {
      width: 100%;
      margin: 5px 0;
    }
  
    .input {
      width: 100%;
    }
  
    .input-group {
      flex-direction: column;
      align-items: stretch;
    }
  
    .input-group .input {
      margin-right: 0;
      margin-bottom: 10px;
    }
  
    .assignment-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
    </style>