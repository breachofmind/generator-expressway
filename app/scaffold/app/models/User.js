var mvc = require('express-mvc');
var _ = require('lodash');

module.exports = mvc.Model.create('User', function Blueprint(app)
{
    this.title      = 'email';
    this.expose     = false;
    this.guarded    = ['password'];
    this.labels     = {};
    this.appends    = ['name'];
    this.populate   = ['roles'];
    this.managed    = true;

    this.schema = {
        email:          { type: String, required: true },
        password:       { type: String, required: true },
        first_name:     { type: String },
        last_name:      { type: String },
        roles:          [{ type:mvc.Model.types.ObjectId, ref:"Role" }],
        created_at:     { type: Date, default: Date.now },
        modified_at:    { type: Date, default: Date.now }
    };

    /**
     * Before a model is saved, encrypt the password string.
     * @returns void
     */
    this.schema.pre('save', function Model(next)
    {
        this.password = app.Auth.encrypt(this.password, this.created_at.getTime().toString());
        next();
    });

    this.methods = {

        /**
         * Checks the hashed password and salt.
         * @param password string
         * @returns {boolean}
         */
        isValid: function(password)
        {
            if (! password) {
                return false;
            }
            return this.password === app.Auth.encrypt(password,this.created_at.getTime().toString());
        },

        /**
         * Return the user's full name.
         * @returns {string}
         */
        name: function()
        {
            return [this.first_name,this.last_name].join(" ");
        },

        /**
         * Check if a user has a role.
         * @param role string name
         * @returns {boolean}
         */
        is: function(role)
        {
            for (var i=0; i<this.roles.length; i++) {
                if (this.roles[i].name.toLowerCase() == role) return true;
            }
            return false;
        },

        /**
         * Return an array of this users permissions.
         * @returns {Array}
         */
        permissions: function()
        {
            var permissions = [];
            this.roles.map(function(role) {
                permissions = _.union(role.permissions,permissions);
            });
            return permissions;
        },

        /**
         * Check if a user can perform an action.
         * @param object string
         * @param action string
         * @returns {*}
         */
        can: function(object,action)
        {
            if (! app.gate) return true;

            return app.gate.check(this,object,action);
        }
    };
});