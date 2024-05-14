import { Dialog, DialogTitle } from "@mui/material";
import { FC, ReactNode } from "react";

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
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Setting</DialogTitle>
        {children}
      </Dialog>
    </>
  );
};
export default UserSettingDialog;
