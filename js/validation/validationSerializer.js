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
    var table = new superGrid({tag:'div',clazz:'validation'});

    validation.roles.sort(function(r1, r2) {
        return validation.rolesOrder[r1.name] - validation.rolesOrder[r2.name];
    });
    $.each(validation.roles, function(rIndex, role) {
        var roleGrid = new grid({tag:'div',clazz:'validation_role'});
        roleGrid.order = rIndex;

        var lineIndex = 1;
        var headerElement = new gridElement({tag:'div',clazz:'role_header'}, lineIndex);
        var headerElementLabel = new gridElementItem({tag:'span',clazz:'role_label'}, 1, role.label);
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
            var participantElement = new gridElement({tag:'div',clazz:'validation_participant'}, lineIndex++);

            if(participant.trainee) {
                var participantElementTrainee = new gridElementItem({tag:'span',clazz:'participant_trainee'}, 1, null);
                participantElement.addItem(participantElementTrainee);
            }

            var participantElementName = new gridElementItem({tag:'span',clazz:'participant_name'}, 2, participant.longName);
            participantElement.addItem(participantElementName);

            var participantElementTeam = new gridElementItem({tag:'span',clazz:'participant_team'}, 3, participant.teams[0].name);
            participantElement.addItem(participantElementTeam);

            if(!participant.author) {
                var participantElementDelete = new gridElementItem({tag: 'span', clazz: 'participant_delete'}, 4, null);
                participantElement.addItem(participantElementDelete);
            }

            roleGrid.addElement(participantElement);
        });
        table.addGrid(roleGrid);
    });
    return table.generate();
};