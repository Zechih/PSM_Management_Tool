<template>
  <div class="container">
    <h1 class="header">Student Meeting</h1>

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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      meetings: [],
    };
  },
  created() {
    this.fetchMeetings();
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
</style>
