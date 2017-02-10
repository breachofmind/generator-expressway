var path = require('path');

module.exports.routes = {
    middleware: [
        'Development',
        'Static',
        'Init',
        'ConsoleLogging',
        'BodyParser',
        'Localization',
        'Session',
    ],
    paths: [
        {"GET /": "IndexController.index"}
    ],
    error: "NotFound",
    static: {
        "/" : path.resolve(__dirname, "../public")
    }
};