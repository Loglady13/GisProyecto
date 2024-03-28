import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

function Mapa() {
  const [showModal, setShowModal] = useState(false);
  const [objetos, setObjetos] = useState([]);

  const [formData, setFormData] = useState({
    cultivo: '',
    area: '',
    num_subdivisiones: ''
  });

  const enviarDatos = async () => {
    try {
      // Resto del código para enviar datos
      const response = await fetch('http://localhost:5000/api/crearform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
           });
           setFormData({
            cultivo: '',
            area: '',
            num_subdivisiones: ''
        });   
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    async function fetchObjetos() {
      try {
        const response = await axios.get('http://localhost:5000/api/objetos');
        setObjetos(response.data);
      } catch (error) {
        console.error('Error fetching objetos:', error);
      }
    }

    fetchObjetos();
  }, []);

    const handleOpenModal = () => {
        
        setShowModal(false);
        setFormData({
            cultivo: '',
            area: '',
            num_subdivisiones: ''
        });
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
        {objetos.map((objeto, index) => (
          <path key={index} d={objeto.svg} stroke="black" className="objeto_espacial" fill="rgba(29,94,5, 0.5)" strokeWidth="1.090645035892012" />
        ))}
      </svg>
      {showModal && (
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Figura seleccionada, ¿qué desea sembrar?</h2>
                        <form>
                            <label htmlFor="cultivo">Cultivo:</label>
                            <input type="text" id="cultivo" name="cultivo" value={formData.cultivo} onChange={handleInputChange} /><br/><br/>
                            <label htmlFor="area">Área aproximada a llenar:</label>
                            <input type="number" id="area" name="area" value={formData.area} onChange={handleInputChange} /><br/><br/>
                            <label htmlFor="subdivisiones">Número de subdivisiones:</label>
                            <input type="number" id="num_subdivisiones" name="num_subdivisiones" value={formData.num_subdivisiones} onChange={handleInputChange} /><br/><br/>
                            <button onClick={enviarDatos}>Enviar</button>
                        </form>
                    </div>
                </div>
            )}
    </div>

  );
}

export default Mapa;
