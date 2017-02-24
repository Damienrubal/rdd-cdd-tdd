#!/usr/bin/env node
'use strict';


const meow = require('meow');
//module to use color
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
//methode which will use cli as argument
const weather = require('./');

const cli = meow({
	help: [
		'Usage',
		'  $ weather <input>',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

function _toCelcius(temp) {
	return Math.round(((temp - 32) * 5) / 9);
}

updateNotifier({ pkg}).notify();

weather(cli.input, (err, result) => {
	if (err) {
		console.log(chalk.bold.red(err));
		process.exit(1);
	}
//Example: Partly Cloudy
	let condition = result.query.results.channel.item.condition.text;
//Temperature 
	let temperature;
// to give the temperature in C if the third argument is C
	if (cli.input[2] && cli.input[2] === 'C') {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	} 
// to give the temperature in F if the third argument is F
	else if (cli.input[2] && cli.input[2] === 'F') {
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} 
// to Default give the temperature in C
	else {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}
// Default choice , when you don't put arguments in the console.
	let city = cli.input[0] ? cli.input[0] : 'Dhaka';
	let country = cli.input[1] ? cli.input[1] : 'Bangladesh';

	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));
	process.exit();
});
