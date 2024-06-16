import { Dialog, DialogTitle, styled } from "@mui/material";
import { FC, ReactNode } from "react";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "rgba(28,37,71,0.9)",
    border: "2px solid #80B0D8",
    borderRadius: 0,
    color: "#F6F9FA",
    outline: "1px solid #80B0D8",
    outlineOffset: 2,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const UserSettingDialog: FC<{
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}> = (props) => {
  const { open, onClose, children } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <StyledDialog onClose={handleClose} open={open}>
        <DialogTitle>Setting</DialogTitle>
        {children}
      </StyledDialog>
    </>
  );
};
export default UserSettingDialog;
