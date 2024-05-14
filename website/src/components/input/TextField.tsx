import { InputBase, styled } from "@mui/material";
import { FC } from "react";

type Props = React.ComponentProps<typeof InputBase>;

const SearchInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    margin: "0.44px 0 0.44px 0",
    padding: theme.spacing(0, 0, 0, 0),
    transition: theme.transitions.create("width"),
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: theme.palette.text.primary,
    "-webkit-text-fill-color": theme.palette.text.primary,
  },
}));

const TextField: FC<Props> = (props) => {
  return <SearchInputBase size="small" autoFocus {...props} />;
};
export default TextField;
