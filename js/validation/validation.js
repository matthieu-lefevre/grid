function validation() {
	this.mandatoryRoles = [];
	this.roles = [];

	this.valid = false;

	this.messages = [];
	this.errors = [];
	this.warnings = [];

	this.rolesOrder = {
		'SALES': 1,
		'PRICER': 2,
		'EMI': 3,
		'STRUCTURER': 4,
		'JUR': 5,
		'OTHER': 6
	};

	this.initMessages = function() {
		// PRICER not mandatory message
		if(!inArray(this.mandatoryRoles, 'PRICER')) {
			this.messages.push('Pricer is NOT mandatory');
		}
	};

	/*
	 * ROLES MANAGEMENT
	 */
	this.hasRole = function(name) {
		for(var i = 0; i < this.roles.length; i++) {
			if(this.roles[i].name === name) {
				return true;
			}
		}
		return false;
	};
	this.addRole = function(role) {
		if(this.hasRole(role.name)) {
			this.warnings.push(role.label + ' already exists in validation table');
			return;
		}
		this.roles.push(role);
	};
	this.removeRole = function(name) {
		for(var i = 0; i < this.roles.length; i++) {
			if(this.roles[i].name === name) {
				this.roles.splice(i,1);
				break;
			}
		}
	};

	/*
	 * PARTICIPANTS MANAGEMENT
	 */
	this.getParticipants = function() {
		var participants = [];
		for(var i = 0; i < this.roles.length; i++) {
			var role = this.roles[i];
			for(var j = 0; j < role.participants.length; j++) {
				participants.push(role.participants[j]);
			}
		}
		return participants;
	};
	this.hasParticipant = function(uid) {
		var participant = this.getParticipant(uid);
		if(participant !== null) {
			return true;
		}
		return false;
	};
	this.getParticipant = function(uid) {
		for(var i = 0; i < this.roles.length; i++) {
			var role = this.roles[i];
			for(var j = 0; j < role.participants.length; j++) {
				if(role.participants[j].uid === uid) {
					return role.participants[j];
				}
			}
		}
		return null;
	};
	this.addParticipant = function(role, participant) {
		if(this.hasParticipant(participant.uid)) {
			this.warnings.push(participant.longName + ' already belongs to validation table');
			return;
		}

		if(!this.hasRole(role.name)) {
			this.addRole(role);
		}

		for(var i = 0; i < this.roles.length; i++) {
			if(this.roles[i].name === role.name) {
				this.roles[i].addParticipant(participant);
				break;
			}
		}
	};
	this.removeParticipant = function(uid) {
		var participant = this.getParticipant(uid);
		if(participant === null) {
			this.warnings.push(uid + ' does not belong to validation table and cannot be remove');
		}
		if(participant.author) {
			this.warnings.push('Author cannot be removed from validation table');
		}

		for(var i = 0; i < this.roles.length; i++) {
			var role = this.roles[i];
			if(role.removeParticipant(uid)) {
				if(role.participants.length === 0) {
					this.removeRole(role.name);
				}
				break;
			}
		}
	};
	this.selectParticipantTeam = function(participantUid, teamName) {
		var participant = this.getParticipant(participantUid);
		if(participant === null) {
			this.warnings.push('Cannot select team ' + teamName + ' for participant ' + participantUid);
		}

		for(var i = 0; i < participant.teams.length; i++) {
			var team = participant.teams[i];
			team.selected = false;
			if(team.name === teamName) {
				team.selected = true;
				if(team.deprecated) {
					this.warnings.push(teamName + ' selected for participant ' + participant.longName + ' is deprecated');
				}
			}
		}
	};

	/*
	 * VALIDATION
	 */
	this.validate = function() {
		// mandatory roles check
		for(var i = 0; i < this.mandatoryRoles.length; i++) {
			if(!this.hasRole(this.mandatoryRoles[i])) {
				this.errors.push(this.mandatoryRoles[i] + ' is mandatory');
			}
		}

		// participants check
		for(var i = 0; i < this.roles.length; i++) {
			var role = this.roles[i];
			var roleTraineesNb = 0;
			for(var j = 0; j < role.participants.length; j++) {
				var participant = role.participants[j];
				if(participant.trainee) {
					roleTraineesNb++;
				}
				if(!participant.hasTeamSelected()) {
					this.errors.push(participant.longName + ' has no team');
				}
			}
			if(role.participants.length === roleTraineesNb) {
				this.errors.push(role.label + ' role contains only trainees');
			}
		}
		this.valid = (this.errors.length === 0);
	};

	/*
	 * RESET METHODS
	 */
	this.resetMessages = function() {
		this.messages = [];
	};
	this.resetErrors = function() {
		this.errors = [];
	};
	this.resetWarnings = function() {
		this.warnings = [];
	};
};

function validationRole(name, label) {
	this.name= name;
	this.label = label;
	this.status = null;
	this.participants = [];

	/*
	 * PARTICIPANTS MANAGEMENT
	 */
	this.addParticipant = function(participant) {
		this.participants.push(participant);
	};
	this.removeParticipant = function(uid) {
		for(var i = 0; i < this.participants.length; i++) {
			if(this.participants[i] === uid) {
				this.participants.splice(i,1);
				return true;
			}
		}
		return false;
	};
};

function validationParticipant(uid, firstName, lastName, trainee) {
	this.uid = uid;
	this.firstName = firstName;
	this.lastName = lastName;
	this.longName = firstName + ' ' + lastName;
	this.status = null;
	this.trainee = trainee;
	this.author = false;
	this.teams = [];

	/*
	 * TEAMS MANAGEMENT
	 */
	this.hasTeam = function(name) {
		for(var i = 0; i < this.teams.length; i++) {
			if(this.teams[i].name === name) {
				return true;
			}
		}
		return false;
	};
	this.addTeam = function(team) {
		if(this.hasTeam(team.name)) {
			return;
		}
		this.teams.push(team);
	};
	this.hasTeamSelected = function() {
		for(var i = 0; i < this.teams.length; i++) {
			if(this.teams[i].selected) {
				return true;
			}
		}
	};
};

function participantTeam(name, deprecated) {
	this.name = name;
	this.deprecated = deprecated;
	this.selected = false;
};

/**
 * UTILS
 */
function inArray(array, searchedValue) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] === searchedValue) {
			return true;
		}
	}
	return false;
};
