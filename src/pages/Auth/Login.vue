<!-- src/pages/LoginPage.vue -->
<template>
  <div class="login-container">
    <div class="content">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <button @click="goToRegister" class="btn secondary">Register</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
        const response = await fetch("http://localhost/PSM_api_server/authentication/login.php/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Store the token in local storage
          localStorage.setItem("token", data.token);

          // Decode the token to get user role
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          const role = payload.role;

          // Redirect based on user role
          if (role === "lecturer") {
            this.$router.push({ name: "dashboard" });
          } else {
            this.$router.push({ name: "dashboard" });
          }
        } else if (response.status === 404) {
          this.error = "Username not found. Please try again.";
        } else {
          this.error = data.error || "Invalid username or password.";
        }
      } catch (error) {
        console.error(error);
        this.error = "An error occurred. Please try again.";
      }
    },
    goToRegister() {
      this.$router.push({ name: "register" });
    },
  },
};
</script>


<style scoped>
  .login-container {
    display: flex;
    justify-content: flex-end; /* Position content to the right */
    align-items: center; /* Center content vertically */
    height: 100vh; /* Full height of the viewport */
    background-image: url('~@/assets/img/auth/login_background.png'); /* Correct path to your image */
    background-size: cover; /* Cover the entire container */
    background-position: center; /* Center the background image */
  }

.content {
    text-align: left;
    width: 500px;
    background-color: none; /* Light background to improve readability */
    margin-right: 200px; /* Adjust as needed */
    padding: 20px; /* Add some padding */
    border-radius: 8px; /* Slightly round the corners */
  }

h1 {
    color: #000000; /* Ensure text is readable against the background */
    text-align: center;
    font-size: 55px;
    font-weight: 900; /* Make the text bold */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: black;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #1394bb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.btn:hover {
  background-color: #0056b3;
}

.btn.secondary {
  background-color: #6c757d;
}

.btn.secondary:hover {
  background-color: #5a6268;
}

.error {
  margin-top: 15px;
  color: #d9534f;
  text-align: center;
}
</style>
