import React from "react";
import PlotlyChart from "react-plotlyjs-ts";
import { plotdata } from "./pr.component";

interface prPlotProps {
  data: plotdata[];
}

const PrPlot: React.FC<prPlotProps> = ({ data }) => {
  return (
    <PlotlyChart
      data={data}
      layout={{
        width: 800,
        height: 400,
        title: "Pull requests per day",
      }}
    />
  );
};
export default PrPlot;
