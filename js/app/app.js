﻿var chromeext = angular.module('GoogleChromeExt', ['ngRoute','ui.bootstrap','LocalStorageModule']);


chromeext.config(function ($routeProvider) {
		'use strict';
		$routeProvider.when('/', {
			controller: 'TodoCntrl',
			templateUrl: 'all.html'
		})
		.when('/apps', {
			controller: 'ChromeAppsCtrl',
			templateUrl: 'chromeapps.html'
		})
		.when('/bookmarks', {
			controller: 'ChromeBookmarksManager',
			templateUrl: 'chromebookmark.html'
		})
		.when('/:status', {
			controller: 'TodoCntrl',
			templateUrl: 'all.html'
		})
		.otherwise({
			redirectTo: '/'
		});
	});

chromeext.config( [
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(http?|ftp|mailto|file|https|https:\/\/rss.cnn.com\/rss\/cnn_topstories.rss):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);
