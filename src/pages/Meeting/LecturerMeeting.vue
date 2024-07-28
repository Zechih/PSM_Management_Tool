<template>
  <div class="container">
    <h1 class="header">Meeting Management</h1>

    <div class="button-group">
      <button style="background-color: #1394bb" @click="showForm = true" class="button">Add New Meeting</button>
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
        <button style="background-color: #1394bb" type="submit" class="button" :disabled="!formIsValid">
          {{ editMode ? "Update Meeting" : "Save Meeting" }}
        </button>
        &nbsp;
        <button style="background-color: red" type="button" @click="cancelForm" class="button cancel-button">
          Cancel
        </button>
      </form>
    </div>

    <div class="meeting-list">
      <div v-for="meeting in meetings" :key="meeting.id" class="meeting-details">
        <div class="column">
          <h3>{{ meeting.Mtitle }}</h3>
        </div>
        <div class="column">
          <div>
            <p><strong>Date and Time:</strong> {{ meeting.Mdate }}</p>
            <p><strong>Duration:</strong> {{ meeting.Mduration }}</p>
            <p><strong>Location:</strong> {{ meeting.Mlocation }}</p>
          </div>
          <div>
            <p><strong>Description:</strong></p>
            <p>{{ meeting.Mdescription }}</p>
          </div>
        </div>
        <div class="column">
          <div class="meeting-actions">
            <button style="background-color: #1394bb" @click="editMeeting(meeting)" class="button small-button">Edit</button>
            <button style="background-color: red"@click="deleteMeeting(meeting.id)" class="button small-button delete-button">Delete</button>
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
      meetings: [],
      newMeeting: {
        Mtitle: "",
        Mdate: "",
        Mduration: "",
        Mlocation: "",
        Mdescription: "",
      },
      editMeetingId: null,
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
    async fetchMeetings() {
      try {
        const response = await fetch("http://localhost/PSM_api_server/meeting/meeting.php/meetings");
        const data = await response.json();
        if (response.ok) {
          if (Array.isArray(data)) {
            this.meetings = data;
          } else {
            console.error("Error: Expected array but got", typeof data);
          }
        } else {
          console.error("Error fetching meetings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    },

    async saveToMeetingList() {
      const url = this.editMode
        ? `http://localhost/PSM_api_server/meeting/meeting.php/meetings/${this.editMeetingId}`
        : "http://localhost/PSM_api_server/meeting/meeting.php/meetings";
      const method = this.editMode ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newMeeting),
        });

        const data = await response.json();
        if (response.ok) {
          if (this.editMode) {
            const index = this.meetings.findIndex(m => m.id === this.editMeetingId);
            if (index !== -1) {
              this.meetings[index] = data; 
            }
          } else {
            if (Array.isArray(this.meetings)) {
              this.meetings.push(data);
            } else {
              console.error("Error: `this.meetings` is not an array");
            }
          }
          this.showForm = false;
          this.resetForm();
          this.fetchMeetings();
        } else {
          console.error("Error saving meeting:", data.message);
        }
      } catch (error) {
        console.error("Error saving meeting:", error);
      }
    },

    async deleteMeeting(id) {
      try {
        const response = await fetch(`http://localhost/PSM_api_server/meeting/meeting.php/meetings/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          this.meetings = this.meetings.filter(m => m.id !== id);
        } else {
          console.error("Error deleting meeting:", await response.json());
        }
      } catch (error) {
        console.error("Error deleting meeting:", error);
      }
    },

    editMeeting(meeting) {
      this.newMeeting = { ...meeting };
      this.editMeetingId = meeting.id;
      this.editMode = true;
      this.showForm = true;
    },

    cancelForm() {
      this.resetForm();
      this.showForm = false;
    },

    resetForm() {
      this.newMeeting = {
        Mtitle: "",
        Mdate: "",
        Mduration: "",
        Mlocation: "",
        Mdescription: "",
      };
      this.editMeetingId = null;
      this.editMode = false;
    },
  },

  created() {
    this.fetchMeetings();
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
  z-index: 1000; /* Ensure it's on top of other content */
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
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}

.form {
  background-color: #ffffff; /* Ensure the form has a solid background */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3); /* Add shadow effect */
  position: relative;
  z-index: 1001; /* Ensure it's above the overlay */
  width: 35%;
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
