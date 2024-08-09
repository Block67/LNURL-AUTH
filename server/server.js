const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LnurlAuth = require('passport-lnurl-auth');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '12345678', // Changez ceci par une clé sécurisée en production
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Configuration de passport avec LNURL-auth
passport.use(new LnurlAuth.Strategy(function(linkingPublicKey, done) {
  // L'utilisateur s'est authentifié avec succès en utilisant lnurl-auth.
  // La clé publique liée est fournie ici.
  // Vous pouvez utiliser cela comme une référence unique pour l'utilisateur, similaire à un nom d'utilisateur ou une adresse e-mail.
  const user = { id: linkingPublicKey };
  done(null, user);
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, { id });
});

// Route pour authentification LNURL
app.get('/login', (req, res) => { // Modifier la route à '/login/qrcode'
  const lnurlAuthMiddleware = new LnurlAuth.Middleware({
    callbackUrl: 'http://localhost:3000/login',
    cancelUrl: '/',
    instruction: 'Scannez  pour vous connecter',
    refreshSeconds: 5,
    title: 'Se connecter avec lnurl-auth',
    uriSchemaPrefix: 'LIGHTNING:',
    store: null,
    qrcode: {
      errorCorrectionLevel: 'L',
      margin: 2,
      type: 'image/png',
    },
  });

  // Générer le QR code et l'envoyer au client
  lnurlAuthMiddleware.generate().then(({ encoded, url }) => {
    res.json({ qrCode: url });
  }).catch(error => {
    console.error('Erreur lors de la génération du QR code :', error);
    res.status(500).send('Erreur lors de la génération du QR code');
  });
});


// Route de profil
app.get('/profile', function(req, res) {
  if (!req.user) {
    return res.status(401).send('Vous n\'êtes pas authentifié.');
  }
  res.json({ user: req.user });
});

// Route de base
app.get('/', function(req, res) {
  if (!req.user) {
    return res.send('Vous n\'êtes pas authentifié. Pour vous connecter, allez <a href="/login">ici</a>.');
  }
  res.send('Connecté');
});

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur LNURL auth démarré sur le port ${port}`);
});
