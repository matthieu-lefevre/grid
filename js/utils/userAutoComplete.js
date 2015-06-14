UserAutoCompleteComponent = {};

UserAutoCompleteComponent.init = function(autoCompleteContainer) {
    var xhr;
    autoCompleteContainer.autocomplete({
        delay: 0,
        minLength: 2,
        source: function( request, response ) {
            var regex = new RegExp(request.term, 'i');
            if(xhr){
                xhr.abort();
            }
            xhr = $.ajax({
                url: "/grid/data/user.json",
                dataType: "json",
                cache: false,
                success: function(data) {
                    response($.map(data.users, function(item) {
                        if(regex.test(item.uid)){
                            return item;
                        }
                    }));
                }
            });
        },
        select: function(e, ui) {
            UserAutoCompleteComponent.onSelectCallback(ui.item);
            return false;
        }
    }).data( "autocomplete" )._renderItem = function( ul, item ) {
        return UserAutoCompleteComponent.render(item).appendTo(ul);
    };
};

UserAutoCompleteComponent.onSelectCallback = function(user) {
    throw new Error('On select callback not implemented');
};

UserAutoCompleteComponent.render = function() {
    throw new Error('User autocomplete rendering not implemented');
};