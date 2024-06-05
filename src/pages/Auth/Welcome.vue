<template>
    <div class="welcome-container">
      <div class="content">
        <h1>Welcome To The PSM Management Tool</h1>
        <h5>"No matter how hard your past, you can always begin again."</h5>
        <br>
        <button @click="goToLogin" class="btn">Login</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "WelcomePage",
    methods: {
      goToLogin() {
        this.$router.push({ name: "login" });
      },
    },
  };
  </script>
  
  <style scoped>
  .welcome-container {
    display: flex;
    justify-content: flex-end; /* Position content to the right */
    align-items: center; /* Center content vertically */
    height: 100vh; /* Full height of the viewport */
    background-image: url('~@/assets/img/auth/welcome_background.png'); /* Correct path to your image */
    background-size: cover; /* Cover the entire container */
    background-position: center; /* Center the background image */
  }
  
  .content {
    text-align: right;
    width: 600px;
    margin-right: 60px; /* Adjust as needed */
    background-color: none; /* Light background to improve readability */
    padding: 20px; /* Add some padding */
    border-radius: 8px; /* Slightly round the corners */
  }
  
  h1 {
    color: #000000; /* Ensure text is readable against the background */
    font-size: 55px;
    font-weight: 900; /* Make the text bold */
  }

  h5 {
    color: #585858; /* Ensure text is readable against the background */
    font-weight: lighter; 
  }
  
  .btn {
    padding: 10px 20px;
    font-size: large;
    background-color: #1394bb;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px; /* Add some space between the text and the button */
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  </style>