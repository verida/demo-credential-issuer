chainWebpack: (config, ...rest) => {
    config.resolve.set('symlinks', false)
}