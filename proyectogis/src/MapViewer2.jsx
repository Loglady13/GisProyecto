import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

function Mapa() {
  const [showModal, setShowModal] = useState(false);
  const [objetos, setObjetos] = useState([]);
  const [selectedGeometry, setSelectedGeometry] = useState(null);
  const [availableGeometries, setAvailableGeometries] = useState([]);

  const [formData, setFormData] = useState({
    cultivo: '',
    area: '',
    num_subdivisiones: ''
  });

  const validarCampos = () => {
    let cultivoInput = document.getElementById("cultivo").value;
    let areaInput = document.getElementById("area").value;
    let num_subdivisionesInput = document.getElementById("num_subdivisiones").value;

    let validar = false;

    if (cultivoInput !== '' || areaInput !== '' || num_subdivisionesInput !== ''){
      validar = true;
      console.log(cultivoInput, areaInput, num_subdivisionesInput);
      console.log('Datos aceptados')
      return validar;
    } else {
      console.log('Datos no aceptados')
      return validar;
    }

  }

  const enviarDatos = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/crearform', formData);
      const { area, num_subdivisiones } = response.data;
      const cortes = Array.from({ length: num_subdivisiones }, () => Math.ceil(area / num_subdivisiones));
      const cortesData = {
        geometria: selectedGeometry,
        cortes: cortes
      };

      var select = document.getElementById("select");
      var selectValue = select.value;

      if( validarCampos ){
        if( selectValue  === "value1"){
          const {data} = await axios.post('http://localhost:5000/api/cortes_verticales', cortesData);
          console.log(data);
          setObjetos(data);
          setFormData({
            cultivo: '',
            area: '',
            num_subdivisiones: ''
          });
          setShowModal(false); 
        } else {
          const {data} = await axios.post('http://localhost:5000/api/cortes_horizontales', cortesData);
          console.log(data);
          setObjetos(data);
          setFormData({
            cultivo: '',
            area: '',
            num_subdivisiones: ''
          });
          setShowModal(false); 
        }
          
      } else {
        console.log('Campos deben de estar completos.')
      }
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
    async function fetchGeom() {
      try {
        const response = await axios.get('http://localhost:5000/api/geom');
        setAvailableGeometries(response.data);
      } catch (error) {
        console.error('Error fetching geometries:', error);
      }
    }

    fetchGeom();
  }, []);

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

  const handleOpenModal = (selectedGeom) => {
    setSelectedGeometry(null);
    const {id} = selectedGeom; // Assuming the id is available in selectedGeom
    const foundGeometry = availableGeometries.find(geometry => geometry.id === id);
    console.log('Hola',foundGeometry);
    if (foundGeometry) {
      setSelectedGeometry(foundGeometry.geom);
      setShowModal(true);
    } else {
      console.error('No se encontró la geometría para el ID seleccionado:', id);
    }
    setShowModal(true);
    setFormData({
      cultivo: '',
      area: '',
      num_subdivisiones: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div id="mapa" style={{ textAlign: 'center' }}>
      <svg id="svg" width="800" height="600" viewBox="443698.75456394313 -1146566.6288744938 872.5160287136096 598.7469839074183">
        {objetos.map((objeto, index) => (
          <path key={objeto.id} d={objeto.svg} id={objeto.id} stroke="black" className="objeto_espacial" fill="rgba(29,94,5, 0.5)" strokeWidth="1.090645035892012" onClick={() => handleOpenModal(objeto)} />
        ))}
      </svg>
      {showModal && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Figura seleccionada, ¿qué desea sembrar?</h2>
            <form classname="formulario">
              <select name="select" id="select">
                  <option value="value1">Verticales</option>
                  <option value="value2">Horizontales</option>
              </select>
              <div classname="input-group">
                  <label htmlFor="cultivo">Cultivo:</label>
                  <input type="text" id="cultivo" name="cultivo" value={formData.cultivo} onChange={handleInputChange} />
              </div>
              <div classname="input-group">
                  <label htmlFor="area">Área aproximada a llenar:</label>
                  <input type="number" id="area" name="area" value={formData.area} onChange={handleInputChange} />
              </div>
              <div classname="input-group">
                  <label htmlFor="num_subdivisiones">Número de subdivisiones:</label>
                  <input type="number" id="num_subdivisiones" name="num_subdivisiones" value={formData.num_subdivisiones} onChange={handleInputChange} />
              </div>
              <button type='button' onClick={enviarDatos}>Enviar</button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default Mapa;
