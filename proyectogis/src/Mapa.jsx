import React, { useEffect } from 'react';

const Mapa = () => {
    useEffect(() => {
        cargarFigura();
    }, []);

    const cargarFigura = () => {
        
    };

    return (
        <div id="mapa" style={{ textAlign: 'center' }}>
            {/* Aquí puedes renderizar el SVG */}
        </div>
    );
};

export default Mapa;
