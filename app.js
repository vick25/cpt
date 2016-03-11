
/*
    This application enables visualization of county development projects that have been mapped
    on the ground and their status information updated periodically.
    This application is based on openLayers 3.5
*/


	/* create layer and their source instances */

	//layers array to hold all layers
	var layersArray = [];

	//osm base layers
	var osmlayer = new ol.layer.Tile({
		source: new ol.source.MapQuest({layer:'osm'}),
		//name: 'Openstreet map'
	});
	var satellite = new ol.layer.Tile({
		source: new ol.source.MapQuest({layer:'sat'})
	})


	//subcounties boundaries layer
	var boundarySource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: { 'LAYERS':'cpt:nairobi_sub_counties',transparent:'true'},
		serverType:'geoserver',
		tiled: true
	});

	var countybnd = new ol.layer.Tile({
		source: boundarySource ,
		name: 'County boundary'
	});


	/*project layers defined below*/
	var allProjectsSource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params:{'LAYERS':'cpt:allProjects'},
		serverType:'geoserver'
	});
	var allProjects = new ol.layer.Tile({
		source: allProjectsSource,
		name: 'All projects'
	});
	allProjects.setVisible(false);

	var ongoingProjectsSource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: { 'LAYERS':'cpt:ongoing_projects'},
		serverType:'geoserver'
	});
	var ongoingProjects = new ol.layer.Tile({ 
		source: ongoingProjectsSource,
		name: 'Ongoing projects'
	});
	ongoingProjects.setVisible(false);

	var completedProjectsSource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: { 'LAYERS':'cpt:completed_projects'},
		serverType:'geoserver'
	});
	var completedProjects = new ol.layer.Tile({ 
		source: completedProjectsSource,
		name: 'Completed projeccts'
	});
	completedProjects.setVisible(false);

	var proposedProjectsSource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: { 'LAYERS':'cpt:proposed_projects'},
		serverType:'geoserver'
	});
	var proposedProjects = new ol.layer.Tile({ 
		source: proposedProjectsSource,
		name: 'Proposed projects'
	});
	proposedProjects.setVisible(false);
	
	//adding layers to the layers array
	layersArray.push(osmlayer); //0
	layersArray.push(countybnd); //1
	layersArray.push(ongoingProjects); //2
	layersArray.push(proposedProjects); //3
	layersArray.push(completedProjects); //4
	//layersArray.push(allProjects); //5

	
	
	//configure view properties for map instance 
	var view = new ol.View({
		projection: 'EPSG:3857',//because osm base layer is in 'ESPG:3857'
			center: ol.proj.transform([36.87,-1.28], 'EPSG:4326','EPSG:3857'),
			zoom: 11
	});

	
    //access pop-up elements. 
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');

	//click handler to hide/close pop-up
	closer.onclick = function() {
	    overlay.setPosition(undefined);
	    closer.blur();
	    return false;
	};

 	//Create overlay to anchor the popup to the map.
	var overlay = new ol.Overlay( ({
  		element: container,
  		autoPan: true,
  		autoPanAnimation: {
    	duration: 250
  		}
	}));

	//control to display map coordinates
	var mousePositionControl = new ol.control.MousePosition({
          className: 'custom-mouse-position',
          target: document.getElementById('location'),
          projection:'EPSG:4326' ,
          coordinateFormat: ol.coordinate.createStringXY(2),
          undefinedHTML: '&nbsp;'
        });

	
	//create the map instance
	var map = new ol.Map({
		renderer: 'canvas',//force renderer to be used
		controls: ol.control.defaults().extend([mousePositionControl]),
		layers: layersArray,
		overlays: [overlay],
		target:'map',
		view: view
	});

	//function to manage layer visibility
	function switchlayer(e){
		layersArray[e.value].setVisible(e.checked);
	}


	/*this function changes the cursor to a pointer when cursor is on map*/
	var cursorHoverStyle = "pointer";
	var target = map.getTarget();
	var mTarget = typeof target === "string" ? $("#"+target) : $(target);
	
	map.on("pointermove", function (event) {
    	var mouseCoordInMapPixels = [event.originalEvent.offsetX, event.originalEvent.offsetY];

    	//get feature at mouse coords
    	var hit = map.forEachFeatureAtPixel(mouseCoordInMapPixels, function (feature, layer) {
        	return true;
    	});

    	if (hit) {
        	mTarget.css("cursor", cursorHoverStyle);
    	} else {
        	mTarget.css("cursor", "");
    	}
	});


	/*adds a click handler to the map to render the popup.*/
	map.on('singleclick', function(evt) {
		var coordinate = evt.coordinate;
		var viewResolution = (view.getResolution());
		var mapLayers = map.getLayers();
		
		
	
		//variable to store requested feature info
		var featureinfo = allProjectsSource.getGetFeatureInfoUrl(
		 	    coordinate, viewResolution,'EPSG:3857', 
		 	    {'INFO_FORMAT': 'text/html'})
		
		content.innerHTML = '<iframe seamless src="' + featureinfo + '"></iframe>' ;
		overlay.setPosition(coordinate);	
    });

	





	