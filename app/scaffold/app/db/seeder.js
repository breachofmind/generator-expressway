var Expressway = require('expressway');
var app = Expressway.cli(__dirname+"/../");
var crud = app.get('permissionBuilder');

var installer = new Expressway.Seeder('installation');

var roles = [
    {
        name: 'superuser',
        description: "Has system-wide permissions.",
        permissions: ['superuser']
    }];

// Add our seeds into the seeder instance.
installer.add('User',  'users.csv');
installer.add('Role',  roles);

Expressway.Seeder.prepareAll( result => {

    // Use this opportunity between seeding to assign some relationships.
    // Assign the users their appropriate roles.
    installer.User[0].roles = [installer.Role[0].id];

}).then( result => {

    // Create the documents in the database.
    Expressway.Seeder.seedAll();
});