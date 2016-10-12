module.exports = function(Seeder,app)
{
    var seeder = new Seeder('installation');
    var logger = app.get('log');

    // When the seeder runs, all seeds
    // will clear their documents.
    seeder.reset = true;

    // A couple of basic roles.
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


    var Seeds = {
        User:       seeder.add('User',      'users.csv'),
        Media:      seeder.add('Media',     'media.csv'),
        Roles:      seeder.add('Role',      roles),
    };

    // The first step will parse the CSV rows.
    seeder.run().then(function(seeder){

        // Assign the users their appropriate roles.
        seeder.User[0].roles = [seeder.Role[0]._id];
        seeder.User[1].roles = [seeder.Role[1]._id];

        // Create the documents in the database.
        seeder.seed().then(function(){

            logger.info('[Seeder] Done seeding.');
            process.exit(1);
        })
    })

};

function crud(models)
{
    var out = [];
    models.forEach(function(model) {
        ['create','read','update','delete'].forEach(function(action) {
            out.push(model+"."+action);
        })
    });
    return out;
}