const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
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

app.get('/api/cursogis', async (req, res) =>{
    try{
        const result = await pool.query('SELECT * FROM seguimientos');
        res.json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

app.get('/api/dimensiones', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ST_Xmin(bb) as xmin, 
                ST_ymax(bb) * -1 as ymax, 
                ST_Xmax(bb) - ST_Xmin(bb) as ancho,
                ST_Ymax(bb) - ST_ymin(bb) as alto
            FROM 
                (SELECT ST_Extent(geom) bb FROM proyecto.parcelas) AS extent
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/objetos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, area, st_assvg(geom, 1, 4) as svg FROM proyecto.parcelas
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});