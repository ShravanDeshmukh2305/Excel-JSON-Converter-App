const ExcelJS = require('exceljs');
const fs = require('fs');

exports.convertExcelToJson = async (filePath) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    let result = {};

    workbook.eachSheet((sheet) => {
        let sheetData = [];
        let headers = [];

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                headers = row.values.slice(1);
            } else {
                let rowData = {};
                row.values.slice(1).forEach((val, index) => {
                    rowData[headers[index]] = val;
                });
                sheetData.push(rowData);
            }
        });
        result[sheet.name] = sheetData;
    });

    fs.unlinkSync(filePath);
    return result;
};

exports.convertJsonToExcel = async (jsonData) => {
    const workbook = new ExcelJS.Workbook();
    for (let sheetName in jsonData) {
        const worksheet = workbook.addWorksheet(sheetName);
        const data = jsonData[sheetName];

        if (data.length > 0) {
            worksheet.addRow(Object.keys(data[0]));
            data.forEach(row => worksheet.addRow(Object.values(row)));
        }
    }

    const filePath = `./output-${Date.now()}.xlsx`;
    await workbook.xlsx.writeFile(filePath);
    return filePath;
};