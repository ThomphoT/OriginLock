require('dotenv').config();

const express = require('express');

const cors = require('cors');

const aiRoutes = require('../routes/ai.routes');

const app = express();


/**
 * ----------------------------------------
 * MIDDLEWARE
 * ----------------------------------------
 */
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/**
 * ----------------------------------------
 * ROUTES
 * ----------------------------------------
 */
app.use('/api/ai', aiRoutes);


/**
 * ----------------------------------------
 * ROOT ROUTE
 * ----------------------------------------
 */
app.get('/', (req, res) => {

    return res.json({
        success: true,
        message: 'OriginLock AI Service Running'
    });
});


/**
 * ----------------------------------------
 * 404 HANDLER
 * ----------------------------------------
 */
app.use((req, res) => {

    return res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});


/**
 * ----------------------------------------
 * GLOBAL ERROR HANDLER
 * ----------------------------------------
 */
app.use((error, req, res, next) => {

    console.error('Server Error:', error);

    return res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});


/**
 * ----------------------------------------
 * START SERVER
 * ----------------------------------------
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {

    console.log(`
========================================
OriginLock AI Service Running
========================================
PORT: ${PORT}
MODEL: ${process.env.OLLAMA_MODEL}
OLLAMA: ${process.env.OLLAMA_BASE_URL}
========================================
`);
});