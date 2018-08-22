const DokkuAdminPage = require('./index')
const app = new DokkuAdminPage('Test')
app.addTask(function() {
	app.logger('xd')
	app.setStatus(Math.random(), (Math.random() * 100) + '/100')
}, 'Test1', 12)
app.start()