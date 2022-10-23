import React from "react";
import TextField from "@mui/material/TextField";

function MyTextField(props: any) {
  const { setValue } = props;
  return (
    <div className="row m-2">
      <TextField
        {...props}
        variant="filled"
        color="success"
        onChange={(e) => setValue(e.target.value)}
        fullWidth
      />
    </div>
  );
}

export default MyTextField;
