var schedule = require('node-schedule')
var express = require('express')
var http = require('http')
var IO = require('socket.io')

class DokkuAdminPage {
	constructor(title, taskFunction, dailyRunHour) {
		const self = this
		this.title = title
		this.startTime = new Date()
		this.task = schedule.scheduleJob({
			hour: dailyRunHour + 4 + (this.startTime.getHours() - this.startTime.getUTCHours()), // deal with time zone
			minute: 0
		}, taskFunction)
		this.taskFunction = taskFunction
		this.log = []
		this.app = express()
		this.httpServer = http.Server(this.app)
		this.io = IO(this.httpServer)
		this.app.use(express.static('static'))
		this.app.set('view engine', 'pug')
		this.app.get('/', function(request, response) {
			response.render('index', {
				title: self.title,
				log: self.log,
				nextTime: self.task.nextInvocation(),
				started: self.startTime
			})
		})
		this.app.get('/start', function(request, response) {
			self.taskFunction()
			response.send('OK')
		})
		this.io.on('connection', function(socket) {
			console.log('a user connected')
			socket.on('disconnect', function() {
				console.log('a user disconnected')
			})
		})
	}
	logger(data) {
		var msg = {
			time: new Date(),
			message: data.toString()
		}
		this.log.unshift(msg)
		this.io.emit('log', msg)
		console.log(msg)
		this.log = this.log.slice(0, 300)
	}
	start() {
		var port = process.env.PORT ? process.env.PORT : 80
		this.httpServer.listen(port, function() {
			console.log('Listening on port ' + port)
		})
	}
}

module.exports = DokkuAdminPage