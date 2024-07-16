<template>
  <div class="login">
    <h1>Connexion avec LNURL-auth</h1>
    <img :src="qrCode" alt="lnurl-auth">
    <p v-if="instruction">{{ instruction }}</p>
  </div>
</template>

<script>
import axios from '@/axios/axios.js';

export default {
  data() {
    return {
      qrCode: '',
      instruction: 'Scannez pour vous connecter'
    };
  },
  created() {
    this.getQRCode();
  },
  methods: {
    async getQRCode() {
      try {
        const response = await axios.get('/login'); 
        this.qrCode = response.data.qrCode;
      } catch (error) {
        console.error('Une erreur est survenue lors de la récupération du QR code !', error);
      }
    }
  }
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
