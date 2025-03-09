const fileService = require('../services/fileService');

exports.uploadExcel = async (req, res) => {
    try {
        const result = await fileService.convertExcelToJson(req.file.path);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.jsonToExcel = async (req, res) => {
    try {
        const filePath = await fileService.convertJsonToExcel(req.body.jsonData);
        res.download(filePath, () => fs.unlinkSync(filePath));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};