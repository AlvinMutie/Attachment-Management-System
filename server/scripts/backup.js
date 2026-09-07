/**
 * Transactional SQLite Database Backup Utility
 * Creates atomic, crash-consistent point-in-time snapshots using VACUUM INTO.
 */

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');

const runBackup = async (options = {}) => {
    const backupDir = options.backupDir || path.join(__dirname, '..', 'backups');
    const maxBackups = options.maxBackups || 7;

    try {
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `ams_backup_${timestamp}.sqlite`;
        const targetPath = path.join(backupDir, filename);

        console.log(`📦 Initiating transactional backup to: ${targetPath}`);

        // SQLite VACUUM INTO creates a clean, atomic snapshot without locking writes
        await sequelize.query(`VACUUM INTO '${targetPath}';`);

        const stats = fs.statSync(targetPath);
        console.log(`✅ Backup successfully created! Size: ${(stats.size / 1024).toFixed(2)} KB`);

        // Retention policy: Keep the newest `maxBackups` snapshots
        const existingBackups = fs.readdirSync(backupDir)
            .filter(f => f.startsWith('ams_backup_') && f.endsWith('.sqlite'))
            .map(f => ({
                filename: f,
                fullPath: path.join(backupDir, f),
                ctime: fs.statSync(path.join(backupDir, f)).ctimeMs
            }))
            .sort((a, b) => b.ctime - a.ctime);

        if (existingBackups.length > maxBackups) {
            const stale = existingBackups.slice(maxBackups);
            for (const file of stale) {
                fs.unlinkSync(file.fullPath);
                console.log(`🧹 Cleaned up stale backup: ${file.filename}`);
            }
        }

        return {
            success: true,
            filename,
            targetPath,
            sizeBytes: stats.size,
            timestamp: new Date().toISOString()
        };
    } catch (err) {
        console.error('❌ Backup generation failed:', err);
        throw err;
    }
};

if (require.main === module) {
    runBackup()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { runBackup };
