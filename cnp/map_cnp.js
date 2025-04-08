
  const map = L.map('map').setView([20.4326, -99.1332], 5)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3, maxZoom: 17,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  let geojsonLayer;
  let allFeatures = [];

  function get_link_pdf_dof(feauture) {
    if(feauture === "BAGRES_MARINOS") return '<a href = "DOF_CNP/BAGRES_MARINOS.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "CAMARON_CAFE") return '<a href = "DOF_CNP/CAMARON_CAFE.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "CAMARON_ROJO_Y_ROCA") return '<a href = "DOF_CNP/CAMARON_ROJO_Y_ROCA.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "CARACOLES") return '<a href = "DOF_CNP/CARACOLES.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "LANGOSTINOS") return '<a href = "DOF_CNP/LANGOSTINOS.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "MERO_Y_NEGRILLO") return '<a href = "DOF_CNP/MERO_Y_NEGRILLO.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "PEPINO_DE_MAR") return '<a href = "DOF_CNP/PEPINO_DE_MAR.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "PEZ_ESPADA") return '<a href = "DOF_CNP/PEZ_ESPADA.pdf" target="_blank"> <b> Ver  </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "PULPO") return '<a href = "DOF_CNP/PULPO.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "ROBALO_Y_CHUCUMITE") return '<a href = "DOF_CNP/ROBALO_Y_CHUCUMITE.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    return "";
}

  // Cargar GeoJSON
  fetch('./layers/recursos.geojson') 
    .then(res => res.json())
    .then(data => {
      allFeatures = data.features;

      // Llenar dropdown con recursos únicos
      const recursos = [...new Set(allFeatures.map(f => f.properties.recurso))];
      const select = document.getElementById('recursoSelect');
      recursos.forEach(r => {
        const option = document.createElement('option');
        option.value = r;
        option.textContent = r;
        select.appendChild(option);
      });

    });

  document.getElementById('recursoSelect').addEventListener('change', e => {
    const val = e.target.value;

    if (geojsonLayer) {
      geojsonLayer.remove(); // Eliminar capa anterior si existe
    }

    if (!val) {
      return; // Si se vuelve a seleccionar "vacío", no hacer nada
    }

    const filtrados = allFeatures.filter(f => f.properties.recurso === val);
    
    geojsonLayer = L.geoJSON(filtrados, {
      style: { color: '#ff1213', weight: 2 },
      onEachFeature: (feature, layer) => {
        const { estado, recurso, pdf } = feature.properties;
        layer.bindPopup(`
          <table class = "table-layer">
			    <thead>
                <tr>
                    <th> <b> IDENTIFICADOR </b> </th>
                    <th> <b> CLAVE </b></th>
                </tr>
          </thead>
          <tr>
          <th>Recurso:</th> <td> ${recurso}</td>
          </tr>
          <tr>
          <th>Estado:</th> <td> ${estado}</td>
          </tr>
          <tr>
          <th>DOP CNP:</th> <td>${get_link_pdf_dof(pdf)} </td>
          </tr>
          </table>
        `);
      }
    }).addTo(map);

    if (filtrados.length > 0) {
      const group = L.featureGroup(geojsonLayer.getLayers());
      map.fitBounds(group.getBounds());
    }
  })

  