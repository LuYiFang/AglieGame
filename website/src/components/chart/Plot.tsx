import dynamic from "next/dynamic";
import { FC } from "react";

const PlotOri = dynamic(() => import("react-plotly.js"), { ssr: false });

type Props = React.ComponentProps<typeof PlotOri>;

const Plot: FC<Props> = (props) => {
  return <PlotOri {...props} />;
};
export default Plot;
