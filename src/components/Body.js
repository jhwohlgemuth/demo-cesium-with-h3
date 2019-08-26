import React, {PureComponent, useContext, useEffect, useRef, useState} from 'react';
import Cesium, {Cartesian3, Cartographic, Color, ScreenSpaceEventType} from 'cesium';
import {CesiumContext, Entity, ScreenSpaceEvent, ScreenSpaceEventHandler, Viewer} from 'resium';
import {geoToH3, h3ToGeoBoundary} from 'h3-js';
const { fromDegrees, fromDegreesArray, fromElements, fromRadians} = Cartesian3;
const {fromCartesian} = Cartographic;
const [latitude, longitude, height] = [35.681167, 139.767052, 100];


const Body = () => {
    let viewer;
    const [position, setPosition] = useState({latitude: 0, longitude: 0});
    const [index, setIndex] = useState('');
    const getBoundary = index => h3ToGeoBoundary(index)
        .map(([lat, lon]) => [lon, lat])
        .reduce((list, latLon) => [...list, ...latLon], []);
    const mouseEvent = ({ endPosition }) => {
        const {toDegrees} = Cesium.Math;
        const cartesian = viewer.scene.camera.pickEllipsoid(endPosition);
        if (cartesian) {
            const {latitude, longitude, height} = fromCartesian(cartesian);
            setPosition({
                latitude: toDegrees(latitude),
                longitude: toDegrees(longitude),
                height: toDegrees(height)
            });
            setIndex(geoToH3(position.latitude, position.longitude));
        }
    };
    return <Viewer full animation={false} timeline={false} ref={e => viewer = !!e ? e.cesiumElement : undefined}>
        <ScreenSpaceEventHandler>
            <ScreenSpaceEvent action={mouseEvent} type={ScreenSpaceEventType.MOUSE_MOVE}></ScreenSpaceEvent>
        </ScreenSpaceEventHandler>
        <Entity
            name="Tokyo"
            position={fromDegrees(position.longitude, position.latitude, position.height)}
            point={{
                pixelSize: 10,
                color: Color.FUCHSIA
            }}
            description="Hello World"
        />
        <Entity
            name="Tokyo"
            polygon={{
                material: Color.CYAN.withAlpha(0.1),
                hierarchy: fromDegreesArray(getBoundary(index))
            }}
            description="H3 Hexagon on Tokyo"
        />
    </Viewer>;
};

export default Body;