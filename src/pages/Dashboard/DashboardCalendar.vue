<template>
  <div class="calendar">
    <h2>Calendar</h2>
    <div class="calendar-nav">
      <button @click="prevMonth">Previous</button>
      <span>{{ months[currentMonth] }} {{ currentYear }}</span>
      <button @click="nextMonth">Next</button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in daysInMonth" :key="day" :class="{ 'calendar-day': true, 'current-day': day === currentDate }">
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      currentDate: new Date().getDate(),
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
    };
  },
  computed: {
    daysInMonth() {
      const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      return Array.from({ length: days }, (_, i) => i + 1);
    }
  },
  methods: {
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    }
  }
};
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.calendar-day {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 100px;
  background-color: #e9ecef;
  border-radius: 4px;
}

.current-day {
  background-color: #1394bb;
  color: #fff;
}
</style>