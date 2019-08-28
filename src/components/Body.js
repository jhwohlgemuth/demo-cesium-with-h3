import React, {useEffect, useState} from 'react';
import Cesium, {Cartesian3, Cartographic, Color, ScreenSpaceEventType} from 'cesium';
import {Entity, Primitive, ScreenSpaceEvent, ScreenSpaceEventHandler, Viewer} from 'resium';
import {geoToH3, h3ToGeoBoundary, h3IsValid} from 'h3-js';
const {fromDegrees, fromElements, fromDegreesArray} = Cartesian3;
const {fromCartesian} = Cartographic;

function* range(max) {
    let index = 0;
    while (index < max) {
        yield index++;
    }
}
const random = (min, max) => Math.random() * (max - min) + min;
const randomLatitude = () => Number(random(-45, 45).toFixed(2));
const randomLongitude = () => Number(random(-180, 180).toFixed(2));
const generateRandomPositions = n => [...range(n)].map(() => fromDegrees(randomLongitude(), randomLatitude(), 0));
const randomPositions = generateRandomPositions(1000);

const Body = () => {
    let viewer;
    const [position, setPosition] = useState({latitude: 0, longitude: 0, height: 0});
    const [index, setIndex] = useState('');
    const [selected, setSelected] = useState([]);
    const getBoundary = index => h3ToGeoBoundary(index)
        .map(([lat, lon]) => [lon, lat])
        .reduce((list, latLon) => [...list, ...latLon], []);
    // const mouseEvent = ({endPosition}) => {
    //     const {toDegrees} = Cesium.Math;
    //     const cartesian = viewer.scene.camera.pickEllipsoid(endPosition);
    //     if (cartesian) {
    //         const {latitude, longitude} = fromCartesian(cartesian);
    //         setPosition({
    //             latitude: toDegrees(latitude),
    //             longitude: toDegrees(longitude),
    //             height: 0
    //         });
    //         setIndex(geoToH3(position.latitude, position.longitude));
    //     }
    // };
    const onClick = data => {
        const {toDegrees} = Cesium.Math;
        const picked = viewer.scene.pick(data.position);
        if (Cesium.defined(picked)) {
            const {primitive} = picked;
            const entity = viewer.entities.getById(primitive.id._id);
            entity.point.color = Color.RED;
            const cartesian = viewer.scene.camera.pickEllipsoid(data.position);
            if (cartesian) {
                const {latitude, longitude} = fromCartesian(cartesian);
                const newPosition = {
                    latitude: toDegrees(latitude),
                    longitude: toDegrees(longitude),
                    height: 0
                };
                const newIndex = geoToH3(newPosition.latitude, newPosition.longitude);
                const ids = viewer.entities.values
                    .filter(({_position}) => _position)
                    .filter(({_position}) => {
                        const {x, y, z} = _position._value;
                        const {latitude, longitude} = fromCartesian(fromElements(x, y, z));
                        const idx = geoToH3(toDegrees(latitude), toDegrees(longitude))
                        return idx === newIndex;
                    })
                    .map(entity => entity.description._value)
                setSelected(ids);
                setPosition(newPosition);
                setIndex(newIndex);
            }
        }
    };
    return <Viewer full animation={false} infoBox={false} selectionIndicator={false} timeline={false} ref={e => viewer = e ? e.cesiumElement : undefined}>
        {randomPositions.map((position, index) => {
            return <Entity
                description={index}
                onClick={onClick}
                position={position}
                point={{
                    pixelSize: 10,
                    color: selected.includes(index) ? Color.DEEPPINK : Color.CYAN
                }}
            />
        })}
        {h3IsValid(index) && <Entity
            description="H3 Hexagon"
            polygon={{hierarchy: fromDegreesArray(getBoundary(index)), material: Color.CYAN.withAlpha(0.2)}}
        />}
    </Viewer>;
};

export default Body;