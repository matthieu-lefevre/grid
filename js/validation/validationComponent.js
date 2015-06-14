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
    ValidationComponent.table.mandatoryRoles = ['SALES'];
    ValidationComponent.initAutoComplete();
    ValidationComponent.refreshTable();
};

ValidationComponent.refreshTable = function() {
    ValidationComponent.displayWarnings();

    ValidationComponent.table.resetMessages();
    ValidationComponent.table.initMessages();
    ValidationComponent.displayMessages();

    ValidationComponent.table.resetErrors();
    ValidationComponent.table.validate();
    ValidationComponent.displayErrors();

    var table = ValidationSerializer.toGrid(ValidationComponent.table);
    $(ValidationComponent.validationContainer).html(table);
};


ValidationComponent.displayMessages = function() {
    $(ValidationComponent.messagesContainer).empty();
    $.each(ValidationComponent.table.messages, function(index, message) {
        $(ValidationComponent.messagesContainer).append('<p>'+message+'</p>');
    });
};

ValidationComponent.displayWarnings = function() {
    $.each(ValidationComponent.table.warnings, function(index, warning) {
        $(ValidationComponent.warningsContainer).append('<p>'+warning+'</p>');
    });
};

ValidationComponent.displayErrors = function() {
    $(ValidationComponent.errorsContainer).empty();
    $.each(ValidationComponent.table.errors, function(index, error) {
        $(ValidationComponent.errorsContainer).append('<p>'+error+'</p>');
    });
};


/**
 * VALIDATION PARTICIPANT TEAMS
 */

ValidationComponent.initParticipantTeams = function(participant, userTeams) {
    var activeTeams = [];
    var deprecatedTeams = [];
    $.each(userTeams, function(index, userTeam) {
        if(userTeam.deprecated) {
            deprecatedTeams.push(userTeam);
        } else {
            activeTeams.push(userTeam);
        }
    });

    if(activeTeams.length === 1) {
        var team = new participantTeam(activeTeams[0].name, false);
        team.selected = true;
        participant.addTeam(team);
    } else {
        $.each(activeTeams, function(index, activeTeam) {
            var team = new participantTeam(activeTeam.name, false);
            participant.addTeam(team);
        });
    }
    if(activeTeams.length === 0 && deprecatedTeams.length === 1) {
        var team = new participantTeam(deprecatedTeams[0].name, true);
        team.selected = true;
        participant.addTeam(team);
    } else if(activeTeams.length > 0 && deprecatedTeams.length >= 1) {
        $.each(deprecatedTeams, function(index, deprecatedTeam) {
            var team = new participantTeam(deprecatedTeam.name, true);
            participant.addTeam(team);
        });
    }
};


/**
 * VALIDATION USER AUTOCOMPLETE
 */

ValidationComponent.initAutoComplete = function() {
    UserAutoCompleteComponent.init($(ValidationComponent.addUserContainer));
    ValidationComponent.onUserSelect(UserAutoCompleteComponent);
    ValidationComponent.renderUser(UserAutoCompleteComponent);
};

ValidationComponent.onUserSelect = function(userAutoCompleteComponent) {
    userAutoCompleteComponent.onSelectCallback = function(user) {
        var role = new validationRole(user.roleName, user.roleLabel);
        var participant = new validationParticipant(user.uid, user.firstName, user.lastName, user.trainee);
        ValidationComponent.initParticipantTeams(participant, user.teams);
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