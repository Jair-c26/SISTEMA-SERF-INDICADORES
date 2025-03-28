import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const FunctionCaseCard = ({ number, description }) => {
    return (
        <Box sx={{ backgroundColor: '#152B52', fontSize: '0.75rem', fontWeight: '500', borderRadius: '8px', padding: '20px', color: 'white' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{number}</span>
            <p>{description}</p>
        </Box>
    );
};

FunctionCaseCard.propTypes = {
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired
};

export default FunctionCaseCard;
