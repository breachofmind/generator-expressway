"use strict";

var Component = require('grenade').Component;

class FlashMessage extends Component
{
    constructor(tag)
    {
        super(tag);

        this.view = 'components/flash';
    }

    /**
     * Render the message only if there is one.
     * @param data
     * @returns {string}
     */
    render(data)
    {
        this.data.message = this.params;
        return this.data.message ? super.render(data) : "";
    }
}

module.exports = FlashMessage;