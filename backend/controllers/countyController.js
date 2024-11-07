const axios = require('axios');
const County = require('../models/county');

const arcgisUrl = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Counties/FeatureServer/0/query?where=1%3D1&outFields=population%2C+state_name&returnGeometry=false&f=pjson';

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

exports.fetchAndStoreCounties = async (req, res) => {
    try {
        await County.deleteMany({});
        const response = await axios.get(arcgisUrl);
        const features = response.data.features;

        if (!features) {
            return res.status(500).send('Error: Invalid response structure');
        }

        const countiesToInsert = features.map(feature => ({
            population: feature.attributes.POPULATION,
            state_name: feature.attributes.STATE_NAME,
        }));

        await County.insertMany(countiesToInsert, { ordered: false });
        res.status(200).json({ message: 'All counties stored successfully!' });
    } catch (error) {
        console.error('Error fetching or storing county data:', error);
        res.status(500).send('Error fetching or storing county data');
    }
};

exports.fetchAndUpsertCounties = async (req, res) => {
    try {
        await County.deleteMany({});

        const response = await axios.get(arcgisUrl);
        const features = response.data.features;

        if (!features) {
            return res.status(500).send('Error: Invalid response structure');
        }

        const statePopulationMap = features.reduce((acc, feature) => {
            const stateName = feature.attributes.STATE_NAME;
            const population = feature.attributes.POPULATION;

            if (acc[stateName]) {
                acc[stateName] += population;
            } else {
                acc[stateName] = population;
            }

            return acc;
        }, {});

        const operations = Object.keys(statePopulationMap).map(stateName => ({
            updateOne: {
                filter: { state_name: stateName },
                update: { population: statePopulationMap[stateName] },
                upsert: true,
            }
        }));

        await County.bulkWrite(operations, { ordered: false });

        res.status(200).json({ message: 'All counties with combined populations stored successfully!' });
    } catch (error) {
        console.error('Error fetching or storing county data:', error);
        res.status(500).send('Error fetching or storing county data');
    }
};
