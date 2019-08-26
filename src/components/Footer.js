import React from 'react';
import PropTypes from 'prop-types';

const links = {
    tomo: 'https://github.com/jhwohlgemuth/tomo-cli',
    ninalimpi: 'https://twitter.com/ninalimpi',
    undraw: 'https://undraw.co/',
    forgetica: 'https://www.sansforgetica.rmit/'
};

const Footer = ({name}) => <footer>
</footer>;

Footer.propTypes = {
    name: PropTypes.string
};

export default Footer;