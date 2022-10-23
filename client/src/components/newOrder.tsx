import { MainStateType, UserOrderType } from "./mainState";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { toast } from "react-toastify";
import usersOrdersService from "../service/usersOrdersService";
interface NewOrderFormPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function NewOrderFormPage({
  mainState,
  setMainState,
}: NewOrderFormPageProps) {
  const [clientname, setClientname] = useState(
    mainState.currentOrder ? mainState.currentOrder.clientname : ""
  );
  const [clienttel, setclienttel] = useState(
    mainState.currentOrder ? mainState.currentOrder.clienttel : ""
  );
  const [startdate, setStartdate] = useState(
    mainState.currentOrder ? mainState.currentOrder.startdate : ""
  );
  const [loading, setLoading] = useState(false);
  const theme = createTheme();
  console.log("mainState.selectedUser", mainState.selectedUser);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            New Order Form
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              fullWidth
              label={"client name"}
              variant="outlined"
              onChange={(e) => setClientname(e.target.value)}
              value={clientname}
            />
            <TextField
              margin="normal"
              fullWidth
              label={"client Tel"}
              variant="outlined"
              onChange={(e) => setclienttel(e.target.value)}
              value={clienttel}
            />
            <TextField
              margin="normal"
              disabled
              fullWidth
              label={"Date"}
              variant="outlined"
              onChange={(e) => setStartdate(mainState.currentOrder?.startdate)}
              value={startdate}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={async () => {
                setLoading(true);
                if (!mainState.currentOrder) {
                  mainState.currentOrder = {
                    id: 0,
                    clientname: clientname,
                    clienttel: clienttel,
                    startdate: new Date().toString(),
                    userprofileid: mainState.selectedUser!.id,
                    userProducts: [],
                  };
                }
                setMainState({ ...mainState });
                try {
                  const res = await usersOrdersService._save(
                    mainState.currentOrder
                  );
                  if (res && res.insertId && mainState.currentOrder.id == 0) {
                    mainState.currentOrder.id = res.insertId;
                    mainState.render = "userProductCard";
                  }
                  mainState.currentOrder.clientname = clientname;
                  mainState.currentOrder.clienttel = clienttel;
                  mainState.currentOrder.startdate = startdate;
                  mainState.render = "userProductCard";
                  mainState.currentOrder = { ...mainState.currentOrder };
                  setMainState({ ...mainState });
                } catch (error) {
                  toast.error("order id error");
                }
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
