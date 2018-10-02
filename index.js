
const { IncomingWebhook } = require('@slack/client')
const { CronJob } = require('cron')
const http = require('http')
const moment = require('moment')

const url = process.env.HOOK_URL
const webhook = new IncomingWebhook(url)

const dropMessage = () => {
  const date = moment().startOf('month').add(14, 'days')
	const wednesday = 3
	let message = null

	const currentWeekday = date.isoWeekday()
	const missingDays = ((wednesday - currentWeekday) + 7) % 7
	const nextMeeting = date.add(missingDays, 'days')

	if (moment().isSame(moment(nextMeeting).add(-1, 'days'), 'day')) {
		message = 'Just a friendly reminder the *Monthly Meeting* is going to happen tomorrow! :sparkles:'
	}

	if (moment().isSame(moment(nextMeeting), 'day')) {
		message = 'Hi people, the *Monthly Meeting* is today, see you there! :deal_with_it_parrot:'
	}

	if (message) {
		webhook.send(message)
	}
}

console.log('> Starting cron')

new CronJob('59 01 11 * * *', dropMessage).start()
http.createServer((request, response) => response.end()).listen(80)