<template>
  <div class="dashboard-container">
    <!-- Timeline Container -->
    <div class="timeline-container">
      <div class="timeline-header">
        <h2>Timeline</h2>
        <select v-model="selectedMonth" @change="filterTimeline">
          <option v-for="month in months" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </div>
      <div class="timeline-content">
        <div
          v-for="assignment in filteredAssignments"
          :key="assignment.id"
          class="timeline-item"
        >
          <div class="assignment-details">
            <h3>{{ assignment.name }}</h3>
            <p><strong>Set Date:</strong> {{ formatDateTime(assignment.set_time) }}</p>
            <p><strong>Due Date:</strong> {{ formatDateTime(assignment.due_date) }}</p>
            <p><strong>Remaining Time:</strong> {{ calculateRemainingTime(assignment.set_time, assignment.due_date) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Container -->
    <div class="calendar-container">
      <dashboard-calendar />
    </div>
  </div>
</template>

<script>
import DashboardCalendar from "@/pages/Dashboard/DashboardCalendar.vue"; // Ensure the correct path

export default {
  components: {
    DashboardCalendar,
  },
  data() {
    return {
      selectedMonth: "",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      assignments: [],
      filteredAssignments: [], // Initialize filteredAssignments
      error: "",
    };
  },
  methods: {
    filterTimeline() {
      const month = this.selectedMonth;
      this.filteredAssignments = this.assignments.filter(assignment => {
        const dueDate = new Date(assignment.due_date);
        const assignmentMonth = dueDate.toLocaleString("default", { month: "long" });
        return assignmentMonth === month;
      });
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
          this.filterTimeline(); // Ensure filtered assignments are updated after fetching
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
    setDefaultMonth() {
      const currentMonth = new Date().toLocaleString("default", { month: "long" });
      this.selectedMonth = currentMonth;
    },
  },
  mounted() {
    this.setDefaultMonth(); // Set the default month when the component mounts
    this.fetchAll();
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.timeline-container {
  margin-bottom: 20px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-content {
  max-height: 300px;
  overflow-y: auto;
}

.timeline-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.calendar-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
