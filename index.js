var schedule = require('node-schedule')
var express = require('express')
var http = require('http')
var IO = require('socket.io')

class DokkuAdminPage {
	constructor(title) {
		const self = this
		this.title = title
		this.tasks = []
		this.startTime = new Date()
		this.log = []
		this.status = {
			progress: 100,
			message: 'Loaded'
		}
		this.app = express()
		this.httpServer = http.Server(this.app)
		this.io = IO(this.httpServer)
		this.app.use(express.static(__dirname + '/static'))
		this.app.set('view engine', 'pug')
		this.app.set('views', __dirname + '/views')
		this.app.get('/', function(request, response) {
			response.render('index', {
				title: self.title,
				log: self.log,
				tasks: self.tasks,
				started: self.startTime,
				status: self.status
			})
		})
		this.app.get('/task', function(request, response) {
			var task = self.tasks[request.query.task]
			self.logger('Triggering task "' + task.name + '" manually');
			task.f();
			response.send('OK')
		})
		this.io.on('connection', function(socket) {
			console.log('a user connected')
			socket.on('disconnect', function() {
				console.log('a user disconnected')
			})
		})
	}
	addTask(f, name, rule) {
		var task = {
			f: f,
			name: name,
			id: this.tasks.length
		}
		if (rule !== undefined) {
			if (typeof rule !== 'object') {
				// assume rule is hour
				rule = {
					hour: rule + 4 + (this.startTime.getHours() - this.startTime.getUTCHours()), // assume input time is Eastern, adjust for any server
					minute: 0
				}
			}
			task.schedule = schedule.scheduleJob(rule, f)
		}
		this.tasks.push(task)
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
	setStatus(progress, message) {
		this.status.progress = progress
		this.status.message = message
		this.io.emit('status', this.status)
	}
	start() {
		var port = process.env.PORT ? process.env.PORT : 80
		this.httpServer.listen(port, function() {
			console.log('Listening on port ' + port)
		})
	}
}

module.exports = DokkuAdminPage