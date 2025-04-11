
  const map = L.map('map').setView([31.8, -114.4], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 4, maxZoom: 17,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  let geojsonLayer;
  let allFeatures = [];
  let zonasAPRE;
  let zonasATC;
  let zonasPVM;

  const colorPuntos = {
    "Zona de crianza de elasmobranquios": "#377eb8",
  };

  const colorMap = {
    "Camaron": "#fdc086",
    "Chano": "#beaed4",
    "Curvina": "#ffff99",
    "Langosta": "#984ea3",
    "Sierra": "#f0027f"
  };

  const colorZonasAPRE = {
  "Área de prohibición de redes de enmalle": "#ffff00"
  };
  const colorZonasATC = {
  "Área de Tolerancia cero": "#ff0000"
  };
  const colorZonasPVM = {
  "Protección vaquita marina": "#00fa0c"
  };
  
  function get_link_cita(feauture) {
    if(feauture === "Camaron") return '<a href = "https://datamares.org/stories/comparando-actividades-pesqueras-de-dos-comunidades-en-el-alto-golfo-de-california/?lang=es" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "Chano") return '<a href = "https://datamares.org/stories/comparando-actividades-pesqueras-de-dos-comunidades-en-el-alto-golfo-de-california/?lang=es" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "Curvina") return '<a href = "https://datamares.org/stories/comparando-actividades-pesqueras-de-dos-comunidades-en-el-alto-golfo-de-california/?lang=es" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "Langosta") return '<a href = "https://www.gob.mx/cms/uploads/attachment/file/892410/CNP_2023.pdf" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    if(feauture === "Sierra") return '<a href = "https://revistas.uas.edu.mx/index.php/CIMAR" target="_blank"> <b> Ver </b>  <i class="fas fa-angle-double-right"></i></a>';
    return "";
}

// Leyenda
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'legend');
  div.innerHTML = '<strong>Polígonos </strong><br>';
  for (const pol in colorMap) {
    const color = colorMap[pol];
    div.innerHTML += `<i style="background:${color}"></i>${pol}<br>`;
  }

  //div.innerHTML += '<hr><strong>Zona de crianza de elasmobranquios</strong><br>';
  for (const tipo in colorPuntos) {
    div.innerHTML += `<i style="background:${colorPuntos[tipo]}"></i>${tipo}<br>`;
  }

  //div.innerHTML += '<hr><strong></strong><br>';
  for (const zona in colorZonasAPRE) {
    div.innerHTML += `<i style="background:${colorZonasAPRE[zona]}"></i>${zona}<br>`;
  }
  for (const zona in colorZonasATC) {
    div.innerHTML += `<i style="background:${colorZonasATC[zona]}"></i>${zona}<br>`;
  }
  for (const zona in colorZonasPVM) {
    div.innerHTML += `<i style="background:${colorZonasPVM[zona]}"></i>${zona}<br>`;
  }
  return div;
};


fetch("./layers/crianza_tiburon.geojson")
    .then(res => res.json())
    .then(data => {
      const puntosLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: "#377eb8",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function (feature, layer) {
          const props = feature.properties;
          layer.bindPopup(`
          <table class = "table-layer">
                <thead>
                <tr>
                    <th> <b> IDENTIFICADOR </b> </th>
                    <th> <b> CLAVE </b></th>
                </tr>
          </thead>
          <tr>
          <th>Especie:</th> <td> ${feature.properties.Especie}</td>
          </tr>
          <tr>
          <th>Tipo:</th> <td> ${feature.properties.Tipo}</td>
          </tr>
          <tr>
          <th>Talla maxima:</th> <td> ${feature.properties.Talla_max}</td>
          </tr>
          <tr>
          <th>Talla minima:</th> <td>${feature.properties.Talla_min} </td>
          </tr>
          </table>
          `);
        }
      }).addTo(map);
    });

fetch("./layers/area_prohibicion_redes_enmalle.geojson")
  .then(res => res.json())
  .then(data => {
    zonasAPRE = L.geoJSON(data, {
      style: feature => {
        const zona = feature.properties.Poligono;
        return {
          color: colorZonasAPRE[zona] || '#000',
          weight: 2,
          fillOpacity: 0.5
        };
      },
      onEachFeature: (feature, layer) => {
        const zona = feature.properties;
        layer.bindPopup(`
          <table class = "table-layer">
                <thead>
                <tr>
                    <th> <b> IDENTIFICADOR </b> </th>
                    <th> <b> CLAVE </b></th>
                </tr>
          </thead>
          <tr>
          <th>Polígono:</th> <td> ${feature.properties.Poligono}</td>
          </tr>
          <tr>
          <th>Zona:</th> <td> ${feature.properties.Zona}</td>
          </tr>
          </table>
          `);
      }
    });
    
    // No la agregamos por defecto, se puede activar desde el control
    zonasAPRE.addTo(map); 
  });

  fetch("./layers/proteccion_vaquita_marina.geojson")
  .then(res => res.json())
  .then(data => {
    zonasPVM = L.geoJSON(data, {
      style: feature => {
        const zona = feature.properties.Poligono;
        return {
          color: colorZonasPVM[zona] || '#000',
          weight: 2,
          fillOpacity: 0.5
        };
      },
      onEachFeature: (feature, layer) => {
        const zona = feature.properties;
        layer.bindPopup(`
          <table class = "table-layer">
                <thead>
                <tr>
                    <th> <b> IDENTIFICADOR </b> </th>
                    <th> <b> CLAVE </b></th>
                </tr>
          </thead>
          <tr>
          <th>Polígono:</th> <td> ${feature.properties.Poligono}</td>
          </tr>
          <tr>
          <th>Zona:</th> <td> ${feature.properties.Zona}</td>
          </tr>
          </table>
          `);
      }
    });
    zonasPVM.addTo(map); 
  });

  fetch("./layers/area_tolerancia_cero.geojson")
  .then(res => res.json())
  .then(data => {
    zonasATC = L.geoJSON(data, {
      style: feature => {
        const zona = feature.properties.Poligono;
        return {
          color: colorZonasATC[zona] || '#000',
          weight: 2,
          fillOpacity: 0.5
        };
      },
      onEachFeature: (feature, layer) => {
        const zona = feature.properties;
        layer.bindPopup(`
          <table class = "table-layer">
                <thead>
                <tr>
                    <th> <b> IDENTIFICADOR </b> </th>
                    <th> <b> CLAVE </b></th>
                </tr>
          </thead>
          <tr>
          <th>Polígono:</th> <td> ${feature.properties.Poligono}</td>
          </tr>
          <tr>
          <th>Zona:</th> <td> ${feature.properties.Zona}</td>
          </tr>
          </table>
          `);
      }
    });
    zonasATC.addTo(map); 
  });

  // Cargar poligonos
  fetch('./layers/poligonos.geojson') 
    .then(res => res.json())
    .then(data => {
      allFeatures = data.features;

      // Llenar dropdown con recursos únicos
      const recursos = [...new Set(allFeatures.map(f => f.properties.Poligono))];
      const select = document.getElementById('recursoSelect');
      recursos.forEach(r => {
        const option = document.createElement('option');
        option.value = r;
        option.textContent = r;
        select.appendChild(option);
      });

      legend.addTo(map);

    // Mostrar todos al inicio
    mostrarPoligonos(allFeatures);

    // Evento de filtro
    select.addEventListener('change', e => {
      const val = e.target.value;
      const filtrados = val === 'todos'
        ? allFeatures
        : allFeatures.filter(f => f.properties.Poligono === val);
      mostrarPoligonos(filtrados);
    });
  });

function mostrarPoligonos(features) {
  if (geojsonLayer) {
    geojsonLayer.remove();
  }

  geojsonLayer = L.geoJSON(features, {
    style: feature => {
        const Poligono = feature.properties.Poligono;
        return {
          color: colorMap[Poligono] || '#000',
          weight: 2,
          fillOpacity: 0.7
        };
      },
    onEachFeature: (feature, layer) => {
      const { Poligono, Especie, Zona } = feature.properties;
      layer.bindPopup(`
<table class = "table-layer">
      <thead>
      <tr>
          <th> <b> IDENTIFICADOR </b> </th>
          <th> <b> CLAVE </b></th>
      </tr>
</thead>
<tr>
<th>Polígono:</th> <td> ${Poligono}</td>
</tr>
<tr>
<th>Especie:</th> <td> ${Especie}</td>
</tr>
<tr>
<th>Zona:</th> <td> ${Zona}</td>
</tr>
<tr>
<th>Fuente:</th> <td>${get_link_cita(Poligono)} </td>
</tr>
</table>
`);
    }
  }).addTo(map);

  // Ajustar vista
  if (features.length > 0) {
    const group = L.featureGroup(geojsonLayer.getLayers());
    map.fitBounds(group.getBounds());
  }
}

var bounds_group = new L.featureGroup([]);
        function setBounds() {
        }
        map.createPane('pane_batimetria_mask_0');
        map.getPane('pane_batimetria_mask_0').style.zIndex = 200;
        var img_batimetria_mask_0 = './layers/batimetria.png';
        var img_bounds_batimetria_mask_0 = [[24.695833333,-115.683333333],[32.054166667,-107.295833333]];
        var layer_batimetria_mask_0 = new L.imageOverlay(img_batimetria_mask_0,
                                              img_bounds_batimetria_mask_0,
                                              {pane: 'pane_batimetria_mask_0'});
        bounds_group.addLayer(layer_batimetria_mask_0);
        map.addLayer(layer_batimetria_mask_0);
        setBounds();
        L.ImageOverlay.include({
            getBounds: function () {
                return this._bounds;
            }
        });
