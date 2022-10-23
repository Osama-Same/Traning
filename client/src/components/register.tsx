import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { MainStateType } from "./mainState";
import { registerUser } from "../service/userService";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
interface RegisterageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function RegisterPage({ mainState, setMainState }: RegisterageProps) {
  const theme = createTheme();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
            Register
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
              label={"Email"}
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <TextField
              margin="normal"
              fullWidth
              label={"Password"}
              type={"password"}
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                const user = {
                  name: userName,
                  email: email,
                  password: password,
                };
                setLoading(true);
                registerUser(user);
                setLoading(false);
              }}
            >
              {loading ? <CircularProgress color="inherit" /> : "Register"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
