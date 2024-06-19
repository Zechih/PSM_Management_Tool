<template>
  <div class="container">
    <h1 class="header">Meeting Management</h1>

    <div class="button-group">
      <button @click="showForm = true" class="button">Add New Meeting</button>
    </div>

    <div class="overlay" v-if="showForm">
      <span class="close" @click="cancelForm">&times;</span>
      <form @submit.prevent="saveToMeetingList" class="form">
        <input
          v-model="newMeeting.Mtitle"
          placeholder="Title"
          class="input"
          :class="{ 'is-invalid': !validMtitle }"
        /><br />
        <input
          type="datetime-local"
          v-model="newMeeting.Mdate"
          placeholder="Date and Time"
          class="input"
          :class="{ 'is-invalid': !validMdate }"
        /><br />
        <input
          v-model="newMeeting.Mduration"
          placeholder="Duration"
          class="input"
          :class="{ 'is-invalid': !validMduration }"
        /><br />
        <input
          v-model="newMeeting.Mlocation"
          placeholder="Location"
          class="input"
          :class="{ 'is-invalid': !validMlocation }"
        /><br />
        <textarea
          v-model="newMeeting.Mdescription"
          placeholder="Description"
          class="input"
          :class="{ 'is-invalid': !validMdescription }"
        ></textarea
        ><br />
        <button type="submit" class="button" :disabled="!formIsValid">
          {{ editMode ? "Update Meeting" : "Save Meeting" }}
        </button>
        <button type="button" @click="cancelForm" class="button cancel-button">
          Cancel
        </button>
      </form>
    </div>

    <div class="meeting-list">
      <div class="meeting-details">
        <h3>Proposal Discussion</h3>
        <p><strong>Date and Time:</strong> 5/6/2024 11.00am</p>
        <p><strong>Duration:</strong> 1 hour</p>
        <p><strong>Location:</strong> Webex</p>
        <p><strong>Description:</strong> Please prepare your proposal title</p>
        <div class="meeting-actions">
          <button @click="" class="button small-button">Edit</button>
          <button @click="" class="button small-button delete-button">
            Delete
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
      showForm: false,
      editMode: false,
      meetings: [],
      newMeeting: {
        Mtitle: "",
        Mdate: "",
        Mduration: "",
        Mlocation: "",
        Mdescription: "",
        McreatedBy: "",
      },
    };
  },
  computed: {
    validMtitle() {
      return this.newMeeting.Mtitle.trim() !== "";
    },
    validMdate() {
      return this.newMeeting.Mdate !== "";
    },
    validMduration() {
      return this.newMeeting.Mduration.trim() !== "";
    },
    validMlocation() {
      return this.newMeeting.Mlocation.trim() !== "";
    },
    validMdescription() {
      return this.newMeeting.Mdescription.trim() !== "";
    },
    formIsValid() {
      return (
        this.validMtitle &&
        this.validMdate &&
        this.validMduration &&
        this.validMlocation &&
        this.validMdescription
      );
    },
  },
  methods: {
    saveToMeetingList() {
      this.showForm = false;
    },
    cancelForm() {
      this.showForm = false;
    },
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
  align-items: center;
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
