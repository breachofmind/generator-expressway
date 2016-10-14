var Expressway = require('expressway');
var app = Expressway.cli(__dirname+"/../");
var crud = app.get('permissionBuilder');

var seeder = new Expressway.Seeder('installation');

// When the seeder runs, all seeds
// will clear their documents.
seeder.reset = true;

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
seeder.add('User',  'users.csv');
seeder.add('Media', 'media.csv');
seeder.add('Role',  roles);

// The first step will parse the CSV rows.
seeder.prepare().then( result => {

    // Use this opportunity between seeding to assign some relationships.
    // Assign the users their appropriate roles.
    seeder.User[0].roles = [seeder.Role[0].id];
    seeder.User[1].roles = [seeder.Role[1].id];

    // Create the documents in the database.
    seeder.seed().then(seeder.done);
});