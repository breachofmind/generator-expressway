var Model = require('expressway').Model;

const LABELS = {
    title: "Title",
    file_name: "File name",
    file_type: "File Type",
    alt_text: "Alt Text",
    caption: "Caption",
    etag: "Etag"
};

class Media extends Model
{
    constructor(app,media)
    {
        super(app);

        this.title    = 'title';
        this.expose   = true;
        this.singular = "Media";
        this.plural   = "Media";
        this.managed  = "author";
        this.icon     = "image.photo_library";

        // Attach the media thumbnail as the preview field.
        this.on('toJSON', function(json,model,object) {
            json.$preview = media.url(object.file_name, 'thumb', model.noImage);
        });
    }

    schema(fields, types)
    {
        fields
            .timestamps()
            .add('title',     types.Title)
            .add('author',    types.User, {required:false})
            .add('file_name', types.Text, 'required', 'display', 'fillable')
            .add('file_type', types.Text, 'required', 'display', 'fillable')
            .add('alt_text',  types.Text, 'fillable')
            .add('caption',   types.Text, 'fillable')
            .add('etag',      types.Text)
            .labels(LABELS)
    }
}

module.exports = Media;