import React from "react";
import PlotlyChart from "react-plotlyjs-ts";
import {
  plotdata,
  plotlayout,
} from "../../pages/selected-repo-pr-analytics/selected-repo-pr-analytics.component";

interface prPlotProps {
  data: plotdata[];
  layout: plotlayout;
}

const PrPlot: React.FC<prPlotProps> = ({ data, layout }) => {
  return <PlotlyChart data={data} layout={layout} />;
};
export default PrPlot;
