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
		
		this.startStep = function (serviceURL, callback){
			//if there are pending nodes to process
			if(serempre.cargos.pendingCargos.length > 0){
				//get the first pending node
				var node_pk = serempre.cargos.pendingCargos[0];
				var node = serempre.cargos.futurePaths[ node_pk ];
				serempre.cargos.pendingCargos = serempre.cargos.pendingCargos.slice(1, serempre.cargos.pendingCargos.length);
				//skip all nodes already available
				while(node){
					node_pk = serempre.cargos.pendingCargos[0];
					node = serempre.cargos.futurePaths[ node_pk ];
					serempre.cargos.pendingCargos = serempre.cargos.pendingCargos.slice(1, serempre.cargos.pendingCargos.length);
				}
				//fetch a node from the server. Upon completion trigger this function again
				if( !node ){
					if( node_pk ){
						$.ajax({
							url: serviceURL.slice(0,-2) + node_pk + "/"
							, dataType: "json"
							, success: function(data, textStatus, jqXHR){
								//if the server-side data points to any other graph nodes, then schedule them for future processing
								if(data[0]){
									serempre.cargos.stopStep(data[0]);
								} 
								//if server-side data doesn't point to any other nodes
								if( data[0].fields.siguientes.length <= 0 ) {
									//this is a leaf. Save it for later use
									serempre.cargos.destinations[ serempre.cargos.destinations.length ] = node;
								}
							}
							, error: function(jqXHR, textStatus, errorThrown){
								alert(textStatus);
							}
							, complete: function(jqXHR, textStatus){
								serempre.cargos.startStep(serviceURL, callback);
							}
						});
					}
					else {
						serempre.cargos.startStep(serviceURL, callback);
					}
				}
			} 
			else{
				sessionStorage.futurePaths = '{' + serempre.cargos.toStringify.slice(1,this.toStringify.length) + '}';
				sessionStorage.destinations = JSON.stringify(serempre.cargos.destinations);
				serempre.cargos.rebuildPaths();
				callback();
				serempre.cargos.toggleWaitDialog();
			}
		}
		
		this.stopStep = function(node){
			serempre.cargos.futurePaths[ node.pk ] = node;
			serempre.cargos.toStringify += ',"' + node.pk + '":' + JSON.stringify(node);
			for(var i = 0; i < node.fields.siguientes.length; i++){
				var node_pk = node.fields.siguientes[i];
				if( !serempre.cargos.futurePaths[ node_pk ] ){
					serempre.cargos.pendingCargos[ serempre.cargos.pendingCargos.length ] = node_pk;
				}
			}
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
			//show please wait dialog
			this.toggleWaitDialog(wait_message ? wait_message : 'Estamos buscando planes de carrera a partir del cargo que ocupas', wait_icon ? wait_icon : 'icon-filter');
			//trigger graph walking algorithm
			serempre.cargos.startStep(serviceURL, callback);
			//this.calculateRouteEndpoints_inspectChildrenFor(serviceURL, callback);
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
	
	this.graphs = new function(){
	
		//use Depth First Search to print a text based representation for a provided graph
		//vertexes: an object where each attribute is a key to a vertex
		//vertex: a vertex where graph walk starts
		//prefix: string to make each node hint about it's depth
		//vertexTagCallable: a function that takes a vertex as an argument and returns a string representing the provided vertex
		this.outputVertex = function(vertexes, vertex, prefix, vertexTagCallable){
			if(!vertex.visited){
				console.log(vertex.depth +':'+ prefix + '-> ' + vertexTagCallable(vertex));
				vertex.visited = true;
				for(var i = 0; i< vertex.adjacent.length; i++){
					var ith_vertex_pk = vertex.adjacent[i];
					var ith_vertex = vertexes[ ith_vertex_pk ];
					if(! ith_vertex.visited)
						ith_vertex.depth = 1 + vertex.depth;
					serempre.graphs.outputVertex(vertexes, ith_vertex,'------'+prefix, vertexTagCallable);
				}
			}
		}
		
		//turn a key value pair representation of a graph into an array of vertexes
		//vertexes: an object where each attribute is a key to a vertex
		this.prepareAbstractGraph = function (vertexes){
			var allNodes = [];
			for(var i in vertexes){
				node = vertexes[i];
				node.visited = false;
				node.depth = 1;
				node.adjacent = [];
				for(var j = 0; j < node.fields.siguientes.length; j++){
					var next = node.fields.siguientes[j];
					node.adjacent[ node.adjacent.length ] = next;
				}
				allNodes[ allNodes.length ] = node;
			}
			return allNodes;
		}
		
		//use an array of vertexes to create a corresponding array of edges
		//vertexes: an array of vertexes
		this.buildEdgeArray = function (vertexes){
			var edges = [];
			for(var i = 0; i < vertexes.length; i++){
				node = vertexes[i];
				node.visited = false;
				node.depth = 1;
				node.adjacent = [];
				for(var j = 0; j < node.fields.siguientes.length; j++){
					var next = node.fields.siguientes[j];
					var k;
					for(k = 0; k < vertexes.length && next != vertexes[k].pk; k++);
					node.adjacent[ node.adjacent.length ] = k;
				}
				edges[ i ] = node.adjacent;
				console.log(i + ': ' + node.pk + ' || ' + node.fields.nombre);
			}
			return edges;
		}
		
		//use Breath First Search to find a path in between 2 vertexes
		//vertexes: an array of vertexes
		//edges: an array of edges that matches the vertex array
		//start: where the path starts
		//finish: where the path ends
		this.path = function (vertexes, edges, start, finish){
			var pending = [ start ];
			var path = [ ];
			while(pending.length > 0 && start != finish){
				if( !vertexes[ start ].visited ){
					for(var i = 0; i < edges[ start ].length; i++){
						if( !vertexes[ edges[ start ][i] ].visited ){
							pending[ pending.length ] = edges[ start ][i];
							vertexes[ edges[ start ][i] ].depth = 1 + vertexes[ start ].depth;
						}
					}
					path[ path.length ] = start;
					pendingLenth = edges[ start ].length;
					vertexes[ start ].visited = true;
				}
				pending = pending.slice(1, pending.length);
				start = pending[0];
				if( vertexes[start].depth <= vertexes[ path[ path.length - 1] ].depth ){
					path = path.slice(0, path.length - 1);
				}
			}
			if(start == finish){
				path[ path.length ] = start;
			}
			return path;
		}
		
		//finds the vertex 0-based index for a vertex given a fixed vertex comparison function
		//vertexes: an array of vertexes
		//filter: a function that takes a vertex as a parameter and returns true if it matches filter criteria. It should return false otherwise
		this.indexFor = function (vertexes, filter){
			for(var i = 0; i < vertexes.length; i++){
				if( filter(vertexes[i]) ){
					return i;
				}
			}
			return -1;
		}
		
		//perform DFS upon a graph. Returns the path to follow, or null if no path was found
		//vertexes: array holding vertexes
		//edges: array holding edges
		//start: path start as an index for the vertexes array
		//end: path end as an index for the vertexes array
		//vertexTagCallable: a function to perform on each visited vertex. The function receives the vertex as a parameter
		//path: don't use this
		this.dfs = function(vertexes, edges, start, end, prefix, vertexTagCallable){
			var pending = [ start ];
			
			var path = [ ];
			
			while(start != end && pending.length > 0){
                start = pending[0];
                pending = pending.slice(1, pending.length);
                if( path[ path.length - 1 ] && vertexes[ start ].depth <= vertexes[ path[ path.length - 1 ] ].depth){
                    path = path.slice(0, path.length - 1);
                }
                if( vertexes[ start ].visited ){
                    continue;
                }
                if(vertexTagCallable){
                    if( vertexes[ start ].depth > 1 ){
                        var tmp = '------';
                        for(var i = 0; i < vertexes[ start ].depth -1; i++){
                            tmp += '------';
                        }
                        prefix = tmp;
                    }
                    console.log(vertexes[ start ].depth +':'+ prefix + '-> ' + vertexTagCallable(vertexes[ start ]));
                }
                vertexes[ start ].visited = true;
                path[ path.length ] = start;
                for(var i = 0; i < edges[ start ].length; i++){
                    if(! vertexes[ edges[start][i] ].visited ){
                        vertexes[ edges[start][i] ].depth = 1 + vertexes[ start ].depth;
                        pending = [ edges[ start ][i] ].concat(pending);
                    }
                }
			}
			if( start == end ){
                return path;
			}
			return null;
		}
		
		//perform BFS upon a graph. Returns the path to follow
		//vertexes: array holding vertexes
		//edges: array holding edges
		//start: path start as an index for the vertexes array
		//end: path end as an index for the vertexes array
		//vertexTagCallable: a function to perform on each visited vertex. The function receives the vertex as a parameter
		this.bfs = function (vertexes, edges, start, end, vertexTagCallable){
			var pending = [ start ];
			
			var path = [ ];
			
			while(start != end && pending.length > 0){
                start = pending[0];
                pending = pending.slice(1, pending.length);
                if( path[ path.length - 1 ] && vertexes[ start ].depth <= vertexes[ path[ path.length - 1 ] ].depth){
                    path = path.slice(0, path.length - 1);
                }
                if( vertexes[ start ].visited ){
                    continue;
                }
                if(vertexTagCallable){
                    if( vertexes[ start ].depth > 1 ){
                        var tmp = '------';
                        for(var i = 0; i < vertexes[ start ].depth -1; i++){
                            tmp += '------';
                        }
                        prefix = tmp;
                    }
                    console.log(vertexes[ start ].depth +':'+ prefix + '-> ' + vertexTagCallable(vertexes[ start ]));
                }
                vertexes[ start ].visited = true;
                path[ path.length ] = start;
                for(var i = 0; i < edges[ start ].length; i++){
                    if(! vertexes[ edges[start][i] ].visited ){
                        vertexes[ edges[start][i] ].depth = 1 + vertexes[ start ].depth;
                        pending[ pending.length ] = edges[ start ][i];
                    }
                }
			}
			if( start == end ){
                return path;
			}
			return null;
		}
		
		/*
		// sample client for the above API
		
			console.log('total nodes: ' + prepareAbstractGraph(futurePaths).length);

			node_pk = $('#cargo_inicial_nombre option:selected').val();
			
			
			
			outputVertex(futurePaths, futurePaths[node_pk], '', function(vertex){ return vertex.pk + ' ' + vertex.fields.nombre; });
			
			var vertexes = prepareAbstractGraph(futurePaths);
			var edges = buildEdgeArray(vertexes);
			var path = path(vertexes,edges,0,20);
			console.log(path);
			for(var i = 0; i < path.length; i++){
				console.log(i + ' ' +edges[ path[ i ] ]);
			}
			
			var x = serempre.graphs.dfs(vertexes, edges, 0, 48);
			var vertexes = serempre.graphs.prepareAbstractGraph(paths);
			var edges = serempre.graphs.buildEdgeArray(vertexes);
			var y = serempre.graphs.bfs(vertexes,edges,0,-1, function(vertex){
				var indent = '   ';
				while(indent.length < vertex.depth * 3){
					indent += '   ';
				}
				return indent + vertex.fields.nombre;
			});

		
		*/
	}
};
