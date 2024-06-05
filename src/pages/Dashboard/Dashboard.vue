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
          <h3>{{ assignment.title }}</h3>
          <p>{{ assignment.dueDate }}</p>
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
      selectedMonth: "January",
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
      assignments: [
        { id: 1, title: "Assignment 1", dueDate: "2023-01-15" },
        { id: 2, title: "Assignment 2", dueDate: "2023-02-20" },
        // Add more assignments here
      ],
    };
  },
  computed: {
    filteredAssignments() {
      return this.assignments.filter((assignment) => {
        const assignmentMonth = new Date(assignment.dueDate).toLocaleString(
          "default",
          { month: "long" },
        );
        return assignmentMonth === this.selectedMonth;
      });
    },
  },
  methods: {
    filterTimeline() {
      // This method will be called whenever the selected month changes
    },
  },
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