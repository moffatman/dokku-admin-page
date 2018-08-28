const DokkuAdminPage = require('./index')
const app = new DokkuAdminPage('Test')
app.setStatusClasses(['bg-info', 'bg-warning'])
app.addTask(function() {
	app.logger('xd')
	app.setStatusClasses(['bg-success', 'bg-danger'])
	app.setStatus([Math.random(), 0.2], (Math.random() * 100) + '/100')
}, 'Test1')
app.addTask(function() {
	app.setStatusClasses(['bg-info', 'bg-warning'])
	app.setStatus([Math.random(), Math.random()], (Math.random() * 100) + '/100')
}, '2')
app.start()