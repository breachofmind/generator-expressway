"use strict";

var _ = require('lodash');
var expressway = require('expressway');

module.exports = expressway.Model.create('User', function Blueprint(app)
{
    var ObjectId = expressway.Model.types.ObjectId;

    this.title      = 'email';
    this.expose     = false;
    this.guarded    = ['password'];
    this.appends    = ['name'];
    this.populate   = ['roles'];
    this.managed    = true;
    this.labels     = {
        email: "Username",
        first_name: "First Name",
        last_name: "Last Name",
        name: "Name",
        created_at: "Created Date"
    };

    this.schema = {
        email:          { type: String, required: true, unique: true },
        password:       { type: String, required: true },
        first_name:     { type: String },
        last_name:      { type: String },
        roles:          [{ type: ObjectId, ref:"Role" }],
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
         * Check if a user has a certain permission key.
         * @param key string
         * @returns {boolean}
         */
        hasPermission: function(key)
        {
            return this.permissions().indexOf(key) > -1;
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
         * @param args mixed, optional
         * @returns {boolean}
         */
        can: function(object,action, args)
        {
            if (! app.gate) return true;

            return app.gate.check(this,object,action,args);
        },

        /**
         * Alias of can()
         * @param object string
         * @param action string
         * @param args mixed, optional
         * @returns {boolean}
         */
        cannot: function(object,action,args)
        {
            return ! this.can(object,action,args);
        }
    };
});