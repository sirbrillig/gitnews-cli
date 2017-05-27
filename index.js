#!/usr/bin/env node
const get = require( 'lodash.get' );
require( 'dotenv' ).config();
const chalk = require( 'chalk' );
const date = require( 'date-fns' );
const meow = require( 'meow' );
const inquirer = require( 'inquirer' );
const Conf = require( 'conf' );
const columnify = require( 'columnify' );
const { getNotifications, setLogger } = require( 'gitnews' );

const config = new Conf();

function getUrl( note ) {
	return get( note, 'commentUrl', '' );
}

function getDate( note ) {
	const now = Date.now();
	return date.distanceInWords(
		now,
		date.parse( get( note, 'updatedAt', '' ) ),
		{ addSuffix: true }
	);
}

function getRepo( note ) {
	return get( note, 'repositoryFullName', '' );
}

function getTitle( note ) {
	return get( note, 'title', '' );
}

function truncateString( string, length ) {
	if ( string.length <= length ) {
		return string;
	}
	return string.substr( 0, length - 1 ) + '…';
}

function getFormattedNotification( note ) {
	return {
		date: chalk.bold.yellow( getDate( note ) + ': ' ),
		repo: chalk.green( '(' + truncateString( getRepo( note ), 25 ) + ') ' ),
		title: truncateString( getTitle( note ), 50 ),
		url: chalk.green( getUrl( note ) ),
	};
}

function output( line ) {
	console.log( line );
}

function outputColumns( data ) {
	const options = {
		columns: [ 'date', 'repo', 'title', 'url' ],
		showHeaders: false,
	};
	output( columnify( data, options ) );
}

function getFormattedNotifications( notifications ) {
	return notifications.map( getFormattedNotification );
}

function printNotifications( notifications ) {
	if ( notifications.length < 1 ) {
		output( '👍  No notifications!' );
		return;
	}
	outputColumns( getFormattedNotifications( notifications ) );
}

function printError( err ) {
	if ( err === 'GitHub token is not available' ) {
		printError( chalk.yellow( 'You do not have a GitHub token configured.' ) );
		printError( chalk.yellow( 'Please Generate one at https://github.com/settings/tokens' ) );
		printError( chalk.green( 'Once you have a token, run `gitnews --save-token`' ) );
	}
	console.error( err );
}

function fetchAndPrintNotifications() {
	getNotifications( getToken() )
		.then( notes => notes.filter( note => note.unread ) )
		.then( printNotifications )
		.catch( printError );
}

function fetchAndPrintReadNotifications() {
	getNotifications( getToken() )
		.then( notes => notes.filter( note => ! note.unread ) )
		.then( printNotifications )
		.catch( printError );
}

function saveToken( token ) {
	config.set( 'token', token );
}

function getToken() {
	return process.env.GITNEWS_TOKEN || config.get( 'token' );
}

// -------------

const cli = meow( `
	Usage:
		$ gitnews

	Options:
		--save-token  Prompt for the token and save it.
		--read        Show read notifications instead of unread.
		--verbose     Say what we're doing.
` );

if ( cli.flags.verbose ) {
	setLogger( output );
}

if ( cli.flags.saveToken ) {
	output( chalk.yellow( 'Please Generate a token at https://github.com/settings/tokens' ) );
	inquirer.prompt( { type: 'password', name: 'token', message: 'Enter the GitHub token:' } )
	// TODO: verify the token before saving
		.then( input => saveToken( input.token ) )
		.then( () => output( chalk.green( 'The token was saved! Now you can run gitnews to get your notifications.' ) ) );
} else if ( cli.flags.read ) {
	fetchAndPrintReadNotifications();
} else {
	fetchAndPrintNotifications();
}
