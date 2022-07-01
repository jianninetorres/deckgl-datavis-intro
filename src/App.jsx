import React, { useEffect, useState } from "react";
import DeckGL from "deck.gl";
import StaticMap from "react-map-gl";
import axios from "axios";
import { RenderLayers } from "./deck.gl-layer.jsx";

// renders the map layer below the columnlayer
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoianRvcmxlc3AiLCJhIjoiY2w1MXR0Y2xtMDVvbTNkbjk2eHcxN3g3YSJ9.YgC4FjfuvC23H7kh0fg6lg";
const mapStyle = "mapbox://styles/jtorlesp/cl51tnhls004b14qfsua2jxy2";

const INITIAL_VIEW_STATE = {
  longitude: 12.8333,
  latitude: 42.8333,
  zoom: 4,
  maxZoom: 16,
  minZoom: 4,
  pitch: 60, // map angle; 0 = top-down view
  bearing: 5, // direction it. North = 0
};

const App = () => {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    // https://medium.com/weekly-webtips/an-introduction-into-deck-gl-f5c8ae84d9a5

    // axios.all and axios.spread are deprecated
    try {
      Promise.all([
        axios.get("https://disease.sh/v2/countries?allowNull=false"),
      ]).then((res) => {
        let data = res[0].data || [];
        data = data.map((location) => {
          return {
            active: location.active,
            country: location.country,
            continent: location.continent,
            coordinates: [location.countryInfo.long, location.countryInfo.lat],
          };
        });

        data = data.filter((location) => location.continent === "Europe");
        setDataset(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  console.log(dataset);

  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={RenderLayers({ data: dataset })}
      >
        <StaticMap
          mapStyle={mapStyle}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  );
};

export default App;
