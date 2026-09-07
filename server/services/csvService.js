const csv = require('csv-parser');
const fs = require('fs');

/**
 * Parse a CSV file and return the rows as an array of objects
 * Expected headers: name, email, admissionNumber, department
 */
const parseStudentCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // Basic validation of headers
                if (results.length > 0) {
                    const requiredHeaders = ['name', 'email', 'admissionNumber', 'department'];
                    const firstRow = results[0];
                    const headersExist = requiredHeaders.every(header => Object.keys(firstRow).includes(header));

                    if (!headersExist) {
                        return reject(new Error('Invalid CSV structure. Required headers: name, email, admissionNumber, department'));
                    }
                }
                resolve(results);
            })
            .on('error', (error) => reject(error));
    });
};

/**
 * Convert structured data array into sanitized CSV text string
 * @param {Array<string>} headers - Column titles
 * @param {Array<Object>} rows - Row records
 * @param {Array<string|Function>} fieldKeys - Keys or accessor functions for each column
 * @returns {string} csvContent
 */
const formatCSV = (headers, rows, fieldKeys) => {
    const sanitizeValue = (val) => {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        // Protect against CSV formula injection
        if (/^[=+\-@]/.test(str)) {
            str = `'${str}`;
        }
        // Escape quotes
        str = str.replace(/"/g, '""');
        return `"${str}"`;
    };

    const headerLine = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
    const rowLines = rows.map(row => {
        return fieldKeys.map(key => {
            const val = typeof key === 'function' ? key(row) : row[key];
            return sanitizeValue(val);
        }).join(',');
    });

    return [headerLine, ...rowLines].join('\r\n');
};

module.exports = {
    parseStudentCSV,
    formatCSV
};
