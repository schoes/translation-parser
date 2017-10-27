const excel2json = require('./../excel2json');

describe('excel2json ==>', () => {
    it('should return with console warn', () => {
        excel2json.parse();
    });
    it('should scan for a give excel', () => {
        excel2json.parse('./test.xls');
    });
});