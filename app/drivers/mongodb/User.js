"use strict";

var _ = require('lodash');
var Expressway = require('expressway');
var app = Expressway.instance.app;
var encrypt = app.get('encrypt');
var gate = app.get('gate');

class User extends Expressway.Model
{
    constructor(app,config)
    {
        super(app);

        // This is commonly used, so let's store it as a service.
        app.register('User', this, "The User model");

        var ObjectId = this.Types.ObjectId;

        var allowed_failures = config('allowed_login_failures', 0);

        this.title      = 'email';
        this.expose     = false;
        this.guarded    = ['password'];
        this.appends    = ['name'];
        this.populate   = ['roles'];
        this.managed    = true;

        this.schema = {
            email:          { type: String, required: true, unique: true },
            password:       { type: String, required: true },
            first_name:     { type: String },
            last_name:      { type: String },
            reset_token:    { type: String, default: "" },
            failures:       { type: Number, default: 0 },
            roles:          [{ type: ObjectId, ref:"Role" }],
            created_at:     { type: Date, default: Date.now },
            modified_at:    { type: Date, default: Date.now }
        };

        this.methods = {

            /**
             * Checks the hashed password and salt.
             * @param password string
             * @returns {boolean}
             */
            isValid: function(password)
            {
                if (! password) return false;

                return this.password === encrypt(password,this.created_at.getTime().toString());
            },

            /**
             * Authenticate a user who is logging in.
             * @param password string
             * @throws string
             * @returns {boolean}
             */
            authenicate: function(password)
            {
                if (this.reset_token !== "") throw("pending_reset");
                if (allowed_failures && this.failures > allowed_failures) throw("too_many_failures");
                if (! password) throw("no_password");

                var valid = this.isValid(password);

                // Increment the failure count.
                if (valid === false) {
                    this.failures ++;
                    this.save();
                    throw ("bad_password");
                }
                // Reset the failure count.
                if (this.failures > 0) {
                    this.failures = 0;
                    this.save();
                }

                return valid;
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
                if (! gate) return true;

                return gate.check(this,object,action,args);
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
    }

    /**
     * Before a model is saved, encrypt the password string.
     * @returns void
     */
    onBoot(schema)
    {
        schema.pre('save', function Model(next)
        {
            this.password = encrypt(this.password, this.created_at.getTime().toString());
            next();
        });
    }
}

module.exports = User;