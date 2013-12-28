'use strict';

var lrSnippet = require('connect-livereload')();

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        app : 'app',
        dist : 'dist',
        tmp : '.tmp'
    };

    grunt.initConfig({
        paths : pathConfig,
        watch : {
            compass : {
                files : ['<%= paths.app %>/{,*/}*/{,*/}*.{scss,png}'],
                tasks : ['compass:server']
            },
            livereload: {
                files: [
                    '<%= paths.app %>/*.html',
                    '<%= paths.tmp %>/stylesheets/*.css',
                    '<%= paths.app %>/javascripts/**/*.js',
                    '<%= paths.tmp %>/javascripts/**/*.js',
                    '<%= paths.tmp %>/images/**/*'
                ],
                options : {
                    livereload : true,
                    spawn : false
                }
            },
            react : {
                files : ['<%= paths.app %>/{,*/}*/{,*/}*.jsx'],
                tasks : ['react:server']
            }
        },
        connect : {
            options : {
                port : 9999,
                hostname : '0.0.0.0'
            },
            dev : {
                options : {
                    middleware : function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, pathConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server : {
                path : 'http://127.0.0.1:<%= connect.options.port %>',
                app : 'Google Chrome Canary'
            }
        },
        clean : {
            dist : ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server : '<%= paths.tmp %>'
        },
        useminPrepare : {
            html : ['<%= paths.tmp %>/*.html'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin: {
            html : ['<%= paths.tmp %>/*.html'],
            options : {
                dirs : ['<%= paths.dist %>']
            }
        },
        react : {
            server : {
                files : [
                    {
                        expand : true,
                        cwd : '<%= paths.app %>/javascripts',
                        src : ['**/*.jsx'],
                        dest : '<%= paths.tmp %>/javascripts',
                        ext : '.js'
                    }
                ]
            },
            dist : {
                files : [
                    {
                        expand : true,
                        cwd : '<%= paths.app %>/javascripts',
                        src : ['**/*.jsx'],
                        dest : '<%= paths.dist %>/javascripts',
                        ext : '.js'
                    }
                ]
            }
        },
        htmlmin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.tmp %>',
                    src : ['*.html'],
                    dest : '<%= paths.dist %>'
                }]
            }
        },
        copy : {
            tmp : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>',
                    dest : '<%= paths.tmp %>',
                    src : [
                        'stylesheets/*.*',
                        'thirdparty/Adonis/dist/adonis.css',
                        'thirdparty/Adonis/images/*.*',
                        'javascripts/**/*.js',
                        'components/**/*.*',
                        '*.html'
                    ]
                }]
            },
            dist : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>',
                    dest : '<%= paths.dist %>',
                    src : [
                        'thirdparty/Adonis/dist/adonis.css',
                        'thirdparty/Adonis/images/*.*',
                        'images/{,*/}*.{webp,gif,png,jpg,jpeg}',
                        'manifest.json',
                        'icon*.png'
                    ]
                }]
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/compass/sass',
                cssDir : '<%= paths.app %>/stylesheets',
                imagesDir : '<%= paths.app %>/compass/images',
                relativeAssets : false,
                httpGeneratedImagesPath: '../images'
            },
            dist : {
                options : {
                    cssDir : '<%= paths.dist %>/stylesheets',
                    generatedImagesDir : '<%= paths.dist %>/images',
                    outputStyle : 'compressed'
                }
            },
            server : {
                options : {
                    cssDir : '<%= paths.tmp %>/stylesheets',
                    generatedImagesDir : '<%= paths.tmp %>/images',
                    debugInfo : true
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= paths.dist %>/javascripts/{,*/}*.js',
                        '<%= paths.dist %>/stylesheets/{,*/}*.css'
                    ]
                }
            }
        },
        imagemin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.dist %>/images',
                    src : '{,*/}*.{png,jpg,jpeg}',
                    dest : '<%= paths.dist %>/images'
                }]
            }
        },
        requirejs : {
            dist : {
                options : {
                    almond : true,
                    appDir : '<%= paths.tmp %>/javascripts',
                    dir : '<%= paths.dist %>/javascripts',
                    optimize : 'uglify',
                    baseUrl : './',
                    mainConfigFile : '<%= paths.tmp %>/javascripts/config.js',
                    uglify : {
                        toplevel : true,
                        ascii_only : false,
                        beautify : false
                    },
                    preserveLicenseComments : true,
                    useStrict : false,
                    wrap : true,
                    modules : [{
                        name : 'config',
                        include : ['$', '_', 'Backbone', 'React']
                    }, {
                        name : 'index',
                        include : ['indexMain'],
                        exclude : ['config']
                    }, {
                        name : 'cate',
                        include : ['cateMain'],
                        exclude : ['config']
                    }]
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'ebook.zip'
                },
                files: [{
                    src: ['<%= paths.dist %>/**/*.*'],
                    dest: './'
                }]
            }
        },
        bump : {
            options : {
                files : ['package.json', '<%= paths.app %>/manifest.json', 'bower.json'],
                updateConfigs : [],
                commit : true,
                commitMessage : 'Release v%VERSION%',
                commitFiles : ['-a'],
                createTag : true,
                tagName : 'v%VERSION%',
                tagMessage : 'Version %VERSION%',
                push : false
            }
        },
        shell: {
            buildAdonis : {
                options : {
                    stdout : true
                },
                command : ['cd app/thirdparty/Adonis', 'grunt build'].join('&&')
            }
        }
    });

    grunt.registerTask('server', [
        'shell:buildAdonis',
        'clean:server',
        'compass:server',
        'react:server',
        'connect:dev',
        'open',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'react:server',
        'shell:buildAdonis',
        'copy:tmp',
        'copy:dist',
        'requirejs:dist',
        'compass:dist',
        'useminPrepare',
        'imagemin',
        'htmlmin',
        'concat',
        'uglify',
        'usemin'
    ]);

    grunt.registerTask(['update'], [
        'bump-only:patch',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask(['build:release'], [
        'bump',
        'build'
    ]);

    grunt.registerTask(['build:patch'], [
        'bump:patch',
        'build'
    ]);
};