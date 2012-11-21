/**
	Use native browser JSON support by means of:
	
	var json_text = JSON.stringify(your_object);
	var your_object = JSON.parse(json_text);

*/
var serempre = new function(){
	this.cargos = new function(){
		//this is 'work queue'... all objects in this collection are primary keys for objects to be processed
		this.pendingCargos = [];
		//collection of leaf nodes
		this.destinations = [];
		//an object that acts as if it were a hash table to keep track of visited objects
		this.futurePaths = {};
		//a copy of the traversed graph that can be used in between pages throughout this site
		this.toStringify = "";
		
		//use scrap data from futurePaths to calculate all possible routes
		this.rebuildPaths = function(){
			//this will have a pointer for each node visited in the graph
			var keys = [];
			//collect pointers for all visited objects
			for(var key in this.futurePaths){
				keys[keys.length] = key;
			}
			//console.log(keys);
			//for each visited object, build a js statement to get a handle on it's data
			for(var i = 0; i < keys.length; i++){
				//plain text js statement that points to a graph object
				var node = "this.futurePaths['" + keys[i] + "']";
				//console.log(keys[i]);
				//console.log(node);
				//console.log(eval(node));
				//evaluate js statement to grab the object
				node = eval(node);
				//console.log(node.fields.siguientes);
				//for every node referenced by the current object
				for(var j = 0; j < node.fields.siguientes.length; j++){
					//console.log('-->'+ node.fields.siguientes[j]);
					//plain text js statement that points to the reference target
					var reference = "this.futurePaths['" + node.fields.siguientes[j] + "']";
					//evaluate js statement to grab the reference target
					reference = eval(reference);
					//replace target key with actual object reference
					node.fields.siguientes[j] = reference;
					//console.log(reference);
				}
			}
		}
		
		//try to empty  the pendingCargos collection by processing each of it's contents
		this.calculateRouteEndpoints_inspectChildrenFor = function(serviceURL, callback){
			//console.log('pending: ' + pendingCargos.length);
			//if there are no more items left to process, then stop
			if(this.pendingCargos.length <= 0)
				return;
			//dequeue a node and prevent it from being re-visited
			var node = this.pendingCargos[0];
			//dont re-visit a node... purge redundant items in the work queue
			while(this.futurePaths[ node ] && this.pendingCargos.length > 0){
				//console.log('already visited: ' + futurePaths[ node ]);
				this.pendingCargos = this.pendingCargos.slice(1, this.pendingCargos.length);
				//console.log('still have to check for: ' + this.pendingCargos.length + ' more node(s)');
				node = this.pendingCargos[0];
				//console.log('skipping to: ' + node);
			}
			//if the work queue is empty, then all nodes are done processing
			if(!node || node == null || node == undefined){
				//save acquired data
				sessionStorage.futurePaths = '{' + this.toStringify.slice(1,this.toStringify.length) + '}';
				sessionStorage.destinations = JSON.stringify(this.destinations);
				//use server-side data to rebuild the graph
				this.rebuildPaths();
				//trigger callback
				if(callback){
					callback();
				}
				//dismiss wait dialog
				this.toggleWaitDialog();
			}
			//abort work in progress current node has already been visited
			if(!node || this.futurePaths[ node ])
				return;
			//mark node being processed as visited
			this.futurePaths[ node ] = node;
			//print this for debugging
			//console.log('processing: ' + node);
			//request data for the node being processed
			$.ajax({
				url: serviceURL.slice(0,-2) + node + "/"
				, dataType: "json"
				, success: function(data, textStatus, jqXHR){
					//if the server-side data points to any other graph nodes, then schedule them for future processing
					if(data[0] && data[0].fields && data[0].fields.siguientes){
						//for each referenced node in the server-side data
						for(var i = 0; i < data[0].fields.siguientes.length; i++){
							//if the referenced node has yet to be processed, queue it for future processing
							if( !serempre.cargos.futurePaths[ data[0].fields.siguientes[i] ] ){
								//add pending node to the work queue
								serempre.cargos.pendingCargos[serempre.cargos.pendingCargos.length] = data[0].fields.siguientes[i];
							}
						}
					} 
					//if server-side data doesn't point to any other nodes
					if( data[0].fields.siguientes.length <= 0 ) {
						//this is a leaf. Save it for later use
						serempre.cargos.destinations[ serempre.cargos.destinations.length ] = node;
					}
					//save data about this node. This is the raw server-side data and will be used to rebuild the graph once all
					//nodes are done processing
					serempre.cargos.futurePaths[ node ] = data[0];
					serempre.cargos.toStringify += ',"' + node + '":' + JSON.stringify(data[0]);
					//re-start work on pending items, if any
					if(serempre.cargos.pendingCargos.length>0){
						serempre.cargos.calculateRouteEndpoints_inspectChildrenFor(serviceURL, callback);
					}
				}
				, error: function(jqXHR, textStatus, errorThrown){
					alert(textStatus);
				}
				, complete: function(jqXHR, textStatus){
					
				}
			});
		}
		
		//calculate available career routes from a given starting point
		//offSet: stands for a server-side primary key
		this.calculateRouteEndpoints = function(offSet, serviceURL, callback, wait_message, wait_icon){
			//clear work queue
			this.pendingCargos = [];
			//clear previous results, if any
			this.destinations = [];
			this.futurePaths = {};
			this.toStringify = "";
			//queue a graph node for processing
			this.pendingCargos[this.pendingCargos.length] = offSet;
			//trigger graph walking algorithm
			this.calculateRouteEndpoints_inspectChildrenFor(serviceURL, callback);
			//show please wait dialog
			this.toggleWaitDialog(wait_message ? wait_message : 'Estamos buscando planes de carrera a partir del cargo que ocupas', wait_icon ? wait_icon : 'icon-filter');
		}
		
		//load all available cargos
		this.loadOffsetCargos = function(serviceURL, jq_selector_for_destination_select,wait_message,wait_icon){
			//show please wait dialog
			this.toggleWaitDialog(wait_message ? wait_message : 'Estamos cargando los cargos que puedes ocupar en la organización', wait_icon ? wait_icon : 'icon-signal');
			$.ajax({
				url: serviceURL
				, dataType: "json"
				, data: {
					//don't send any data to the service
				}, success: function(data, textStatus, jqXHR){
					serempre.cargos.populateDropdownOptions(data, jq_selector_for_destination_select);
				}, complete: function(jqHXR, textStatus){
					//done requesting data
					serempre.cargos.toggleWaitDialog();
				}, error: function(jqXHR, textStatus, errorThrown){
					alert(textStatus);
				}
			});
		}
		
		//prepare wait dialog
		this.setupWaitDialog = function(){
			$(document.body).append("<div id='dialog-wait' title='Por favor espera...'><div class='control-group warning'><p style='margin-top: 5px;'><i class='icon-road' style='margin: 3px 7px 0px 7px; float: left;'></i><span id='msg-content'>Estamos calculando tus planes de carrera</span><p></div></div>");
			$( "#dialog-wait" ).dialog({
				resizable: false,
				height:140,
				modal: true,
				autoOpen: false,
				closeOnEscape: false,
				show: 'explode',
				hide: 'explode',
			});
		}
		
		//hides or shows the please wait dialog
		//text: text you want displayed by the wait dialog
		//icon: bootstrap glyphicon style for the dialog image
		this.toggleWaitDialog = function(text, icon){
			//find out if dialog is opened up
			if($("#dialog-wait").dialog( "isOpen" )){
				//if dialog is opened up, then close it
				$("#dialog-wait").dialog( "close" );
			}else {
				if(text){
					$('#dialog-wait #msg-content').text(text);
				}
				if(icon){
					var iconImage = $('#dialog-wait i');
					var currentStyle = iconImage.attr('class');
					iconImage.removeClass(currentStyle).addClass(icon);
				}
				//display dialog
				$("#dialog-wait").dialog( "open" );
				//hide the close dialog handle
				var closeLink = $('a.ui-dialog-titlebar-close', $('#dialog-wait').prev()).remove();
				if(closeLink.length>0)
					$('#dialog-wait').prev().prepend($("<span class='background_jobs_pending'></span>"));
			}
		}
		
		//iterates trough whatever contents are in the array or object represented by 'data'
		//data: info to be used when populating a drop down list
		//jqSelectorForDropown: jquery selector that points to the dropdown where data is to be appended
		this.populateDropdownOptions = function(data, jqSelectorForDropown){
			$(jqSelectorForDropown+' option').remove()
			$.map( data, function( item ) {
				$(jqSelectorForDropown).append(
					$('<option value="' + item.pk + '">' + item.fields.nombre + '</option>')
				);
			})
		}
		
		//returns true if a key native function is missing
		this.No_HTML5 = function(){
			var user_msg = 'aborting';
			var log_msg = 'aborting';
			var abort = false;
			//make sure this browser can use local storage api
			if(typeof(Storage)=="undefined"){
				user_msg = 'Your browser does not support HTML5 storage';
				log_msg = 'No HTML5 storage API';
				abort = true;
			}
			//make sure this browser can serialize data as json
			if( (! JSON.parse) || (! JSON.stringify ) ){
				user_msg = 'Your browser is not supported';
				log_msg = 'native JSON stringify or parse not available';
				abort = true;
			}
			//if browser lacks required API, then let the user know about it
			if(abort){
				alert(user_msg);
				console.log(log_msg);
			}
			return abort;
		}
	}	
};
