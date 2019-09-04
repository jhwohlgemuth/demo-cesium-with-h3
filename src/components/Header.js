import React, {useState, useEffect} from 'react';

const Header = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const counter = setInterval(() => setCount(count + 1), 1000);// eslint-disable-line no-magic-numbers
        return () => clearInterval(counter);
    });
    return <header>
        <p><a href={'https://resium.darwineducation.com/'}>Resium</a> + <a href={'https://github.com/uber/h3-js'}>H3</a> Demo</p>
        <p>click a point to see its associated hexagon and all other points in the hexagon</p>
    </header>;
};

export default Header;