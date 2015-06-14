ValidationComponent = {
    table: null,
    addUserContainer: '#add_user',
    messagesContainer: '#messages_container',
    warningsContainer: '#warnings_container',
    errorsContainer: '#errors_container',
    validationContainer: '#validation_container'
};

ValidationComponent.init = function(json) {
    ValidationComponent.table = new validation();
    ValidationComponent.initAutoComplete();
};


ValidationComponent.refreshTable = function() {
    ValidationComponent.displayWarnings();

    var table = ValidationSerializer.toGrid(ValidationComponent.table);
    $(ValidationComponent.validationContainer).html(table);
};

ValidationComponent.displayWarnings = function() {
    $.each(ValidationComponent.table.warnings, function(index, warning) {
        $(ValidationComponent.warningsContainer).append('<p>'+warning+'</p>');
    });
};


ValidationComponent.initAutoComplete = function() {
    UserAutoCompleteComponent.init($(ValidationComponent.addUserContainer));
    ValidationComponent.onUserSelect(UserAutoCompleteComponent);
    ValidationComponent.renderUser(UserAutoCompleteComponent);
};

ValidationComponent.onUserSelect = function(userAutoCompleteComponent) {
    userAutoCompleteComponent.onSelectCallback = function(user) {
        var role = new validationRole(user.roleName, user.roleLabel);
        var participant = new validationParticipant(user.uid, user.firstName, user.lastName, user.trainee);
        ValidationComponent.table.addParticipant(role, participant);

        ValidationComponent.refreshTable();

        $(ValidationComponent.addUserContainer).val('');
    };
};
ValidationComponent.renderUser = function(userAutoCompleteComponent) {
    userAutoCompleteComponent.render = function(user) {
        var line = $('<li class="autocomplete_validation"></li>');
        line.data('item.autocomplete', user);

        var label = $('<a></a>');
        label.append('<span class="autocomplete_participant_name">' + user.firstName + ' ' + user.lastName + '</span>');
        label.append('<span class="autocomplete_participant_role">&nbsp;[' + user.roleLabel + ']</span>');
        line.append(label);

        return line;
    };
};