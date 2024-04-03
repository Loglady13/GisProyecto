const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const svg = require('svg.js');
//const moment = require('moment');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'usr_GIS',
    host: 'leoviquez.com',
    database: 'cursoGIS',
    password: 'usr_GIS',
    port: 15432
});

app.get('/', (req, res) => {
    res.send('API Proyecto GIS');
});



app.get('/api/objetos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, st_assvg(geom, 1, 4) as svg FROM proyecto.parcelas
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/geom', async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT id, geom FROM proyecto.parcelas
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
})

app.post('/api/crearform', async (req, res) =>{
    try {
        const { cultivo, area, num_subdivisiones } = req.body;
        console.log({ cultivo, area, num_subdivisiones });

        const query = `
            INSERT INTO proyecto.form_skr 
            ("cultivo", "area", "num_subdivisiones") 
            VALUES ($1, $2, $3) 
            RETURNING *`;

        const values = [cultivo, area, num_subdivisiones];

        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting formulario:', error);
        res.status(500).json({ error: error.message });
    }


});

app.post('/api/cortes_verticales', async (req, res) => {
    try {
        const { geometria, cortes } = req.body;
        console.log({ geometria, cortes });

        const query = `
        SELECT ST_AsSVG(recortes) AS svg, recortes AS geom 
        FROM (
            SELECT unnest(cortes_verticales($1::geometry, $2::int[])) AS recortes
        ) AS resultado
        `;

        const values = [geometria, cortes];

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en cortes verticales:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cortes_horizontales', async (req, res) => {
    try {
        const { geometria, cortes } = req.body;
        console.log({ geometria, cortes });

        const query = `
        SELECT ST_AsSVG(recortes) AS svg, recortes AS geom 
        FROM (
            SELECT unnest(cortes_horizontales_g1($1::geometry, $2::int[])) AS recortes
        ) AS resultado
        `;

        const values = [geometria, cortes];

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en cortes horizontales:', error);
        res.status(500).json({ error: error.message });
    }
});



app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});