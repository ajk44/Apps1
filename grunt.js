// Build configurations.
module.exports = function (grunt) {
	grunt.initConfig({

		/* 
			ngtemplates completely defines what the app does because it dictates what the top-level
			view is.

			Provided 
		*/
		ngtemplates: {
			app: {
				options: {base: '/src/views'},
				src: [
					'src/views/tilted1.html',
					'src/views/nav.html',
					'src/views/partial1.html',
					'src/views/partial2.html',
					'src/views/todo.html',
					'src/views/directives/tiltedSquare.html',
					'src/views/directives/svgMarginConvention.html'
					],
				dest: 'temp/scripts/templates.js'
			}
		},


		/*
			Deletes dist and temp and embed directories.
			The temp directory is used during the build process.
			The dist directory contains a standalone app
			The NRICH directory contains site specific uploadables
			These directories should be deleted before subsequent builds.
		*/
		'delete': {
			uploads: {
				files: ['./uploads']
			},
			dist: {
				files: ['./dist/']
			},
			temp: {
				files: ['./temp/']
			}
		},

		// CoffeeScript linting rules.
		coffeeLint: {
			scripts: {
				files: ['./src/scripts/**/*.coffee', './test/scripts/**/*.coffee'],
				// Use one tab for indentation.
				indentation: {
					value: 1,
					level: 'error'
				},
				// No maximum line length.
				max_line_length: {
					level: 'ignore'
				},
				// Using tabs should not result in an error.
				no_tabs: {
					level: 'ignore'
				}
			}
		},


		// Compile CoffeeScript (.coffee) files to JavaScript (.js).
		coffee: {
			scripts: {
				files: {
					'./temp/scripts/': './src/scripts/**/*.coffee',
					'./test/scripts/': './test/scripts/**/*.coffee'
				},
				// Don't include a surrounding Immediately-Invoked Function Expression (IIFE) in the compiled output.
				// For more information on IIFEs, please visit http://benalman.com/news/2010/11/immediately-invoked-function-expression/
				bare: true
			}
		},

		// Compile LESS (.less) files to CSS (.css).
		less: {
			styles: {
				files: {
					'./temp/styles/styles.css': './src/styles/styles.less'
				}
			}
		},

		/*
			Compile template html files to final html with any grunt/underscore interpolation commands resolved.

			The example below demonstrates the use of the environment configuration setting.
			In 'prod' the concatenated and minified scripts are used along with a unique QueryString parameter to address browser caching.
			In environments other than 'prod' the individual files are used and loaded with RequireJS.

			<% if (config.environment === 'prod') { %>
				<script src="/scripts/scripts.min.js?_=v<%= config.uniqueVersion() %>"></script>
			<% } else { %>
				<script data-main="/scripts/main.js" src="/scripts/libs/require.js"></script>
			<% } %>
		*/
		template: {
			views: {
				files: {
					'./temp/views/': './src/views/**/*.html'
				}
			},
			dev: {
				files: {
					'./temp/index.html': './src/index.html'
				},
				environment: 'dev'
			},
			prod: {
				files: '<config:template.dev.files>',
				environment: 'prod'
			}
		},

		/*
			Creates a single file consisting of multiple views (html) files surrounded by script tags.

			For example, take the following two files:
				<!-- /temp/views/people.html (compiled from /src/views/people.template) -->
				<ul ng-hide="!people.length">
					<li class="row" ng-repeat="person in people | orderBy:'name'">
						<a ng-href="#/people/{{person.id}}" ng-bind="person.name"></a>
					</li>
				</ul>

				<!-- /temp/views/repos.html (compiled from /src/views/repos.html) -->
				<ul ng-hide="!repos.length">
					<li ng-repeat="repo in repos | orderBy:'pushed_at':true">
						<a ng-href="{{repo.url}}" ng-bind="repo.name" target="_blank"></a>
						<div ng-bind="repo.description"></div>
					</li>
				</ul>

			AngularJS will interpret inlined scripts with type of "text/ng-template" in lieu of retrieving the view from the server.
			The id of the script tag must match the path requested.
			Since the path includes the temp directory, this must be trimmed.

			The output of the configuration below is:
				<!-- /temp/views/views.html -->
				<script id="/views/people.html" type="text/ng-template">
					<ul ng-hide="!people.length">
						<li class="row" ng-repeat="person in people | orderBy:'name'">
							<a ng-href="#/people/{{person.id}}" ng-bind="person.name"></a>
						</li>
					</ul>
				</script>
				<script id="/views/repos.html" type="text/ng-template">
					<ul ng-hide="!repos.length">
						<li ng-repeat="repo in repos | orderBy:'pushed_at':true">
							<a ng-href="{{repo.url}}" ng-bind="repo.name" target="_blank"></a>
							<div ng-bind="repo.description"></div>
						</li>
					</ul>
				</script>

			Now the views.html file can be included in the application and avoid making requests to the server for the views.

		inlineTemplate: {
			views: {
				files: {
//					'./temp/views/views.html': './temp/views/*.html'
				},
				type: 'text/ng-template',
				trim: 'temp'
			}
		},
		*/

		// Copies directories and files from one location to another.
		copy: {
			// Copies libs and img directories to temp.
			temp: {
				files: {
					'./temp/scripts/libs/': './src/scripts/libs/',
					'./temp/img/': './src/img/'
				}
			},
			/*
				Copies the contents of the temp directory to the dist directory.
				In 'dev' individual files are used.
			*/
			dev: {
				files: {
					'./dist/': './temp/'
				}
			},
			/*
				Copies select files from the temp directory to the dist directory.
				In 'prod' minified files are used along with img and libs.
				The dist artifacts contain only the files necessary to run the application.
			*/
			prod: {
				files: {
					'./dist/img/': './temp/img/',
					'./dist/scripts/': './temp/scripts/scripts.min.js',
					'./dist/scripts/libs': ['./temp/scripts/libs/html5shiv-printshiv.js', './temp/scripts/libs/json2.js'],
					'./dist/styles/': './temp/styles/styles.min.css',
					'./dist/index.html': './temp/index.min.html'
				}
			},
			// Task is run when a watched script is modified.
			scripts: {
				files: {
					'./dist/scripts/': './temp/scripts/'
				}
			},
			// Task is run when a watched style is modified.
			styles: {
				files: {
					'./dist/styles/': './temp/styles/'
				}
			},
			// Task is run when the watched index.html file is modified.
			index: {
				files: {
					'./dist/': './temp/index.html'
				}
			},
			// Task is run when a watched view is modified.
			views: {
				files: {
					'./dist/views/': './temp/views/'
				}
			}
		},

		/*
			RequireJS optimizer configuration for both scripts and styles.
			This configuration is only used in the 'prod' build.
			The optimizer will scan the main file, walk the dependency tree, and write the output in dependent sequence to a single file.
			Since RequireJS is not being used outside of the main file or for dependency resolution (this is handled by AngularJS), RequireJS is not needed for final output and is excluded.
			RequireJS is still used for the 'dev' build.
			The main file is used only to establish the proper loading sequence.
		*/
		requirejs: {
			scripts: {
				baseUrl: './temp/scripts/',
				findNestedDependencies: true,
				logLevel: 0,
				mainConfigFile: './temp/scripts/main.js',
				name: 'main',
				// Exclude main from the final output to avoid the dependency on RequireJS at runtime.
				onBuildWrite: function (moduleName, path, contents) {
					var modulesToExclude = ['main'],
						shouldExcludeModule = modulesToExclude.indexOf(moduleName) >= 0;

					if (shouldExcludeModule) {
						return '';
					}

					return contents;
				},
				optimize: 'none', //uglify',
				out: './temp/scripts/scripts.min.js',
				preserveLicenseComments: false,
				skipModuleInsertion: true,
				uglify: {
					// Let uglifier replace variables to further reduce file size.
					no_mangle: false
				}
			},
			styles: {
				baseUrl: './temp/styles/',
				cssIn: './temp/styles/styles.css',
				logLevel: 0,
				optimizeCss: 'standard',
				out: './temp/styles/styles.min.css'
			}
		},

		/*
			Minifiy index.html.
			Extra white space and comments will be removed.
			Content within <pre /> tags will be left unchanged.
			IE conditional comments will be left unchanged.
			As of this writing, the output is reduced by over 14%.
		*/
		minifyHtml: {
			prod: {
				files: {
					'./temp/index.min.html': './temp/index.html'
				}
			}
		},

		// Sets up file watchers and runs tasks when watched files are changed.
		watch: {
			scripts: {
				files: './src/scripts/**/*.coffee',
				tasks: 'coffeeLint:scripts coffee:scripts copy:scripts reload'
			},
			styles: {
				files: './src/styles/**/*.less',
				tasks: 'less copy:styles reload'
			},
			index: {
				files: './src/index.html',
				tasks: 'template:dev copy:index reload'
			},
			views: {
				files: './src/views/**/*.html',
				tasks: 'ngtemplates copy:scripts template:views copy:views reload'
			}
		},

		/*
			Runs a web server at the specified port.
			Can optionally watch for changes to the file referenced in the watch setting.
			The web server will automatically restart once the changes have been saved.
		*/
		server: {
			app: {
				src: './server.coffee',
				port: 3005,
				watch: './routes.coffee'
			}
		},

		/*
			Leverages the LiveReload browser plugin to automatically reload the browser when watched files have changed.

			As of this writing, Chrome, Firefox, and Safari are supported.

			Get the plugin:
			here http://help.livereload.com/kb/general-use/browser-extensions
		*/
		reload: {
			liveReload: true,
			port: 35729
		}
	});

	/*
		Register grunt tasks supplied by grunt-hustler.
		Referenced in package.json.
		https://github.com/CaryLandholt/grunt-hustler
	*/
	grunt.loadNpmTasks('grunt-hustler');

	/*
		Register grunt tasks supplied by grunt-reload.
		Referenced in package.json.
		https://github.com/webxl/grunt-reload
	*/
	grunt.loadNpmTasks('grunt-reload');

	/* 
		Register task to install directive templateURLs directly into the templateCache
		from https://github.com/ericclemmons/grunt-angular-templates
	*/
	grunt.loadNpmTasks('grunt-angular-templates');

	// A task to run unit tests in testacular.
	grunt.registerTask('unit-tests', 'run the testacular test driver on jasmine unit tests', function () {
		var done = this.async();

		require('child_process').exec('./node_modules/testacular/bin/testacular start ./testacular.conf.js --single-run', function (err, stdout) {
			grunt.log.write(stdout);
			done(err);
		});
	});

	/*
		Compiles the app with non-optimized build settings and places the build artifacts in the dist directory.
		Enter the following command at the command line to execute this build task:
		grunt
	*/
	grunt.registerTask('default', [
		'delete',
		'coffeeLint',
		'coffee',
		'less',
		'ngtemplates',
		'template:dev',
		'copy:temp',
		'copy:dev',
		'delete:temp'
	]);

	/*
		Compiles the app with non-optimized build settings, places the build artifacts in the dist directory, and watches for file changes.
		Enter the following command at the command line to execute this build task:
		grunt dev
	*/
	grunt.registerTask('dev', [
		'default',
		'reload',
		'watch'
	]);

	/*
		Compiles the app with optimized build settings and places the build artifacts in the dist directory.
		Enter the following command at the command line to execute this build task:
		grunt prod
	*/
	grunt.registerTask('prod', [
		'delete',
		'coffeeLint',
		'coffee',
		'less',
		'ngtemplates',
		'template:prod',
		'copy:temp',
		'requirejs',
		'minifyHtml',
		'copy:prod',
		'delete:temp'
	]);

	/*
		Compiles the app with non-optimized build settings, places the build artifacts in the dist directory, and runs unit tests.
		Enter the following command at the command line to execute this build task:
		grunt test
	*/
	grunt.registerTask('test', [
		'default',
		'unit-tests'
	]);
};