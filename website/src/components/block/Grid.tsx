import dynamic from "next/dynamic";
import { FC } from "react";

const Grid2 = dynamic(() => import("@mui/material/Unstable_Grid2/Grid2"), {
  ssr: false,
});

type Props = React.ComponentProps<typeof Grid2>;

const Grid: FC<Props> = (props) => {
  return <Grid2 {...props} />;
};
export default Grid;
