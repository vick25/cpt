
/*
	County projects tracker application
    This application enables visualization of county development projects that have been mapped
    on the ground and their status information updated periodically
*/


	/* create layer and source instances */

	//osm base layers
	var osmlayer = new ol.layer.Tile({
		source: new ol.source.MapQuest({layer:'osm'}),
		//name: 'Openstreet map'

	});
	var satellite = new ol.layer.Tile({
		source: new ol.source.MapQuest({layer:'sat'})
	})
	//esri base map
	/*var esriBase = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url:'http://server.arcgisonline.com/ArcGIS/rest/services' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
		})
	})*/

	//layers from geoserver
	var boundarySource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params: { 'LAYERS':'cpt:nairobi_county',transparent:'true'},
		serverType:'geoserver'
	});

	var countybnd = new ol.layer.Tile({
		source: boundarySource ,
		name: 'County boundary'
	});

	/*var townsSource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params:{'LAYERS':'cpt:nairobi_towns'},
		serverType:'geoserver' 
	})
	//using towns layer for testing application before development projects data is obtained
	var countyTowns = new ol.layer.Tile({
		source: townsSource,
		name: 'Towns'
	});*/

	/*project layers defined below*/
	var allProjectsSource = new ol.source.TileWMS({
		url: 'http://localhost:8080/geoserver/wms',
		params:{'LAYERS':'cpt:projects'},
		serverType:'geoserver'
	});
	var allProjects = new ol.layer.Tile({
		source: allProjectsSource,
		name: 'All projects'
	});

	
	var ongoingProjects = new ol.layer.Tile({ 
		source: new ol.source.TileWMS({
			url: 'http://localhost:8080/geoserver/wms',
			params: { 'LAYERS':'cpt:ongoing'},
			serverType:'geoserver'
		}),
		name: 'Ongoing projects'
	});

	var completedProjects = new ol.layer.Tile({ 
		source: new ol.source.TileWMS({
			url: 'http://localhost:8080/geoserver/wms',
			params: { 'LAYERS':'cpt:completed'},
			serverType:'geoserver'
		}),
		name: 'Completed projeccts'
	});
	var proposedProjects = new ol.layer.Tile({ 
		source: new ol.source.TileWMS({
			url: 'http://localhost:8080/geoserver/wms',
			params: { 'LAYERS':'cpt:proposed'},
			serverType:'geoserver'
		}),
		name: 'Proposed projects'
	});
	/*var stalledProjects = new ol.layer.Tile({ 
		source: new ol.source.TileWMS({
			url: 'http://localhost:8080/geoserver/wms',
			params: { 'LAYERS':'homabay:homabay_constituencies'},//to give appropriate params
			serverType:'geoserver'
		})
	});*/
	

	//var minExtent = ol.proj.transform([33.90,-0.95],'EPSG:4326','EPSG:3857')
	//var extent = [33.90,-0.95,35.06,-0.36]

	//Creating base maps layer group
	var baseMaps = new ol.layer.Group({
		'title':'Base maps',
		layers:[osmlayer]//only one base map used
	})
	//Creating overlay group
	//NB: To write code to asynchronously change map layers based on choice from user
	//use only one base map
	/*
		get checkboxes asynchronously
		check value of each check box
		update map overlay asynchronously

		//Tile.getSource().on('change', function(evt){
			var source = evt.target;
			if (source.getState()=== 'ready'){
				var numFeatures = source.getFeatures().length;
			}
		})//
	*/

	var overLays = new ol.layer.Group({
		'title':'Projecst',
		layers:[countybnd,allProjects,proposedProjects,ongoingProjects,completedProjects,]
	})
	
	//Configure view properties for map instance 
	var view = new ol.View({
		projection: 'EPSG:3857',//because osm base layer is in 'ESPG:3857'
			center: ol.proj.transform([36.87,-1.28], 'EPSG:4326','EPSG:3857'),
			zoom: 11
	});

	
    //Access pop-up elements. 
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');

	//displays coordinates on map
	var mousePositionControl = new ol.control.MousePosition({
          className: 'custom-mouse-position',
          target: document.getElementById('location'),
          projection:'EPSG:4326' ,
          coordinateFormat: ol.coordinate.createStringXY(2),
          undefinedHTML: '&nbsp;'
        });

	//zoom to extent
	/*var zoomToExtentControl = new ol.control.ZoomToExtent({
		projection: 'EPSG:4326',
		extent: extent
	});*/
	
	//scale line control
	//var scale = new ol.control.ScaleLine({units:'degrees'})


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

	
	//create the map instance
	var map = new ol.Map({
		renderer: 'canvas',//force renderer to be used
		controls: ol.control.defaults().extend([mousePositionControl]),
		layers: [baseMaps,overLays],
		overlays: [overlay],
		target:'map',
		view: view
	});


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

	/*map.on('pointermove', function(evt) {
		if (evt.dragging) {
		    return;
		}
		var pixel = map.getEventPixel(evt.originalEvent);
		var hit = map.forEachLayerAtPixel(pixel, function(layer) {
		    return true;
		});
		map.getTargetElement().style.cursor = hit ? 'pointer' : '';
	});*/

	/*Add a click handler to the map to render the popup.*/
	map.on('singleclick', function(evt) {
		var coordinate = evt.coordinate;
		var viewResolution = (view.getResolution());

		/*var featureinfo;
		var layers = map.getLayers()
		for(i=0; i<=layers.length; i++){
			if(i==countyTowns){
				featureinfo = townsSource.getGetFeatureInfoUrl(
		 	    coordinate, viewResolution,'EPSG:3857', 
		 	    {'INFO_FORMAT': 'application/json'});
			}
			else if(i==countybnd){
				featureinfo = featureinfo;
			}
			else{
				featureinfo = featureinfo;
			}
		}*/
		//variable to store requested feature info
		var featureinfo = projectsSource.getGetFeatureInfoUrl(
		 	    coordinate, viewResolution,'EPSG:3857', 
		 	    {'INFO_FORMAT': 'text/html'});//return as json

		//variable to store json object
		//var myfeatureinfo = featureinfo.features;//returns an array containing the feature objects (one object in this case)


		//function to get necessary field for the json object
		

		//iterate through array and obtain required values from the object in array
		/*var townId, townName;
		for(var i = 0; i < featureinfo.features.length; i++){
			townId = featureinfo.features[i].properties.town_id;
			townName = featureinfo.features[i].properties.town_name;
		}*/



		//content.innerHTML = '<iframe seamless src="' + featureinfo + '"></iframe>' ;
		content.innerHTML = '<iframe seamless src="' + featureinfo + '"></iframe>' ;
		overlay.setPosition(coordinate);	
    });

	//layer panel handlers **experimental
		/*$('input[type=checkbox]').on('change', function () {
        var layer = {
            layer1: layer1,
            layer2: layer2
        }[$(this).attr('id')];
        layer.setVisible(!layer.getVisible());
		
	});*/





	