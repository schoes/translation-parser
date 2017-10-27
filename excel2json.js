const _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    xlsx = require('node-xlsx'),
    colors = require('colors');

// let translationsFile = './src/assets/translations/nautilus.translations.input.xlsx';yarn add


const parse = (excelFile, options) => {

    if (_.isNil(excelFile)) {
        console.warn('no excel given');
        return;
    }

    fs.access(excelFile, fs.constants.R_OK, (error) => {
        if (error) {
            console.error('can not read excel', excelFile);
            return 1;
        }
        else {
            let jsonContent;
            let translationTabPath;
            let excelData = xlsx.parse(excelFile);
            let {jsonsDest} = options;

            if (jsonsDest) {
                translationTabPath = path.join(path.dirname(excelFile), jsonsDest);
            }
            else {
                translationTabPath = path.join(path.dirname(excelFile), 'tabs');
            }

            const createTranslationObject = (data) => {
                let headers = data[0], result = {};
                for (let index = 1; index < headers.length; index++) {
                    result[headers[index]] = {};
                }
                return result;
            };

            _.forEach(excelData, (worksheet) => {
                console.log('reading data from worksheet', colors.blue(worksheet.name));
                let excelTranslationObject = createTranslationObject(worksheet.data);
                let tabDestination = translationTabPath + worksheet.name + '.json';


                try {
                    jsonContent = fs.readFileSync(tabDestination);
                    if (jsonContent) {
                        jsonContent = JSON.parse(jsonContent);
                    }
                }
                catch (Exception) {
                    console.log('no file found %s', tabDestination);
                }
                let headers = worksheet.data[0];
                let languages = _.keys(excelTranslationObject);

                worksheet.data.shift();

                _.forEach(languages, (lang) => {
                    let foundIndex = _.findIndex(headers, (header) => {
                        return header === lang;
                    });
                    //excel line translation.key | lang1 | lang2 | lang3
                    _.forEach(worksheet.data, (line) => {
                        excelTranslationObject[lang][line[0]] = line[foundIndex];
                    });
                });
                if (jsonContent) {
                    console.log(colors.magenta('merging translations'));
                    _.merge(jsonContent, excelTranslationObject);
                    console.log('write merged tab data to', colors.green(tabDestination));
                    fs.writeFileSync(tabDestination, JSON.stringify(jsonContent, null, 2));
                }
                else {

                    console.log('write tab data to', colors.green(tabDestination));
                    fs.writeFileSync(tabDestination, JSON.stringify(excelTranslationObject, null, 2));
                }
            });
        }
    });


};

module.exports = {parse: parse}







