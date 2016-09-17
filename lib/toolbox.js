module.exports = {

    /**
     * Convert <br> or <br/> to \n
     * @param str
     * @returns {*}
     */
    br2nl: function( str ){
        return str.replace(/<br\s*[\/]?>/gi, "\n");
    },

    /**
     * Strips the html tags out of a given string
     * @param str
     * @returns {*|string|void|XML}
     */
    striptags: function( str ){
        return str.replace(/<(?:.|\n)*?>/gm, '');
    }
};