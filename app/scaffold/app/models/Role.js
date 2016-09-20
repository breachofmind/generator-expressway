var _   = require('lodash');
var expressway = require('expressway');

module.exports = expressway.Model.create('Role', function Blueprint(app)
{
    this.title = 'name';
    this.expose = false;
    this.guarded = [];
    this.appends = [];
    this.labels = {};

    // Set the schema for this model.
    this.schema = {
        name:        { type: String, required: true },
        description: { type: String },
        permissions: [ {type: String} ],
        created_at:  { type: Date, default: Date.now },
        modified_at: { type: Date, default: Date.now }
    };


    // Set the model methods.
    this.methods = {
        assign: function (permission)
        {
            this.permissions = this.permissions.push(permission);
            this.save();
        },

        unassign: function(permission)
        {
            this.permissions = _.filter(this.permissions, function(currentPermission) {
                return currentPermission != permission;
            });
            this.save();
        }
    }
});