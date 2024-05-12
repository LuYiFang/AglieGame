import React, { FC } from "react";
import Plot from "./Plot";

const RadarChart: FC<{
  data: any[];
}> = ({ data }) => {
  return (
    <Plot
      data={data}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
      layout={{
        autosize: true,
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: {
          t: 30,
          b: 30,
          l: 30,
          r: 30,
        },
        polar: {
          bgcolor: "rgba(0,0,0,0)",
          radialaxis: {
            visible: true,
            range: [0, 5],
          },
          angularaxis: {
            visible: true,
          },
        },
      }}
    />
  );
};
export default RadarChart;
