UserAutoCompleteComponent = {
    users: [
        {value:'virginie.danon', uid:'virginie.danon', firstName:'Virginie', lastName:'DANON', teams:[{name:'team1',deprecated:false}], trainee:false, roleName:'SALES', roleLabel:'Sales'},
        {value:'marie.clavier', uid:'marie.clavier', firstName:'Marie', lastName:'CLAVIER', teams:[{name:'team1',deprecated:false}], trainee:false, roleName:'SALES', roleLabel:'Sales'},
        {value:'thomas.roux', uid:'thomas.roux', firstName:'Thomas', lastName:'ROUX', teams:[{name:'team2',deprecated:false}], trainee:false, roleName:'PRICER', roleLabel:'Pricer'},
        {value:'pauline.granier', uid:'pauline.granier', firstName:'Pauline', lastName:'GRANIER', teams:[{name:'team1',deprecated:false},{name:'team3',deprecated:false}], trainee:false, roleName:'SALES', roleLabel:'Sales'},
        {value:'pauline.granier', uid:'pauline.granier', firstName:'Pauline', lastName:'GRANIER', teams:[{name:'team3',deprecated:false}], trainee:true, roleName:'EMI', roleLabel:'Emission'}
    ]
};

UserAutoCompleteComponent.init = function(autoCompleteContainer) {
    autoCompleteContainer.autocomplete({
        delay: 0,
        minLength: 2,
        source: UserAutoCompleteComponent.users,
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