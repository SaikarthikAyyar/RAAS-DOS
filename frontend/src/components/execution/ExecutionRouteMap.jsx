import { useEffect } from "react";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "./Execution.css";


// ====================================
// MARKER ICONS
// Plain CSS-based divIcons instead of Leaflet's default image-based
// marker - sidesteps the well-known "broken marker icon" issue that
// hits every Leaflet + Vite/webpack bundler setup (the default marker
// PNGs don't resolve through the bundler's asset pipeline unless
// separately configured), and lets each pin be color-coded to what it
// means at a glance.
// ====================================

function dotIcon(color){

    return L.divIcon({
        className: "",
        html: `<span class="execution-map-pin" style="background:${color}"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

}

const SOURCE_ICON = dotIcon("#3b82f6");       // blue - where the machine started
const DESTINATION_ICON = dotIcon("#f58220");  // orange - the job site
const LIVE_ICON = dotIcon("#16a34a");         // green - last known/current position


// ====================================
// AUTO-FIT
// Fits the map to whatever points are actually available - one point
// alone just centers on it (a fitBounds with a single point throws),
// multiple points fit with padding.
// ====================================

function AutoFit({ points }){

    const map = useMap();

    useEffect(()=>{

        if(points.length === 0) return;

        if(points.length === 1){
            map.setView(points[0], 12);
            return;
        }

        map.fitBounds(points, { padding: [32, 32] });

    }, [map, JSON.stringify(points)]);

    return null;

}


// ====================================
// ROUTE MAP
// Straight-line source -> destination (matches the haversine distance
// shown alongside it - no false road-following implied), plus a third
// marker for the manually-entered "last known position" once one
// exists. No live movement/animation - this app deliberately isn't
// claiming real-time tracking yet (see Phase 38's plan); the day a
// real GPS device starts writing execution.latitude/longitude, this
// same map picks it up with zero changes.
// ====================================

export default function ExecutionRouteMap({

    sourceLat,
    sourceLng,
    destinationLat,
    destinationLng,
    currentLat,
    currentLng,
    distanceKm

}){

    const source = (sourceLat != null && sourceLng != null) ? [sourceLat, sourceLng] : null;
    const destination = (destinationLat != null && destinationLng != null) ? [destinationLat, destinationLng] : null;
    const current = (currentLat != null && currentLng != null) ? [currentLat, currentLng] : null;

    const points = [source, destination, current].filter(Boolean);

    if(points.length === 0){

        return(
            <div className="execution-map execution-map-empty">
                Set the source and destination below to see the route on the map.
            </div>
        );

    }

    const center = points[0];

    return(

        <div className="execution-map-wrap">

            <MapContainer
                center={center}
                zoom={12}
                scrollWheelZoom={true}
                className="execution-map"
            >

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {source && <Marker position={source} icon={SOURCE_ICON}/>}
                {destination && <Marker position={destination} icon={DESTINATION_ICON}/>}
                {current && <Marker position={current} icon={LIVE_ICON}/>}

                {source && destination && (
                    <Polyline
                        positions={[source, destination]}
                        pathOptions={{ color: "#f58220", weight: 3, dashArray: "6 6" }}
                    />
                )}

                <AutoFit points={points}/>

            </MapContainer>

            <div className="execution-map-legend">
                {source && <span><i style={{background:"#3b82f6"}}/> Source</span>}
                {destination && <span><i style={{background:"#f58220"}}/> Destination</span>}
                {current && <span><i style={{background:"#16a34a"}}/> Last known position</span>}
                {distanceKm != null && <strong>{distanceKm} km straight-line</strong>}
            </div>

        </div>

    );

}
