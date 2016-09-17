$('document').ready(function(){
    $.getJSON('javascripts/kitchenSink.json', function( json ){
        $('#main_content .json').append(
            renderjson.set_icons('+', '-').set_show_to_level(2)( json )
        );
    });
});