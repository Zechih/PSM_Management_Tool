<template>
  <div class="container">
    <h1 class="header">Meeting Management</h1>

    <div class="button-group">
      <button @click="addNewMeeting" class="button">Add New Meeting</button>
    </div>

    <form @submit.prevent="saveToMeetingList" class="form">
      <input v-model="newMeeting.Mtitle" placeholder="Title" class="input" :class="{ 'is-invalid': !validMtitle }"/><br>
      <input type="datetime-local" v-model="newMeeting.Mdate" placeholder="Date and Time" class="input" :class="{ 'is-invalid': !validMdate }"/><br>
      <input v-model="newMeeting.Mduration" placeholder="Duration" class="input" :class="{ 'is-invalid': !validMduration }"/><br>
      <input v-model="newMeeting.Mlocation" placeholder="Location" class="input" :class="{ 'is-invalid': !validMlocation }"/><br>
      <textarea v-model="newMeeting.Mdescription" placeholder="Description" class="input" :class="{ 'is-invalid': !validMdescription }"></textarea><br>
      <button type="submit" class="button" :disabled="!formIsValid">{{ editMode ? 'Update Meeting' : 'Save Meeting' }}</button>
      <button type="button" @click="cancelForm" class="button cancel-button">Cancel</button>
    </form>


    

  </div>

</template>

<script>
export default {
  data(){
    return {
      meetings: [],
      newMeeting: {
        Mtitle: '',
        Mdate: '',
        Mduration: '',
        Mlocation: '',
        Mdescription: '',
        McreatedBy: ''
      },

    };
  },
  computed: {
    validMtitle() {
      return this.newMeeting.Mtitle.trim() != '';
    },
    validMdate() {
      return this.newMeeting.Mdate !== '';
    },
    validMduration() {
      return this.newMeeting.Mduration.trim() !== '';
    },
    validMlocation() {
      return this.newMeeting.Mlocation.trim() !== '';
    },
    validMdescription() {
      return this.newMeeting.Mdescription.trim() !== '';
    },
    formIsValid() {
      return this.validMtitle && this.validMdate && this.validMduration && this.validMlocation && this.validMdescription;
    }
  },
  methods: {
    fetchAll() {
      fetch('http://localhost:3000/meetings')
        .then(response => response.json())
        .then(data => {
          this.Assignment = data;
        })
        .catch(error => {
          console.error('Error fetching meetings:', error);
        });
    },
  },
  mounted: {

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

.button:hover {
  background-color: #0056b3;
}
</style>
