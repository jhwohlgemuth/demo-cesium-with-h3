import React from 'react';
import PropTypes from 'prop-types';

const links = {
    tomo: 'https://github.com/jhwohlgemuth/tomo-cli'
};

const Footer = () => <footer>
    created with <span className="heart">❤</span> using <a href={links.tomo}>tomo</a>
</footer>;

Footer.propTypes = {
    name: PropTypes.string
};

export default Footer;