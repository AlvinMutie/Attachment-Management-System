/**
 * Safe Database Restoration Utility
 * Verifies backup header integrity, takes a safety snapshot before overwriting, and restores target DB.
 */

const fs = require('fs');
const path = require('path');

const verifySqliteHeader = (filePath) => {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(16);
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);
    const headerString = buffer.toString('utf8', 0, 15);
    return headerString.startsWith('SQLite format 3');
};

const runRestore = async (backupFilePath, options = {}) => {
    const targetDbPath = options.targetDbPath || process.env.DATABASE_PATH || path.join(__dirname, '..', 'database.sqlite');
    const backupDir = path.join(__dirname, '..', 'backups');

    try {
        let sourcePath = backupFilePath;

        // If no file specified, pick the latest backup in backups/
        if (!sourcePath) {
            if (!fs.existsSync(backupDir)) {
                throw new Error('No backups directory found.');
            }
            const backups = fs.readdirSync(backupDir)
                .filter(f => f.startsWith('ams_backup_') && f.endsWith('.sqlite'))
                .map(f => ({
                    filename: f,
                    fullPath: path.join(backupDir, f),
                    ctime: fs.statSync(path.join(backupDir, f)).ctimeMs
                }))
                .sort((a, b) => b.ctime - a.ctime);

            if (backups.length === 0) {
                throw new Error('No valid backup files available to restore.');
            }
            sourcePath = backups[0].fullPath;
        }

        if (!fs.existsSync(sourcePath)) {
            throw new Error(`Backup file does not exist: ${sourcePath}`);
        }

        console.log(`🔍 Verifying SQLite backup integrity for: ${sourcePath}`);
        if (!verifySqliteHeader(sourcePath)) {
            throw new Error('Invalid SQLite backup file. Header magic signature mismatch.');
        }

        // Create pre-restore safety copy if target DB currently exists
        if (fs.existsSync(targetDbPath)) {
            const preRestoreSafetyPath = `${targetDbPath}.pre_restore_${Date.now()}`;
            fs.copyFileSync(targetDbPath, preRestoreSafetyPath);
            console.log(`🛡️  Created pre-restore safety snapshot at: ${preRestoreSafetyPath}`);
        }

        // Copy verified backup over destination
        fs.copyFileSync(sourcePath, targetDbPath);
        console.log(`✅ Database successfully restored from: ${sourcePath} -> ${targetDbPath}`);

        return {
            success: true,
            restoredFrom: sourcePath,
            targetDb: targetDbPath,
            restoredAt: new Date().toISOString()
        };
    } catch (err) {
        console.error('❌ Restore operation failed:', err.message);
        throw err;
    }
};

if (require.main === module) {
    const specifiedBackup = process.argv[2];
    runRestore(specifiedBackup)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { runRestore, verifySqliteHeader };
