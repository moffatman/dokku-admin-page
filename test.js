const DokkuAdminPage = require('./index')
const app = new DokkuAdminPage('Test', function() {
	app.logger('xd')
}, 12)
app.start()