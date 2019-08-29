jest.mock('../node_modules/cesium/index', () => ({
    Cartesian3: {
        fromDegrees: () => {}
    },
    Cartographic: {
        fromCartesian: () => {}
    },
    ScreenSpaceEventType: {}
}));
jest.mock('../node_modules/requirejs/bin/r', () => { });
import {random, Body} from '../src/components/Body.js';

describe('Example', () => {
    test('can pass', () => {
        expect(true).toBe(true);
        console.log(random())
    });
});