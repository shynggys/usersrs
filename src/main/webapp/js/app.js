App = Ember.Application.create({});

// add route
App.Router.map(function() {
	this.resource('addUser', function() {
		this.resource('addUserForm');
	});

	this.resource('removeUser');
	this.resource('displayAllUsers');
	this.resource('retrieve');

});

// when we visit displayAllUsers we assosiate which models we want to use
App.DisplayAllUsersRoute = Ember.Route.extend({
	model : function() {
		// return all the User models
		return App.User.find();
	}
});

App.Store = DS.Store.extend({
	revision : 12,
	adapter : DS.RESTAdapter.extend({
		url : 'http://localhost:8080/jboss-as-users-rs/rest'
	})

});

// User Model
App.User = DS.Model.extend({

	userId : DS.attr('number'),
	fname : DS.attr('string'),
	lname : DS.attr('string')
});

App.AddUserController = Ember.ObjectController.extend({
	isEditing : false,

	edit : function() {
		this.set('isEditing', true);
	},
	done : function() {
		this.set('isEditing', false);

		var fname = this.get("fname");
		var lname = this.get("lname");
		var userId = this.get("userId");

		$.post('http://localhost:8080/jboss-as-users-rs/rest/users', {
			"id" : userId,
			"fname" : fname,
			"lname" : lname
		});

		// this.get('store').commit();

	}

});

App.TextField = Em.TextField.extend(Ember.TargetActionSupport, {
	insertNewline : function() {
		this.triggerAction();
	}
});

App.RemoveUserController = Ember.Controller.extend({
	removeUser : function() {

		var id = this.get("usern");
		var urlString = "http://localhost:8080/jboss-as-users-rs/rest/users/"
				+ id;

		var jsonObj = null;
		$.getJSON(urlString, function(data) {
			jsonObj = data;
		});

		$.ajax({
			url : urlString,
			type : 'DELETE',
			success : function(result) {
				window.alert("User removed: " + jsonObj.fname + " "
						+ jsonObj.lname);
			}
		});

	}

});

App.RetrieveController = Ember.Controller.extend({
	getUser : function() {

		var id = this.get("usern");
		var urlString = "http://localhost:8080/jboss-as-users-rs/rest/users/"
				+ id;

		var jsonObj = null;
		$.getJSON(urlString, function(data) {
			jsonObj = data;
			window.alert("User is: " + jsonObj.fname + " " + jsonObj.lname);
		});

	}

});

App.AddUserController = Ember.Controller.extend({
	addNewUser : function() {

		$.post('http://localhost:8080/jboss-as-users-rs/rest/users', {
			"id" : this.get("userId"),
			"fname" : this.get("fname"),
			"lname" : this.get("lname")
		});

		window.alert("New user " + this.get("fname") + " is added");

	}
});
