ValidationSerializer = {};

ValidationSerializer.serialize = function(validation) {
    return JSON.stringify(validation);
};

ValidationSerializer.unserialize = function(json) {
    var table = new validation();

    var object = JSON.parse(json);
    table.mandatoryRoles = object.mandatoryRoles;
    for (var i = 0; i < object.roles.length; i++) {
        var dataRole = object.roles[i];
        var role = new validationRole(dataRole.name, dataRole.label, dataRole.status);

        for (var j = 0; j < dataRole.participants.length; j++) {
            var dataParticipant = dataRole.participants[j];
            var participant = new validationParticipant(dataParticipant.uid, dataParticipant.firstName, dataParticipant.lastName, dataParticipant.trainee);
            participant.author = dataParticipant.author;
            participant.status = dataParticipant.status;

            for (var k = 0; k < participant.teams.length; k++) {
                var dataTeam = participant.teams[k];
                var team = new participantTeam(dataTeam.name, dataTeam.deprecated);
                team.selected = dataTeam.selected;

                participant.addTeam(team);
            }
            role.addParticipant(participant);
        }
        table.addRole(role);
    }
    return table;
};

ValidationSerializer.toGrid = function(validation) {
    var table = new superGrid({name:'div',clazz:'validation'});

    validation.roles.sort(function(r1, r2) {
        return validation.rolesOrder[r1.name] - validation.rolesOrder[r2.name];
    });
    $.each(validation.roles, function(rIndex, role) {
        var roleGrid = new grid({name:'div',clazz:'validation_role'});
        roleGrid.order = rIndex;

        var lineIndex = 1;
        var headerElement = new gridElement({name:'div',clazz:'role_header'}, lineIndex);
        var headerElementLabel = new gridElementItem({name:'span',clazz:'role_label'}, 1, role.label);
        headerElement.addItem(headerElementLabel);
        roleGrid.addElement(headerElement);

        role.participants.sort(function(p1, p2) {
            if(p1.lastName < p2.lastName) {
                return -1;
            } else if(p1.lastName > p2.lastName) {
                return 1;
            }
            return 0;
        });
        $.each(role.participants, function(pIndex, participant) {
            var participantElement = new gridElement({name:'div',clazz:'validation_participant'}, lineIndex++);
            var participantElementName = new gridElementItem({name:'span',clazz:'participant_name'}, 1, participant.longName);
            participantElement.addItem(participantElementName);

            roleGrid.addElement(participantElement);
        });
        table.addGrid(roleGrid);
    });
    return table.generate();
};