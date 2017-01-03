"use strict";

/**
 * Seeder service.
 *
 * @injectable
 * @param app Application
 * @param opts Object
 * @param seeder SeederService
 * @param permissions Function
 */
module.exports = function(app,opts,seeder,permissions)
{
    seeder.opts = opts;

    var installer = seeder.add('installer');

    // Add our seeds into the seeder instance.
    installer.add('Media','media.csv');


    seeder.prepare( result => {

        // Use this opportunity between seeding to assign some relationships.
        // installer.Media[0].author = installer.User[0]._id

    }).then( result => { seeder.seed() });
};








