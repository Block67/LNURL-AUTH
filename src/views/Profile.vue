<template>
    <div class="profile">
      <h1>Bienvenue, {{ user.id }}</h1>
    </div>
  </template>
  
  <script>
  import axios from "@/axios/axios.js";
  export default {
    data() {
      return {
        user: {}
      };
    },
    created() {
      this.getUserProfile();
    },
    methods: {
      async getUserProfile() {
        try {
          const response = await axios.get('http://localhost:3000/profile');
          this.user = response.data.user;
        } catch (error) {
          console.error('There was an error fetching the user profile!', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  