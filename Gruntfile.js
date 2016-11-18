module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var currentVersion = require('./package.json').version;

    grunt.initConfig({
        sasslint: {
            options: {
                configFile: '.sass-lint.yml',
            },
            target: ['src/styles/*.scss']
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/styles',
                    src: '*.scss',
                    dest: 'docs/css/',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
            map: true, // inline sourcemaps
            processors: [
                require('autoprefixer')({browsers: ['last 2 versions', 'iOS 8']}) // add vendor prefixes
                ]
            },
            project: {
                src: 'docs/project.css'
            }
        },

        // Lint JS Files
        eslint: {
            scripts: ['src/scripts/**/*.js']
        },

        browserSync: {
            bsFiles: {
                src: [
                    'docs/**/*.html',
                    'docs/**/*.css',
                    'docs/**/*.js'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: 'docs'
                }
            }
        },

        concat: {
            // Concatenate nunjucks components macro files
            component_macros: {
                options: {
                    banner: '{# DO NOT EDIT: The contents of this file are dynamically generated and will be overwritten #}\n'
                },
                src: ['src/components/**/*.njk', '!src/components/project.njk'],
                dest: 'src/components/project.njk'
            },
            scripts: {
                options: {
                    banner: '// DO NOT EDIT: The contents of this file are dynamically generated and will be overwritten\n'
                },
                src: ['src/scripts/**/*.js'],
                dest: 'docs/scripts/project.js'
            }
        },

        // Compile nunjucks doc src files to html
        nunjucks: {
            options: {
                configureEnvironment: function(env, nunjucks) {
                    // 
                },
                data: grunt.file.exists('src/data.json') ? grunt.file.readJSON('src/data.json') : {},
                paths: ['src/components', 'src/templates', 'src']
            },
            render: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: '**/*.njk',
                        dest: 'docs',
                        ext: '.html'
                    }
                ]
            }
        },

        // SVG Optimization, remove inline style, strip out fill attributes added by Illustrator, etc.
        svgmin: {
            options: {
                plugins: [
                    {
                        removeAttrs: {
                            attrs: ['fill']
                        }
                    },
                    {
                        removeStyleElement: true
                    }
                ]
            },
            icons: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/svg/',
                        src: '**/*.svg',
                        dest: 'src/svg/'
                    }
                ]
            }
        },

        // SVG Sprite creation -> releases/latest/comet
        svg_sprite: {
            icons: {
                expand: true,
                cwd: 'src/svg/',
                flatten: true,
                src: ['**/*.svg'],
                dest: 'docs/svg',
                svg: {
                    namespaceIDs: false
                },
                options: {
                    mode: {
                        symbol: {
                            dest: '.',
                            sprite: 'project.svg',
                            example: false
                        }
                    },
                    shape: {
                        id: {
                            generator: function(name) {
                                var filename = name.split("/").pop();
                                // Don't include the parent directory name in the Shape ID
                                return filename.substring(0, filename.length - 4);
                            }
                        }
                    }
                }
            }
        },

        copy: {
            vendor_scripts: {
                expand: true,
                src: [
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/svg4everybody/dist/svg4everybody.min.js',
                    'node_modules/jquery-ui/ui/widget.js',
                    'node_modules/jquery-ui/ui/data.js',
                    'node_modules/jquery-ui/ui/scroll-parent.js',
                    'node_modules/jquery-ui/ui/plugin.js',
                    'node_modules/jquery-ui/ui/safe-active-element.js',
                    'node_modules/jquery-ui/ui/safe-blur.js',
                    'node_modules/jquery-ui/ui/widgets/draggable.js',
                    'node_modules/jquery-ui/ui/widgets/mouse.js',
                    'node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.js'
                ],
                flatten: true,
                dest: 'docs/scripts'
            },
            local_fonts: {
                cwd: 'src',
                expand: true,
                src: 'fonts/*/**',
                dest: 'docs/'
            }        
        },

        watch: {
            styles: {
                files: 'src/styles/*.scss',
                tasks: ['styles']
            },
            scripts: {
                files: 'src/scripts/*.js',
                tasks: ['scripts']
            },
            nunjucks_render: {
                files: ['src/**/*{.njk,.md}', '!src/components/project.njk'],
                tasks: 'markup'
            },
            svg: {
                files: ['src/svg/**/*.svg'],
                tasks: ['svg']
            },
            // project_assets: {
            //     files: ['releases/latest/project/**/*'],
            //     tasks: 'newer:copy:project_to_dist'
            // },
            // package_json: {
            //     files: 'package.json',
            //     tasks: ['set_project_data'] //re-render markup since it may reference the version number from package.json
            // },
            // tokens: {
            //     files: 'src/library/base/tokens.yaml',
            //     tasks: ['process_tokens_file']
            // },
            // nunjucks_content: {
            //     files: ['src/docs/data/**/*.json', '!src/docs/data/auto-generated/all_data.json'], //If any of the content json files change (auto-generated or manually updated), re-render markup
            //     tasks: ['set_nunjucks_global_data', 'markup']
            // },
            // project_images: {
            //     files: ['src/library/base/images/**/*'],
            //     tasks: 'newer:copy:project_images_to_release'
            // },
            // fonts: {
            //     files: 'src/library/base/fonts/**/*',
            //     tasks: 'webfonts'
            // }
        },
        relativeRoot: {
            markup: {
              options: {
                root: 'docs'
              },
              files: [{
                expand: true,
                cwd: '<%= relativeRoot.markup.options.root %>',
                src: ['**/*.html'],
                dest: 'docs/'
              }]
            },
            styles: {
              options: {
                root: 'docs'
              },
              files: [{
                expand: true,
                cwd: '<%= relativeRoot.styles.options.root %>',
                src: ['**/*.css'],
                dest: 'docs/'
              }]
            }
        },
    });
    grunt.registerTask('svg', ['svgmin', 'svg_sprite']);
    grunt.registerTask('styles', ['sasslint', 'sass', 'postcss', 'relativeRoot']);
    grunt.registerTask('scripts', ['eslint:scripts', 'concat:scripts']);
    grunt.registerTask('markup', ['concat:component_macros', 'nunjucks', 'relativeRoot']);
    grunt.registerTask('build-docs', ['svg', 'copy', 'scripts', 'styles', 'markup']);
    grunt.registerTask('dev', ['build-docs', 'browserSync', 'watch']);


    grunt.registerTask('default', ['dev']);
};

