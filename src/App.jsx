import React, { useEffect, useState } from "react";
import DeckGL from "deck.gl";
import StaticMap from "react-map-gl";
import axios from "axios";
import { RenderLayers } from "./deck.gl-layer.jsx";

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
    axios
      .all([axios.get("https://disease.sh/v2/countries?allowNull=false")])
      .then(
        axios.spread((World) => {
          let data = World.data || [];
          data = data.map(function (location) {
            return {
              active: location.active,
              country: location.country,
              continent: location.continent,
              coordinates: [
                location.countryInfo.long,
                location.countryInfo.lat,
              ],
            };
          });
          data = data.filter((location) => location.continent === "Europe");
          setDataset(data);
        })
      )
      .catch((error) => {
        console.log(error);
        return [];
      });
  };

  console.log(dataset);

  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={RenderLayers({ data: dataset })}
      />
      <StaticMap mapStyle={mapStyle} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
    </div>
  );
};

export default App;
