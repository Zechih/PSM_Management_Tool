<template>
  <div class="container">
    <h1 class="header">Assignment Management</h1>

    <div class="button-group">
      <button @click="showForm = true" class="button">Add New Assignment</button>
    </div>

    <div class="overlay" v-if="showForm">
      <span class="close" @click="cancelForm">&times;</span>
      <form @submit.prevent="saveToAssignmentList" class="form" enctype="multipart/form-data">
        <input
          v-model="newAssignment.name"
          placeholder="Name"
          class="input"
          :class="{ 'is-invalid': !validName }"
        /><br />
        <input
          type="datetime-local"
          v-model="newAssignment.set_time"
          placeholder="Set Time"
          class="input"
          :class="{ 'is-invalid': !validSetTime }"
        /><br />
        <input
          type="datetime-local"
          v-model="newAssignment.due_date"
          placeholder="Due Date"
          class="input"
          :class="{ 'is-invalid': !validDueDate }"
        /><br />
        <input
          v-model="newAssignment.remaining_time"
          placeholder="Remaining Time"
          class="input"
          :class="{ 'is-invalid': !validRemainingTime }"
        /><br />
        <textarea
          v-model="newAssignment.description"
          placeholder="Description"
          class="input"
          :class="{ 'is-invalid': !validDescription }"
        ></textarea
        ><br />
        <input type="file" @change="handleFileUpload" /><br />
        <button type="submit" class="button" :disabled="!formIsValid">
          {{ editMode ? "Update Assignment" : "Save Assignment" }}
        </button>
        &nbsp;
        <button type="button" @click="cancelForm" class="button cancel-button">
          Cancel
        </button>
      </form>
    </div>

    <div class="assignment-list">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-details">
        <div class="column">
          <h3>{{ assignment.name }}</h3>
        </div>
        <div class="column">
          <div>
            <p><strong>Set Time:</strong> {{ assignment.set_time }}</p>
            <p><strong>Due Date:</strong> {{ assignment.due_date }}</p>
            <p><strong>Remaining Time:</strong> {{ assignment.remaining_time }}</p>
          </div>
          <div>
            <p><strong>Description:</strong></p>
            <p>{{ assignment.description }}</p>
          </div>
          <div v-if="assignment.file_url">
            <p><strong>File:</strong> <a :href="'/uploads/' + assignment.file_url" target="_blank">View File</a></p>
          </div>
        </div>
        <div class="column">
          <div class="assignment-actions">
            <button @click="editAssignment(assignment)" class="button small-button">Edit</button>
            <button @click="deleteAssignment(assignment.id)" class="button small-button delete-button">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false,
      editMode: false,
      assignments: [],
      newAssignment: {
        name: "",
        set_time: "",
        due_date: "",
        remaining_time: "",
        description: "",
        file: null,
      },
      editAssignmentId: null,
    };
  },
  computed: {
    validName() {
      return this.newAssignment.name.trim() !== "";
    },
    validSetTime() {
      return this.newAssignment.set_time !== "";
    },
    validDueDate() {
      return this.newAssignment.due_date !== "";
    },
    validRemainingTime() {
      return this.newAssignment.remaining_time.trim() !== "";
    },
    validDescription() {
      return this.newAssignment.description.trim() !== "";
    },
    formIsValid() {
      return (
        this.validName &&
        this.validSetTime &&
        this.validDueDate &&
        this.validRemainingTime &&
        this.validDescription
      );
    },
  },
  methods: {
    async fetchAssignments() {
      try {
        const response = await fetch("http://localhost/PSM_api_server/assignment/assignment.php/getassignmentlist");
        const data = await response.json();
        if (response.ok) {
          if (Array.isArray(data)) {
            this.assignments = data;
          } else {
            console.error("Error: Expected array but got", typeof data);
          }
        } else {
          console.error("Error fetching assignments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    },

    handleFileUpload(event) {
      this.newAssignment.file = event.target.files[0];
    },

    async saveToAssignmentList() {
      const url = this.editMode
        ? `http://localhost/PSM_api_server/assignment/assignment.php/updateassignment/${this.editAssignmentId}`
        : "http://localhost/PSM_api_server/assignment/assignment.php/createassignment";
      const method = this.editMode ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("name", this.newAssignment.name);
      formData.append("set_time", this.newAssignment.set_time);
      formData.append("due_date", this.newAssignment.due_date);
      formData.append("remaining_time", this.newAssignment.remaining_time);
      formData.append("description", this.newAssignment.description);
      if (this.newAssignment.file) {
        formData.append("file", this.newAssignment.file);
      }

      try {
        const response = await fetch(url, {
          method: method,
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          if (this.editMode) {
            const index = this.assignments.findIndex(a => a.id === this.editAssignmentId);
            if (index !== -1) {
              this.assignments[index] = data;
            }
          } else {
            this.assignments.push(data);
          }
          this.showForm = false;
          this.resetForm();
          this.fetchAssignments();
        } else {
          console.error("Error saving assignment:", data.message);
        }
      } catch (error) {
        console.error("Error saving assignment:", error);
      }
    },

    cancelForm() {
      this.showForm = false;
      this.resetForm();
    },

    resetForm() {
      this.newAssignment = {
        name: "",
        set_time: "",
        due_date: "",
        remaining_time: "",
        description: "",
        file: null,
      };
      this.editMode = false;
      this.editAssignmentId = null;
    },

    editAssignment(assignment) {
      this.showForm = true;
      this.editMode = true;
      this.editAssignmentId = assignment.id;
      this.newAssignment = { ...assignment, file: null }; // Reset file
    },

    async deleteAssignment(id) {
      if (confirm("Are you sure you want to delete this assignment?")) {
        try {
          const response = await fetch(`http://localhost/PSM_api_server/assignment/assignment.php/deleteassignment/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            this.assignments = this.assignments.filter(a => a.id !== id);
          } else {
            const data = await response.json();
            console.error("Error deleting assignment:", data.message);
          }
        } catch (error) {
          console.error("Error deleting assignment:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchAssignments();
  },
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3); /* Add shadow effect */
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.input {
  margin-bottom: 10px;
}

.form {
  max-width: 400px;
  width: 100%;
}

.meeting-list {
  list-style-type: none;
  padding: 0;
}

.meeting-details {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ced4da;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items at the top */
}

.meeting-details .column {
  flex: 1; /* Take full width of parent */
  padding: 10px; /* Add padding for spacing */
}

.meeting-details h3 {
  margin: 0 0 10px 0;
}

.meeting-details p {
  margin: 5px 0;
}

.meeting-actions {
  display: flex;
  flex-direction: column;
}

.meeting-actions .button {
  margin-top: 5px;
}

</style>
