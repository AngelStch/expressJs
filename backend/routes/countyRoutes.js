const express = require('express');
const {
    getAllCounties,
    getCountyByName,
    fetchAndStoreCounties,
    fetchAndUpsertCounties
} = require('../controllers/countyController');

const router = express.Router();

router.get('/', getAllCounties);
router.get('/county/:countyName', getCountyByName);
router.get('/fetch-and-store', fetchAndStoreCounties);
router.get('/fetch-and-upsert', fetchAndUpsertCounties);

module.exports = router;
