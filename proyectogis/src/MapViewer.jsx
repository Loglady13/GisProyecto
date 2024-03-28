import './App.css';
import React, { useEffect, useState } from 'react'; 


const MapViewer = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        cargarFigura();
    }, []);

    const cargarFigura = () => {
        fetch('http://localhost:5000/api/objetos')
            .then(response => response.json())
            .then(data => {
                verMapa(800, 600, data);
            })
            .catch(error => console.error('Error cargando figura:', error));
    };

    const verMapa = (width, height, geometrias) => {
        const svg = crearSVG(width, height, geometrias.dimensiones[0]);
        const ancho = parseFloat(geometrias.dimensiones[0].ancho);
        const alto = parseFloat(geometrias.dimensiones[0].alto);
        const anchoProporcional = alto > ancho ? alto / height : ancho / width;
        crearPath(svg, geometrias.objetos, anchoProporcional);
        document.getElementById("mapa").appendChild(svg);
    };

    const crearSVG = (width, height, dimensiones) => {
        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute('id', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        const vb = `${dimensiones.xmin} ${dimensiones.ymax} ${dimensiones.ancho} ${dimensiones.alto}`;
        svg.setAttribute('viewBox', vb);
        return svg;
    };

    const generarNumero = numero => (Math.random() * numero).toFixed(0);

    const colorRGB = () => {
        const color = `(${generarNumero(255)},${generarNumero(255)},${generarNumero(255)}, 0.5)`;
        return "rgba" + color;
    };

    const crearPath = (svg, geometrias, anchoProporcional) => {
        const xmlns = "http://www.w3.org/2000/svg";
        for (let geom in geometrias) {
            const figura = document.createElementNS(xmlns, "path");
            figura.setAttribute("d", geometrias[geom].svg);
            figura.setAttribute("stroke", "black");
            figura.setAttribute("class", "objeto_espacial");
            figura.setAttribute("fill", colorRGB());
            figura.setAttribute("stroke-width", anchoProporcional);
            svg.appendChild(crearGrupoSVG(figura, geometrias[geom].nombre));
        }
    };

    const crearGrupoSVG = (svg, descripcion) => {
        const xmlns = "http://www.w3.org/2000/svg";
        const grupo = document.createElementNS(xmlns, "g");
        const titulo = document.createElementNS(xmlns, "title");
        titulo.innerHTML = descripcion;
        grupo.appendChild(titulo);
        grupo.appendChild(svg);
        return grupo;
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const objects = document.querySelectorAll('.objeto_espacial');
        objects.forEach(object => {
            object.addEventListener('click', handleOpenModal);
        });
        return () => {
            objects.forEach(object => {
                object.removeEventListener('click', handleOpenModal);
            });
        };
    }, []);

    return (
        <div id="mapa" style={{ textAlign: 'center' }}>
             <svg id="svg" width="800" height="600" viewBox="443698.75456394313 -1146566.6288744938 872.5160287136096 598.7469839074183">
                <g>
                    <title>undefined</title>
                    <path d="M 444548.3991 -1146152.3802 l -19.5281 17.4309 -41.8538 24.0959 -124.3618 76.3501 15.2375 25.8112 -34.4082 19.4375 24.6986 18.1105 8.4383 3.2622 31.5778 -9.4928 57.9106 -7.6234 4.0146 3.8642 74.2087 -16.5316 -2.3552 
                    -35.9429 5.0808 -34.5098 9.0759 -18.4627 4.6487 -15.6272 7.66 -12.9828 2.8271 -7.9143 -7.0101 -16.4579 -8.2227 -12.3989 z" stroke="black" class="objeto_espacial" fill="rgba(29,94,5, 0.5)" stroke-width="1.090645035892012"></path>
                </g>
                <g>
                    <title>undefined</title>
                    <path d="M 444379.8267 -1146149.7046 l 36.7217 42.546 15.3995 -12.7674 1.2077 -0.9118 14.9463 -12.1589 33.8073 -20.9614 30.7993 -25.6871 -39.7333 -44.9872 -27.4652 15.0324 -16.1641 19.4666 -10.2717 11.8619 
                    -21.4355 15.8034 z" stroke="black" class="objeto_espacial" fill="rgba(29,94,5, 0.5)" stroke-width="1.090645035892012"></path>
                </g>
                <g>
                    <title>undefined</title>
                    <path d="M 444431.9479 -1146119.926 l 16.9939 27.5145 18.2623 -11.4684 -19.1022 -29.1168 z" stroke="black" class="objeto_espacial" fill="rgba(29,94,5, 0.5)" stroke-width="1.090645035892012"></path></g>
                <g>
                    <title>undefined</title>
                    <path d="M 443787.0002 -1146446.8496 l 55.7574 -75.2911 -64.3183 -38.784 -10.277 15.0596 -32.8354 -20.7638 
                    -36.5723 52.4792 z" stroke="black" class="objeto_espacial" fill="rgba(29,94,5, 0.5)" stroke-width="1.090645035892012"></path>
                </g>
            </svg>
            {showModal && (
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Figura seleccionada, ¿qué desea sembrar?</h2>
                        <form>
                            <label htmlFor="cultivo">Cultivo:</label>
                            <input type="text" id="cultivo" name="cultivo" /><br/><br/>
                            <label htmlFor="area">Área aproximada a llenar:</label>
                            <input type="text" id="area" name="area" /><br/><br/>
                            <label htmlFor="subdivisiones">Número de subdivisiones:</label>
                            <input type="number" id="subdivisiones" name="subdivisiones" /><br/><br/>
                            <input type="submit" value="Enviar" />
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapViewer;
