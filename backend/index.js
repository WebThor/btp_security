// index.js

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const passport = require('passport');
const xsenv = require('@sap/xsenv');
const { JWTStrategy } = require('@sap/xssec');

const bodyParser = require('body-parser');
const path = require('path');

const {
    getProducts,
    getProductsByName,
    addProduct,
    updateProduct,
    deleteProduct
} = require('./lib/repository');

// === Challenge-Variablen ===
const SECRET_NUMBER = Math.floor(Math.random() * 1e12).toString();
const FLAG = process.env.SECRET_FLAG || "FLAG{you_bypassed_rate_limit}";
const rateLimits = {};

// === Middleware ===
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files before authentication middleware
app.use(express.static(path.join(__dirname, 'static')));
// Serve images from the resources directory
app.use('/resources/images', express.static(path.join(__dirname, 'resources/images')));

// === Auth-Setup ===
const services = xsenv.getServices({ uaa: { tag: 'xsuaa' } });
passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());

// Protect API routes
app.use('/products', passport.authenticate('JWT', { session: false }));

// === Produkt-Endpunkte (nur als Beispiel, wie gehabt) ===
app.get('/products', checkScope('force_read'), getProducts);
app.get('/products/:name', checkScope('force_read'), getProductsByName);
app.post('/products', checkScope('force_edit'), addProduct);
app.put('/products/:name', checkScope('force_edit'), updateProduct);
app.delete('/products/:name', checkScope('force_admin'), deleteProduct);

// JWT-Endpoint (optional)
app.get('/jwt', 
    passport.authenticate('JWT', { session: false }), 
    checkScope('force_admin'), // Restrict access to 'force_admin' scope
    (req, res) => {
        try {
            const authorizationHeader = req.headers['authorization'];
            if (!authorizationHeader) {
                return res.status(401).send({ error: 'Authorization header not found.' });
            }
            const jwt = authorizationHeader.split(' ')[1]; // Extract the token
            res.status(200).send({ jwt });
        } catch (error) {
            console.error('Error retrieving JWT:', error);
            res.status(500).send({ error: 'Internal Server Error while retrieving JWT.' });
        }
    }
);

// =================== Challenge-Endpoints ===================

// Rate-limitiertes Zahlenraten
app.post("/guess", (req, res) => {
    const ip = req.ip;
    const now = Date.now();

    if (!rateLimits[ip]) {
        rateLimits[ip] = { tries: 0, lockUntil: null };
    }
    const entry = rateLimits[ip];

    if (entry.lockUntil && now < entry.lockUntil) {
        const seconds = Math.ceil((entry.lockUntil - now) / 1000);
        return res.status(429).send(`⏳ Zu viele Versuche. Bitte warte ${seconds} Sekunden.`);
    }

    if (entry.tries >= 10) {
        entry.lockUntil = now + 20000; // 20 Sekunden Sperre
        entry.tries = 0;
        return res.status(429).send("🚫 Zu viele Versuche. Bitte warte 20 Sekunden.");
    }

    entry.tries++;

    const guess = req.body.number?.toString();
    if (guess === SECRET_NUMBER) {
        return res.send(`🎉 Glückwunsch! ${FLAG}`);
    } else {
        return res.send("❌ Falsch. Versuch es nochmal.");
    }
});

// Versteckter Secret-Endpunkt
app.get("/internal/secret", (req, res) => {
    if (req.headers["x-internal-access"] === "letmein") {
        return res.send({ secret: SECRET_NUMBER });
    }
    return res.status(403).send("Forbidden");
});

// === Scope-Check Middleware ===
function checkScope(requiredScope) {
    return (req, res, next) => {
        try {
            if (req.authInfo && req.authInfo.checkLocalScope(requiredScope)) {
                console.log(`Scope "${requiredScope}" validated.`);
                next();
            } else {
                console.error(`Missing required scope: ${requiredScope}`);
                res.status(403).send(`Forbidden: Missing Scope (${requiredScope})`);
            }
        } catch (error) {
            console.error("Error in checkScope middleware:", error);
            res.status(500).send("Internal Server Error in middleware.");
        }
    };
}

// === Server Start ===
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
