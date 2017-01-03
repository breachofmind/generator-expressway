var Model = require('expressway').Model;

class Media extends Model
{
    constructor(app)
    {
        super(app);

        this.title      = 'title';
        this.expose     = true;
        this.guarded    = [];
        this.appends    = [];
        this.populate   = [];
    }

    schema(object)
    {
        return {
            title:       { type: String, required: true },
            file_name:   { type: String, required: true },
            file_type:   { type: String, required: true },
            alt_text:    { type: String },
            caption:     { type: String },
            etag:        { type: String },
            created_at:  { type: Date, default: Date.now },
            modified_at: { type: Date, default: Date.now }
        };
    }

    methods(object)
    {
        return super.methods(object);
    }
}

module.exports = Media;