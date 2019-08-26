import React, {useState} from 'react';
import Cesium, {Cartesian3, Cartographic, Color, ScreenSpaceEventType} from 'cesium';
import {Entity, ScreenSpaceEvent, ScreenSpaceEventHandler, Viewer} from 'resium';
import {geoToH3, h3ToGeoBoundary} from 'h3-js';
const {fromDegrees, fromDegreesArray} = Cartesian3;
const {fromCartesian} = Cartographic;

const Body = () => {
    let viewer;
    const [position, setPosition] = useState({latitude: 0, longitude: 0, height: 0});
    const [index, setIndex] = useState('');
    const getBoundary = index => h3ToGeoBoundary(index)
        .map(([lat, lon]) => [lon, lat])
        .reduce((list, latLon) => [...list, ...latLon], []);
    const mouseEvent = ({endPosition}) => {
        const {toDegrees} = Cesium.Math;
        const cartesian = viewer.scene.camera.pickEllipsoid(endPosition);
        if (cartesian) {
            const {latitude, longitude} = fromCartesian(cartesian);
            setPosition({
                latitude: toDegrees(latitude),
                longitude: toDegrees(longitude),
                height: 0
            });
            setIndex(geoToH3(position.latitude, position.longitude));
        }
    };
    return <Viewer full animation={false} infoBox={false} timeline={false} ref={e => viewer = e ? e.cesiumElement : undefined}>
        <ScreenSpaceEventHandler>
            <ScreenSpaceEvent action={mouseEvent} type={ScreenSpaceEventType.MOUSE_MOVE}/>
        </ScreenSpaceEventHandler>
        <Entity
            description="Mouse cursor location"
            position={fromDegrees(position.longitude, position.latitude, position.height)}
            point={{pixelSize: 10, color: Color.FUCHSIA}}
        />
        <Entity
            description="H3 Hexagon"
            polygon={{hierarchy: fromDegreesArray(getBoundary(index)), material: Color.CYAN.withAlpha(0.2)}}
        />
    </Viewer>;
};

export default Body;