// Immutable trail of privileged actions taken in the admin portal.
//
// Every approval, rejection, correction request, payment confirmation and
// permanent deletion writes one row here. The table is append-only from the
// application's point of view: nothing updates or deletes an audit row, so the
// record of "who did what, to whom, and when" survives even if the underlying
// application row is later removed.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    actor: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    action: { type: DataTypes.STRING, allowNull: false },
    entityType: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.STRING, allowNull: true },
    entityName: { type: DataTypes.STRING, allowNull: true },
    summary: { type: DataTypes.TEXT, allowNull: true },
    detail: { type: DataTypes.JSONB, allowNull: true },
    ip: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'AuditLogs', timestamps: true, updatedAt: false });

module.exports = AuditLog;
