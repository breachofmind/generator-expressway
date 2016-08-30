module.exports = function(Seeder,app)
{
    var seeder = new Seeder('installation');

    seeder.reset = true;

    var roles = [{
        name: 'superuser',
        description: "Has system-wide permissions.",
        permissions: ['superuser']
    }];


    var Seeds = {
        User:  seeder.add('User', 'users.csv'),
        Media: seeder.add('Media', 'media.csv'),
        Roles: seeder.add('Role', roles)
    };

    seeder.run().then(function(){

        // Assign the user the superuser role.
        seeder.get('User').data[0].roles = [
            seeder.get('Role').data[0]._id
        ];


        seeder.seed().then(function(){

            app.logger.info('[Seeder] Done seeding.');
            process.exit(1);
        })
    })

};