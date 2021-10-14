const database = require('../controllers/database.controller');

module.exports = (app) => {
	app.get('/api/get_database', database.getDatabase);
};
