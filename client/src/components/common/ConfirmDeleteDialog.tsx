import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
function ConfirmDeleteDialog({ open, setopen, text, onConfirm }: any) {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open}>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button onClick={() => setopen(false)}>NO</Button>
        <Button
          color="error"
          onClick={() => {
            setLoading(true);
            onConfirm();
            setLoading(false);
            setopen(false);
          }}
          autoFocus
        >
          {loading ? <CircularProgress /> : "YES"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;
