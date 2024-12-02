'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class detalle_pago_ventas extends Model {
        static associate(models) {
            detalle_pago_ventas.belongsTo(models.detalle_ventas, {
                foreignKey: 'idDetalleVenta'
            });
            detalle_pago_ventas.belongsTo(models.tipo_pagos, {
                foreignKey: 'idTipoPago'
            });
        }
    }

    detalle_pago_ventas.init({
        idDetallePagoVenta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        pago: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        correlativo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        imagenTransferencia: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        idDetalleVenta: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idTipoPago: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'detalle_pago_ventas',
        tableName: 'detalle_pago_ventas',
        timestamps: true
    });

    return detalle_pago_ventas;
};