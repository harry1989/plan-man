/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var taskDiary;
var app = {
    // Application Constructor
    initialize: function(page) {
    	console.log("Initializing...");
        this.bindEvents();
        app.page = page;
        console.log(page);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        // Stepping up SMS receiver
        var smsInboxPlugin = cordova.require('cordova/plugin/smsinboxplugin');
        smsInboxPlugin.startReception (function(msg) {
            taskDiary.processSMS(msg);
          }, function(err) {
            alert("Error while receiving messages: " + err);
          });
        
        // Missed call alerts
        var missedCallPlugin = cordova.require('cordova/plugin/missedcallplugin');
        missedCallPlugin.startReception (function(msg) {
        	taskDiary.processMissedCall(msg);
          }, function(err) {
            alert("Error while receiving calls: " + err);
          });
        
        // Send SMS
        $('#btnSend').on("click", function() {
        	var smsSendingPlugin = cordova.require('cordova/plugin/smssendingplugin');
            
            smsSendingPlugin.send ("09490484193", "Hello World !", function() {
                alert("Message sent :-)");
              }, function() {
                alert("Message not sent :s");
              });
        });
        
        //Add task
        $('#addTask').on("click", function() {
        	taskDiary.saveTask({name:"Task1",desc:"Test Task",dueDate:new Date(),contacts:[100, 102],taskStatus:'Assigned'}, function() {
    			alert("Task added!!");
    		});
        });

        //Read tasks
        $('#getTasks').on("click", function() {
        	taskDiary.getTasks(function(data) {
        		console.log(data);
    			alert("Number of tasks retrieved = " + data.length);
    		});
        	taskDiary.getTasks(function(data) {
        		console.log(data);
    			alert("Task 1 = " + data);
    		}, 1);
        });

    	//create a new instance of our TaskDiary and listen for it to complete it's setup
    	taskDiary = new TaskDiary();
    	taskDiary.setup(function() {});
    	
        var contacts = window.localStorage.getItem("contacts");
        if (contacts == null) {
        	app.buildContactList([], "Arun");
        } else {
        	app.renderContacts(JSON.parse(contacts));
        }
    },
    buildContactList: function(allContacts, name) {
    	if (name == "Arun")
    		window.localStorage.clear();
    	
    	var promise = 0;
    	
    	var fields = ["*"];
    	var options = new ContactFindOptions();
        options.filter = name; 
        options.multiple = true;
        navigator.contacts.find(fields, function(contacts){
        	for (var i = 0; i < contacts.length; i++) {
        		allContacts.push(contacts[i]);
        	}
        	if (name == "Arun")
    			app.buildContactList(allContacts, "Varun");
    		else if (name == "Varun")
    			app.buildContactList(allContacts, "Raghu");
    		else if (name == "Raghu")
    			app.buildContactList(allContacts, "Amit");
    		else if (name == "Amit") {
    			window.localStorage.setItem("contacts", JSON.stringify(allContacts));
    	        app.renderContacts(allContacts);
    		}
    			
        }, function(err) {
        	//$('#contactsList').html("Error has occurred while fetching the contacts...");
        	if (name == "Arun")
    			app.buildContactList(allContacts, "Raghu");
    		else if (name == "Raghu")
    			app.buildContactList(allContacts, "Amit");
    		else if (name == "Amit") {
    			window.localStorage.setItem("contacts", JSON.stringify(allContacts));
    	        app.renderContacts(allContacts);
    		}
        }, options);

        
    },
    renderContacts: function(contacts) {
    	$('#contactsList').html("Updating the contacts list...");
    	var contactsStr = "";
    	for (var i = 0; i < contacts.length; i++) {
    		
    		try {
    			var displayName = contacts[i].displayName || contacts[i].name.formatted || contacts[i].emails[0].value;
	    		var contactName = "<li><a href='#'>" + (contacts[i].displayName || contacts[i].name.formatted || contacts[i].emails[0].value) + "</a></li>";
	    		contactsStr += contactName;
    		} catch (e) {
    			// do nothing\
    		}
    	}
    	
    	try {
    		$('#contactsList').html(contactsStr).listview('refresh');
    	} catch(e) {
    		$('#contactsList').html(contactsStr);
    	}
    	
    	try {
    		$('#contactsList0').html(contactsStr).listview('refresh');
    	} catch(e) {
    		$('#contactsList0').html(contactsStr);
    	}
    	
    	try {
    		$('#contactsList1').html(contactsStr).listview('refresh');
    	} catch(e) {
    		$('#contactsList1').html(contactsStr);
    	}
    	
    	try {
    		$('#contactsList2').html(contactsStr).listview('refresh');
    	} catch(e) {
    		$('#contactsList2').html(contactsStr);
    	}
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};
