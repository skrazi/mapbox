import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapboxgl  from 'mapbox-gl';

import { environment } from 'src/environments/environment';
import { Minimap } from './minimap.service';
import { PopupService } from './popup.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map: mapboxgl.Map;
  minimap: mapboxgl.Map;
  // style = 'mapbox://styles/mapbox/streets-v11';
  style = "./assets/style.json"

  constructor(private router: Router, private route: ActivatedRoute,
    private popupService: PopupService) { 
  }

  ngOnInit(): void {
  
    // Creating a new map component with certain parameters like style, zoom, maxBounds and center etc.
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 1,
      maxBounds: [[-180, -90], [180, 90]],
      center: [0,25],
      renderWorldCopies: false,
      attributionControl: false,
      logoPosition: "top-left"
    });

    // Control adds the zoom in and zoom out buttons on the map. Pos can be specified
    this.map.addControl(new mapboxgl.NavigationControl({showCompass: false}), "bottom-right");

    // Adding a new Minimap to the main map through the Minimap class in minimap.service.ts
    this.map.addControl(new Minimap(), 'bottom-left');

    // const langButton = document.createElement('button');
    // langButton.innerHTML = "Change";
    // this.map.getContainer().appendChild(langButton);
    

    // Using the map.on to add an event listener for the specified event ('load') 
    this.map.on('load', () => {

      // Loading an external image to use as a marker in map
      // Should be used when I am using a default style from mapbox
      // For custom styles the marker can be added in Mapbox Studio and can be
      // rendered in the map by just specifying it's name
      this.map.loadImage('./assets/299087_marker_map_icon.png', (error, image) => {
        if(error) throw error;
        this.map.addImage('marker-icon', image);
      });

      // If you want to add default language other than english add code from 
      // the changeLanguage() method HERE

      // Using a geojson file as our data source
      this.map.addSource('markers', {
        type: 'geojson',
        data: './assets/markers2.geojson', tolerance: 0,
        cluster: true,
        clusterMaxZoom:22,
        clusterRadius: 50,
        clusterMinPoints: 2
      });

      // Different styles ripple m
      this.map.addImage('ripple-effect-l4', this.rippleEffect("L4"));
      this.map.addImage('ripple-effect-l3', this.rippleEffect("L3"));
      this.map.addImage('ripple-effect-l2', this.rippleEffect("L2"));
      this.map.addImage('ripple-effect-l1', this.rippleEffect("L1"));
      this.map.addImage('ripple-effect-cluster', this.rippleEffect("cluster"));
      
      // // Layer 1: Droplet icon image
      // this.map.addLayer({
      //   id: "teardrop",
      //   type: "symbol",
      //   source: "markers",
      //   layout: {
      //     "icon-image": "299087_marker_map_icon", // Specifying only name for custom styles
      //     "icon-size": 2,
      //     "icon-ignore-placement": true,
      //     "icon-allow-overlap": true,
      //     "icon-anchor": 'bottom',
      //     "text-allow-overlap": true
      //   }
      // })
      
      // Layer 2: Circle on the image
      this.map.addLayer({
        id: "circles",
        type: "circle",
        source: "markers",
        paint: {
          "circle-color":   [
            "match",
            ["get", "alertType"],
            "L4", "#ff0000",
            "L3", "#ffff00",
            "L2", "#ff9900",
            "L1", "#d2a679",
            "#000066"
          ],
          "circle-radius": [
            "match",
            ["get", "alertType"],
            "L4",17,
            "L3",14,
            "L2",11,
            "L1",8,
            15
          ]
          //"circle-translate": [0, -33]
        }
      })

      // Layer 3: Ripple Effect with the text showing BPS
      this.map.addLayer({
        id: "ripple",
        type: "symbol",
        source: "markers",
        layout: {
          //"icon-offset": [0, -33],
          "icon-image": [
            "match",
            ["get", "alertType"],
            "L4", "ripple-effect-l4",
            "L3", "ripple-effect-l3",
            "L2", "ripple-effect-l2",
            "L1", "ripple-effect-l1",
            "ripple-effect-cluster"
          ],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-field":"{alarms}",
          "text-font": ["Roboto Black"],
          "text-anchor": "center",
          "text-allow-overlap": true,
          "text-size": [
            "match",
            ["get", "alertType"],
            "L4", 16,
            "L3", 14,
            "L2", 12,
            "L1", 8,
            16
          ]
        },
        paint: {
          "text-color": [
            "match",
            ["get", "alertType"],
            "L3",   
            "#000000",
            "#ffffff"
          ],
          //"text-translate": [0, -33]
          "text-translate": [0, 2]
        }
      });
    });

    // Creating a tooltip for markers using the Popup Class
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, anchor: "top-left", offset: [0, 12]});
    

    // Creating an event listenter for whenever the mouse enters the points layer i.e markers
    this.map.on('mouseenter', 'circles', (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      // if it is a Point then show the normal data like bps, alarms
      if (e.features[0].geometry.type === 'Point') {
        var coordinates = e.features[0].geometry.coordinates.slice();
      }

      if ( e.features[0].properties.cluster !== true ) {
        // const description = e.features[0].properties.description;
        // console.log(e.features[0]);
        // Object for all the data to be shown in the popup
        const data = {
          siteName:e.features[0].properties.description, 
          bps: e.features[0].properties.alarms,
          unacknowledged: 100,
          machineAlarms: 841,
          openCases: 51
        }

        // PopupService returns a html string by creating a table for the above data object
        const popupHTML = this.popupService.makePopup(data);
      
        // Attaching latlong and html to each marker
        popup.setLngLat([coordinates[0], coordinates[1]]).setHTML(popupHTML).addTo(this.map); 
      } 
      else 
      { // if it is a group then show the different sites belonging to that cluster
        // const cluster_id = e.features[0].properties.cluster_id;
        // const point_count = e.features[0].properties.point_count;
        // console.log(cluster_id);
        // const clusterSource = this.map.getSource('circles');
        // console.log(clusterSource);

        const features = e.features;
        const clusterId = features[0].properties.cluster_id;
        const pointCount = features[0].properties.point_count;
        const clusterSource: mapboxgl.GeoJSONSource =  this.map.getSource('markers') as mapboxgl.GeoJSONSource;

        console.log(features);
        console.log("Actual Zoom Value: " + this.map.getZoom());
        clusterSource.getClusterLeaves(clusterId, pointCount, 0,
          (error, features) => {
            // Print cluster leaves in the console
            // console.log('Cluster leaves:', features);
            // console.log(features.length);
            // console.log(features[0].properties.description);
            if(error) return;

            // PopupService returns a html string by creating a table for the above data object
            const popupHTML = this.popupService.makePopupForCluster(features);
        
            // Attaching latlong and html to each marker
            popup.setLngLat([coordinates[0], coordinates[1]]).setHTML(popupHTML).setMaxWidth('360px').addTo(this.map); 
          }
        );
      }
    });

    // Mouse leave event to remove the popup 
    this.map.on('mouseleave', 'circles', () => {
      this.map.getCanvas().style.cursor = '';
      popup.remove();
    });

    // Click listener on the points in order to navigate to the HMI view component
    // Used angular routing for this
    this.map.on('click', 'circles', (e) => {
      if (e.features[0].geometry.type === 'Point' && e.features[0].properties.cluster !== true) {
        this.router.navigate(['hmi', e.features[0].properties.siteId], 
        {
          relativeTo: this.route,
          queryParams:{
            description: e.features[0].properties.description
          }
        });
      } else {
        const features = e.features;
        const clusterId = features[0].properties.cluster_id;
        (this.map.getSource('markers') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            if (features[0].geometry.type === 'Point') {
              this.map.easeTo(
                { 
                  center: [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
                  zoom: zoom + 0.001
                }
              );
              console.log("Zoom value set to" + zoom);
            }
          }
        );
      }
    })
  } // end of ngOnInit


  // Ripple effect method that sets the HTML Canvas to show the ripple effect
  rippleEffect(alertLevel: string) {
    let size;
    if (alertLevel === "L4") {
      size = 100;
    } else if (alertLevel === "L3") {
      size = 75;
    } else if (alertLevel === "L2") {
      size = 55;
    } else if (alertLevel === "L1") {
      size = 35;
    } else {
      size = 10;
    }
    
    var nestedThis = this;

    const rippleEffect = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      
      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
      },
      
      // Call once before every frame where the icon will be used.
      render: function () {
      let duration;
      if (alertLevel === "L4") {
        duration = 900;
      } else if (alertLevel === "L3") {
        duration = 1000;
      } else if (alertLevel === "L2") {
        duration = 1300;
      } else if (alertLevel === "L1") {
        duration = 1600;
      } else {
        duration = 0; // cluster
      }
      // console.log(alertLevel + " " + duration);
      const t = (performance.now() % duration) / duration;
      
      const radius = (size / 2) * 0.2;
      const outerRadius = (size / 2) * 0.3 * t + radius;
      const context = this.context;
      
      // Draw the outer circle.
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
      this.width / 2,
      this.height / 2,
      outerRadius,
      0,
      Math.PI * 2
      );

      // For transparent bg
      context.fillStyle = `rgba(0, 0, 0, 0)`

      if(alertLevel === "L4"){
        context.strokeStyle = `rgba(255, 0, 0, ${1 - t})`;
        //context.strokeStyle = '#ff0000';
        context.lineWidth =  2 + 2 * (1 - t);
      } else if(alertLevel === "L3"){
        context.strokeStyle = `rgba(255, 255, 0, ${1 - t})`;
        //context.strokeStyle = '#ffff00';
        context.lineWidth =  2 + 2 * (1 - t);
      } else if(alertLevel === "L2"){
        context.strokeStyle = `rgba(255, 125, 0, ${1 - t})`;
        //context.strokeStyle = '#ff9900';
        context.lineWidth =  2 + 2 * (1 - t);
      } else if(alertLevel === "L1"){
        context.strokeStyle = `rgba(179, 153, 124, ${1 - t})`;
        //context.strokeStyle = '#d2a679';
        context.lineWidth =  2 + 2 * (1 - t);
      } else{
        context.strokeStyle = `rgba(0, 0, 0, 0)`;
      }
      context.fill();
      
      //Draw the inner circle 1 with biggest radius
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        (size / 2) * 0.7 * t + radius ,
        0,
        Math.PI * 2
      );
      context.stroke();

      //Draw the inner circle 2 with a bit smaller radius
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        (size / 2) * 0.5 * t + radius ,
        0,
        Math.PI * 2
      );
      context.stroke();

      // Draw the inner circle 3 with the smallest radius
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        (size / 2) * 0.3 * t + radius ,
        0,
        Math.PI * 2
      );
      context.stroke();

      // context.fillStyle = 'rgba(255, 100, 100, 1)';
      // context.strokeStyle = 'red';
      // context.lineWidth =  2 + 4 * (1 - t);
      //context.fill();

      
      // Update this image's data with data from the canvas.
      this.data = context.getImageData(
      0,
      0,
      this.width,
      this.height
      ).data;
      
      // Continuously repaint the map, resulting
      // in the smooth animation of the dot.
      nestedThis.map.triggerRepaint();
      
      // Return `true` to let the map know that the image was updated.
      return true;
      }
   };
   return rippleEffect;
  } // end of rippleEffect method


  changeLanguage(language: string) {
    let labels = [ 'country-label', 'state-label', 
    'settlement-label', 'settlement-subdivision-label', 
    'airport-label', 'poi-label', 'water-point-label', 
    'water-line-label', 'natural-point-label', 
    'natural-line-label', 'waterway-label', 'road-label' ];

    // To change the language of the map
    labels.forEach(label => {
      this.map.setLayoutProperty(label, 'text-field', ['get', language]);
    });
  }

  changeStyle() {
    this.style = 'mapbox://styles/raziuddin/cksslgfnp3b2218ljsz3urnvm';
    this.ngOnInit();
  }


  ngOnDestroy() {
    this.map.off('load', (e) => {
      this.map.removeLayer('teardrop');
      this.map.removeLayer('circles');
      this.map.removeLayer('ripple');

      console.log("inside on Destroy-------------");
     })
  }
} // end of class
