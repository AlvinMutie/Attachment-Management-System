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

module.exports = {
    parseStudentCSV
};
