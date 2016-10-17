var Expressway = require('expressway');
var app = Expressway.cli(__dirname+"/../");
var crud = app.get('permissionBuilder');

var installer = new Expressway.Seeder('installation');
var media = new Expressway.Seeder('mediaSeeder');


// A couple of basic roles.
// Add as many custom roles as you please.
var roles = [
    {
        name: 'superuser',
        description: "Has system-wide permissions.",
        permissions: ['superuser']
    },
    {
        name: 'manager',
        description: "Has permission to add, edit and delete media.",
        permissions: crud(['Media'])
    }];

// Add our seeds into the seeder instance.
installer.add('User',  'users.csv');
installer.add('Role',  roles);
media.add('Media', 'media.csv');


Expressway.Seeder.prepareAll( result => {

    // Use this opportunity between seeding to assign some relationships.
    // Assign the users their appropriate roles.
    installer.User[0].roles = [installer.Role[0].id];
    installer.User[1].roles = [installer.Role[1].id];

}).then( result => {

    // Create the documents in the database.
    Expressway.Seeder.seedAll();
});