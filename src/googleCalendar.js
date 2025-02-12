const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.redirect('/payment.html');
});

// Définir le chemin du fichier credentials
const credentialsPath = path.join(__dirname, 'config', 'credentials.json');

// Vérifier si le fichier credentials.json existe
if (!fs.existsSync(credentialsPath)) {
    console.error('ERREUR : Le fichier credentials.json est introuvable ! Vérifiez son emplacement.');
    process.exit(1);
}

// Charger les credentials OAuth
let credentials;
try {
    credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log("Contenu du fichier credentials.json :", JSON.stringify(credentials, null, 2));
} catch (error) {
    console.error('ERREUR : Impossible de lire le fichier credentials.json. Vérifiez son format JSON.', error);
    process.exit(1);
}

// Vérifier la structure des credentials
if (!credentials.installed && !credentials.web) {
    console.error("ERREUR : Le fichier credentials.json ne contient ni 'installed' ni 'web'. Vérifiez sa structure !");
    console.log("Contenu actuel de credentials.json :", JSON.stringify(credentials, null, 2));
    process.exit(1);
}

const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Charger le token OAuth
const tokenPath = path.join(__dirname, 'config', 'token.json');
if (fs.existsSync(tokenPath)) {
    try {
        const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        oAuth2Client.setCredentials(token);
        console.log("Token chargé avec succès.");
    } catch (error) {
        console.error('ERREUR : Impossible de lire le fichier token.json. Vérifiez son format JSON.', error);
        process.exit(1);
    }
} else {
    console.warn('Aucun token trouvé. Veuillez vous authentifier via /auth.');
}

// URL d'authentification Google OAuth
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// Gérer le callback après l'authentification
app.get('/auth/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        
        fs.writeFileSync(path.join(__dirname, 'config', 'token.json'), JSON.stringify(tokens));
        res.send('Authentification réussie ! Vous pouvez fermer cette fenêtre.');
    } catch (error) {
        console.error("Erreur lors de l'obtention du token :", error);
        res.status(500).send("Erreur lors de l'authentification.");
    }
});

// Ajouter un rendez-vous à Google Calendar
app.post('/add-event', async (req, res) => {
    const event = {
        summary: req.body.summary,
        description: req.body.description,
        start: {
            dateTime: req.body.start,
            timeZone: 'Europe/Paris',
        },
        end: {
            dateTime: req.body.end,
            timeZone: 'Europe/Paris',
        },
    };

    console.log("Event data being sent to Google Calendar:", event);

    try {
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const response = await calendar.events.insert({
            calendarId: 'primary', // Ensure this is the correct calendar ID
            resource: event,
        });

        console.log("Google Calendar API response:", response.data);

        res.json({ message: 'Rendez-vous ajouté !', event: response.data });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'événement :", error);
        res.status(500).json({ error: error.message });
    }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
