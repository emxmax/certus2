require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Alumno = require('./models/Alumno');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

const swaggerOption = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Alumnos',
            version: '1.0.0',
            description: 'API para gestionar los alumnos'
        },
        servers: [
            {
                url: 'https://certus2-production.up.railway.app'
            },
            {
                url: 'http://localhost:4000'
            }
        ]
    },
    apis: ['./app.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOption);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(()=> {
    console.log('Se conecto exitosamente...');
}).catch((err)=>{
    console.log('Error encontrado', err);
});

/**
 * @swagger
 * /alumnos:
 *   post:
 *     summary: Crea un nuevo alumno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               edad:
 *                 type: integer
 *                 example: 20
 *               genero:
 *                 type: string
 *                 example: Masculino
 *               carrera:
 *                 type: string
 *                 example: Ing. de Sistemas
 *               comentarios:
 *                 type: string
 *                 example: Este es un comentario
 *                 description: Campo opcional para observaciones del alumno
 *             required:
 *               - nombre
 *               - apellido
 *               - edad
 *               - genero
 *               - carrera
 *     responses:
 *       201:
 *         description: Alumno registrado con éxito
 *       400:
 *         description: Error al registrar alumno
 */
app.post('/alumnos', async (req, res) => {
    try{
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        res.status(201).json({message: 'Alumno registrado correctamente'});
    }catch(err){
        res.status(400).json({message: 'Error al registrar'});
    }
});

/**
 * @swagger
 * /alumnos:
 *  get:
 *      summary: Obtiene todos los alumnos
 *      responses:
 *          200:
 *              description: Lista completa de alumnos
 *          400:
 *              description: Error al listar
 */
app.get('/alumnos', async (req, res) => {
    try{
        const listadoAlumnos = await Alumno.find();
        res.status(200).json(listadoAlumnos);
    }catch(err){
        res.status(400).json({message: 'Error al listar'});
    }
});

app.listen(4000, ()=> {
    console.log('Se esta ejecutando en el puerto 4000...')
});