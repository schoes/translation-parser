const xlsx = require('node-xlsx');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');


const colors = require('colors');
const translationsPath = './src/assets/translations/';
const translationTabPath = translationsPath + 'tabs/';
const translationExcel = translationsPath + 'b2c_nautilus.translations.output.' + moment().format('YYYY.MM.DD') + '.xlsx';
const firstRow = ['key', 'de', 'fr', 'it'];
let createExcelTab = (sheetName, jsonData) => {
    let excelTab = {name: sheetName};
    let data = [];
    data.push(firstRow);

    excelTab.data = data;
    return excelTab;
};

createExcelRow = (translation, excelData) => {
    let allKeys = _.keys(translation.de);
    _.forEach(allKeys, (key) => {

        let row = [key];
        row.push(translation.de[key]);
        row.push(translation.fr[key]);
        row.push(translation.it[key]);

        excelData.push(row);
    });
};


fs.access(translationTabPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
        console.error('no access to ', translationTabPath);
    }
    else {
        fs.readdir(translationTabPath, (err, files) => {
            let buffer, sheets = [];
            files.forEach(file => {
                let translationData = fs.readFileSync(translationTabPath + file)
                let translation = JSON.parse(translationData);
                let data4Excel = [firstRow];
                createExcelRow(translation, data4Excel);
                let sheetName = file.split('.')[0];
                sheets.push({name: sheetName, data: data4Excel});
            });
            buffer = xlsx.build(sheets);
            fs.writeFileSync(translationExcel, buffer);
        });

    }
});

