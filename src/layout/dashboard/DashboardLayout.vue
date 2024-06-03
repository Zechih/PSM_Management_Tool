<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/profile" name="User Profile" icon="ti-user" />
        <sidebar-link to="/assignment" name="Assignment" icon="ti-view-list-alt"
        />
        <sidebar-link to="/grade" name="Grade" icon="ti-text" />
        <sidebar-link to="/meeting" name="Meeting" icon="ti-pencil-alt2" />
      </template>
    </side-bar>
    <div class="main-panel">

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import DashboardContent from "./Content.vue";
export default {
  components: {
    DashboardContent,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
