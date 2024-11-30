'use strict';
const { v4: uuidv4 } = require('uuid'); // Importar para generar identificadores únicos
const db = require("../models");
const voluntarios = require("../models/voluntarios");
const VOLUNTARIOS = db.voluntarios;

// Método para generar un código QR numérico
function generateQRCode() {
    // Generar un número único de 9 dígitos
    return Math.floor(100000000 + Math.random() * 900000000).toString();
}

// Métodos CRUD
module.exports = {
    // Método para obtener todos los voluntarios
    async find(req, res) {
        try {
            const voluntarios = await VOLUNTARIOS.findAll({
                where: {
                    estado: 1
                }
            });
            
            return res.status(200).json(voluntarios);
        } catch (error) {
            console.error('Error al recuperar los voluntarios:', error);
            return res.status(500).json({
                message: 'Ocurrió un error al recuperar los datos.'
            });
        }
    },
    
    async findActivateVol(req, res) {
        return VOLUNTARIOS.findAll({
            where: {
                estado: 1 
            }
        })
        .then((voluntarios) => {
            res.status(200).send(voluntarios);
        })
        .catch((error) => {
            res.status(500).send({
                message: error.message || 'Error al listar los voluntarios.'
            });
        });
    },

    async findaInactivateVol(req, res) {
        return VOLUNTARIOS.findAll({
            where: {
                estado: 0 
            }
        })
        .then((voluntarios) => {
            res.status(200).send(voluntarios);
        })
        .catch((error) => {
            res.status(500).send({
                message: error.message || 'Error al listar los voluntarios.'
            });
        });
    },

    createVol(req, res) {
        const datos = req.body;

        // Validación de campos requeridos
        if (!datos.fechaRegistro || !datos.fechaSalida || !datos.idPersona) {
            return res.status(400).json({ message: 'Faltan campos requeridos.' });
        }

        const datos_ingreso = {
            codigoQR: generateQRCode(), // Generar el código QR
            fechaRegistro: datos.fechaRegistro,
            fechaSalida: datos.fechaSalida,
            estado: datos.estado !== undefined ? datos.estado : 1,
            idPersona: datos.idPersona,
        };

        return VOLUNTARIOS.create(datos_ingreso)
            .then((voluntario) => {
                return res.status(201).json(voluntario);
            })
            .catch((error) => {
            console.error('Error al insertar el voluntario:', error);
            return res.status(500).json({ error: 'Error al insertar el voluntario.' });
        });
    },
    
    updateVol(req, res) {
        const datos = req.body; 
        const id = req.params.id; 
    
        if (!id) {
            return res.status(400).json({ message: 'ID de voluntario no proporcionado.' });
        }
    
        const camposActualizados = {};
        
        if(datos.codigoQR !== undefined) {
            camposActualizados.codigoQR = datos.codigoQR;
        }
        if (datos.fechaRegistro !== undefined) {
            camposActualizados.fechaRegistro = datos.fechaRegistro;
        }
        if (datos.fechaSalida !== undefined) {
            camposActualizados.fechaSalida = datos.fechaSalida;
        }
        if (datos.estado !== undefined) {
            camposActualizados.estado = datos.estado;
        }
        if (datos.idPersona !== undefined) {
            camposActualizados.idPersona = datos.idPersona;
        }

        if (Object.keys(camposActualizados).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
        }
    
        return VOLUNTARIOS.update(camposActualizados, {
            where: { idVoluntario: id } 
        })
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) {
                return res.status(404).json({ message: 'Voluntario no encontrado.' });
            }
            return res.status(200).json({ message: 'El voluntario ha sido actualizado.' });
        })
        .catch(error => {
            console.error(`Error al actualizar el voluntario con ID ${id}:`, error);
            return res.status(500).json({ error: 'Error al actualizar voluntario.' });
        });
    },

    async deleteVol(req, res) {
        const id = req.params.id; 
    
        try {
            const voluntarios = await VOLUNTARIOS.findByPk(id);
    
            if (!voluntarios) {
                return res.status(404).json({ error: 'Voluntario no encontrado' });
            }
    
            await voluntarios.destroy();
            return res.status(200).json({ message: 'Voluntario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar voluntario:', error);
            return res.status(500).json({ error: 'Error al eliminar voluntario' });
        }
    }
};