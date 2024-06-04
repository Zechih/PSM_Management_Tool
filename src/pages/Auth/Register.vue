<!-- src/pages/RegisterPage.vue -->
<template>
  <div class="register-container">
    <div class="content">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="btn">Register</button>
      </form>
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    register() {
      this.error = null;
      // Simulate registration process
      if (this.username === "" || this.email === "" || this.password === "") {
        this.error = "All fields are required.";
        return;
      }
      // Proceed with registration (this is just a simulation, you should replace it with actual registration logic)
      alert("Registration successful!");
      // Redirect to login page after successful registration
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: flex-start; /* Position content to the right */
    align-items: center; /* Center content vertically */
    height: 100vh; /* Full height of the viewport */
    background-image: url('~@/assets/img/auth/register_background.png'); /* Correct path to your image */
    background-size: cover; /* Cover the entire container */
    background-position: center; /* Center the background image */
  }

.content {
    text-align: left;
    width: 500px;
    background-color: none; /* Light background to improve readability */
    margin-left: 200px; /* Adjust as needed */
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
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

.error {
  margin-top: 15px;
  color: #d9534f;
  text-align: center;
}
</style>
