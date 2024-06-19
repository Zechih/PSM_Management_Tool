<template>
  <card class="card-user">
    <div slot="image">
      <img src="@/assets/img/background.jpg" alt="..." />
    </div>
    <div>
      <div class="author">
        <img
          class="avatar border-white"
          src="@/assets/img/vue-logo.png"
          alt="..."
        />
        <h4 class="title">
          {{ user.username }}
          <br />
          <a href="#">
            <small>{{ user.email }}</small>
          </a>
        </h4>
      </div>
    </div>
    <hr />
    <div class="text-center">
      <div class="row">
        <div
          v-for="(info, index) in details"
          :key="index"
          :class="getClasses(index)"
        >
          <h5>
            {{ info.title }}
            <br />
            <small>{{ info.subTitle }}</small>
          </h5>
        </div>
      </div>
    </div>

    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-3">
            <fg-input
              type="text"
              label="Username"
              placeholder="Username"
              v-model="user.username"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <fg-input
              type="text"
              label="Full Name"
              placeholder="Full Name"
              v-model="user.fullname"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input
              type="text"
              label="Address"
              placeholder="Home Address"
              v-model="user.address"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input
              type="text"
              label="City"
              placeholder="City"
              v-model="user.city"
            >
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input
              type="text"
              label="Country"
              placeholder="Country"
              v-model="user.country"
            >
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input
              type="number"
              label="Postcode"
              placeholder="Postcode"
              v-model="user.postcode"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>About Me</label>
              <textarea
                rows="5"
                class="form-control border-input"
                placeholder="Here can be your description"
                v-model="user.about_me"
              >
              </textarea>
            </div>
          </div>
        </div>
        <div class="text-center">
          <p-button type="info" round @click.native.prevent="updateProfile">
            Update Profile
          </p-button>
        </div>
        <br />
        <div class="text-center">
          <p-button type="info" round @click.native.prevent="logout">
            Logout
          </p-button>
        </div>
      </form>
    </div>
  </card>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        email: "",
        fullname: "",
        address: "",
        city: "",
        country: "",
        postcode: "",
        about_me: "",
      },
    };
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
        const userId = payload.user_id; // Extract the user ID from the token payload

        const response = await fetch(
          `http://localhost/PSM_api_server/authentication/profile.php/profile/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          this.user = data.user;
        } else {
          // Handle error
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.user_id;

        const response = await fetch(
          `http://localhost/PSM_api_server/authentication/profile.php/updateProfile/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              username: this.user.username,
              fullname: this.user.fullname,
              address: this.user.address,
              city: this.user.city,
              country: this.user.country,
              postcode: this.user.postcode,
              about_me: this.user.about_me,
            }),
          },
        );
        const data = await response.json();
        if (data.success) {
          alert("Profile updated successfully");
      
          // Fetch the updated user profile
          await this.fetchUserProfile();
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    logout() {
      // Clear the token from localStorage
      localStorage.removeItem("token");

      // Optionally, you can also reset the user object in your component
      this.user = {
        username: "",
        email: "",
        fullname: "",
        address: "",
        city: "",
        country: "",
        postcode: "",
        about_me: "",
      };

      // Then navigate to the welcome page
      this.$router.push({ name: "welcome" });
    },
    getClasses(index) {
      var remainder = index % 3;
      if (remainder === 0) {
        return "col-lg-3 offset-lg-1";
      } else if (remainder === 2) {
        return "col-lg-4";
      } else {
        return "col-lg-3";
      }
    },
  },
  mounted() {
    this.fetchUserProfile();
  },
};
</script>

<style></style>
