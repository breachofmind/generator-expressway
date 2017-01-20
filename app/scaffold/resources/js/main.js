//.main entry point

require('./app');

if (module.hot) {
    // Causes the hot reloader to refresh page on error
    module.hot.accept('./app', function(err,updates) {
        if (err) window.location.reload();
    });
}