const axios = require('axios');

const arcgisUrl = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Counties/FeatureServer/0/query';

exports.getAllCounties = async (req, res) => {
    try {
        const counties = await County.find(); 
        res.status(200).json(counties); 
    } catch (error) {
        console.error('Error fetching counties:', error);
        res.status(500).send('Error fetching counties');
    }
};


exports.getCountyByName = async (req, res) => {
    try {
        const countyName = req.params.countyName;
        const params = {
            where: `NAME = '${countyName}'`,
            outFields: 'POPULATION, STATE_NAME',
            returnGeometry: 'false',
            f: 'json'
        };

        const response = await axios.get(arcgisUrl, { params });

        if (response.data.features.length > 0) {
            res.json(response.data.features[0]);
        } else {
            res.status(404).send('County not found');
        }
    } catch (error) {
        console.error('Error fetching county data:', error);
        res.status(500).send('Error fetching county data');
    }
};
