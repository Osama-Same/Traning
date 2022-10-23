import { useState } from "react";
import { getCurrentUser, loginUser } from "../service/userService";
import CircularProgress from "@mui/material/CircularProgress";
import { updateUserState } from "./users";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MainStateType } from "./mainState";
interface LoginPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function LoginPage({ mainState, setMainState }: LoginPageProps) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label={"User Name"}
              variant="outlined"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <TextField
              margin="normal"
              fullWidth
              label={"Password"}
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={async () => {
                const user = { name: userName, password: password };
                setLoading(true);
                await loginUser(user);
                const _user: any = await getCurrentUser();
                setLoading(false);
                mainState.user = _user;
                updateUserState(mainState, setMainState);
              }}
            >
              {loading ? <CircularProgress color="inherit" /> : "Login"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
