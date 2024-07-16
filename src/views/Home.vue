<template>
  <div class="home">
    <h1>Bienvenue sur l'application LNURL Auth</h1>
    <div v-if="!user">
      <p>Vous n'êtes pas authentifié. Pour vous connecter, cliquez <a href="/login">ici</a>.</p>
    </div>
    <div v-else>
      <p>Vous êtes connecté en tant que {{ user.id }}.</p>
      <button @click="logout">Se déconnecter</button>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios.js';

export default {
  name: 'Home',
  mounted() {
    // Exemple de requête avec axios
    axios.get('/profile')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du profil', error);
      });
  }
};
</script>

<style scoped>
/* Votre CSS ici */
</style>