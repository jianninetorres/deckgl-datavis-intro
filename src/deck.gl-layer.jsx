// hook component to load the layers in app.jsx

import { ColumnLayer } from "deck.gl";
import { scaleLinear } from "d3-scale";

export const RenderLayers = (props) => {
  let maxActive, minActive; // elevation of the columns
  const radiusColumns = 15000; // size of the columns
  const { data, onHover } = props;
  const value = data.map((a) => a.active);
  maxActive = Math.max(...value);
  minActive = Math.min(...value);
  const elevation = scaleLinear([minActive, maxActive], [0, 20000]);

  // id is used to match layers between rendering calls. deck.gl requires each layer to have a unique id. A default id is assigned based on layer type, which means if you are using more than one layer of the same type (e.g. twoScatterplotLayers) you need to provide a custom id for at least one of them.

  return [
    new ColumnLayer({
      id: "cases",
      data,
      pickable: true,
      extruded: true,
      getPosition: (d) => d.coordinates, // GPS coordinates to each column so all countries that are fetched get their own column.
      diskResolution: 10,
      radius: radiusColumns,
      elevationScale: 50, // set the height of the columns
      getFillColor: [255, 165, 0],
      getElevation: (d) => elevation(d.active),
      onHover,
    }),
  ];
};
