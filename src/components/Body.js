import React, {useState} from 'react';
import Cesium, {Cartesian3, Cartographic, Color} from 'cesium';
import {Entity, Viewer} from 'resium';
import {geoToH3, h3ToGeoBoundary, h3IsValid} from 'h3-js';
const {fromDegrees, fromElements, fromDegreesArray} = Cartesian3;
const {fromCartesian} = Cartographic;

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxN2I2N2RkNi1iZjIyLTRjMTItOWU3NS01YTFhYzkxZmE2ZjgiLCJpZCI6MTUxMTYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjcxMjgyMzV9.nEwUTSZ5eViYDZpFGv0r_4y_feyu_rECyNS0uEtsSz4'; // eslint-disable-line max-len

const MAX_LAT = 90;
const MAX_LON = 180;
const LATITUDE_RANGE = [-MAX_LAT, MAX_LAT];
const LONGITUDE_RANGE = [-MAX_LON, MAX_LON];

function* range(max) {
    let index = 0;
    while (index < max) {
        yield index++;
    }
}
export const random = (min = 0, max = 1) => Math.random() * (max - min) + min;
const randomLatitude = () => Number(random(...LATITUDE_RANGE).toFixed(2));
const randomLongitude = () => Number(random(...LONGITUDE_RANGE).toFixed(2));
const generateRandomPositions = n => [...range(n)].map(() => fromDegrees(randomLongitude(), randomLatitude(), 0));
const randomPositions = generateRandomPositions(1000);

const Body = () => {
    let viewer;
    const [index, setIndex] = useState('');
    const [selected, setSelected] = useState([]);
    const TRANSPARENCY = 0.2;
    const material = Color.CYAN.withAlpha(TRANSPARENCY);
    const getBoundary = index => h3ToGeoBoundary(index)
        .map(([lat, lon]) => [lon, lat])
        .reduce((list, latLon) => [...list, ...latLon], []);
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
                        const idx = geoToH3(toDegrees(latitude), toDegrees(longitude));
                        return idx === newIndex;
                    })
                    .map(entity => entity.description._value);
                setSelected(ids);
                setIndex(newIndex);
            }
        }
    };
    return <Viewer
        full
        animation={false}
        infoBox={false}
        selectionIndicator={false}
        timeline={false} ref={e => viewer = e ? e.cesiumElement : undefined}>
        {randomPositions.map((position, index) => <Entity
            key={index}
            description={index}
            onClick={onClick}
            position={position}
            point={{
                pixelSize: 10,
                color: selected.includes(index) ? Color.DEEPPINK : Color.CYAN
            }}
        />)}
        {h3IsValid(index) && <Entity
            description="H3 Hexagon"
            polygon={{hierarchy: fromDegreesArray(getBoundary(index)), material}}
        />}
    </Viewer>;
};

export default Body;