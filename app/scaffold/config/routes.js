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
    error: "NotFound"
};