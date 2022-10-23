import { useState, useEffect } from "react";
import { MainStateType ,UserProfileType} from "./mainState";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import registerdUsersService from "../service/registerdUsersService";

interface UserProfilePageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function UserProfile({ mainState, setMainState }: UserProfilePageProps) {
  const { allUsersProfiles, user } = mainState;
  const profile: UserProfileType | any = allUsersProfiles.find(
    (u) => u.userid === user?.id
  );
  const [publishednameen, setPublishednameen] = useState("");
  const [publishednamear, setPublishednamear] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!profile) return;
    setPublishednameen(profile.publishednameen);
    setPublishednamear(profile.publishednamear);
    setLogo(profile.logo);
  }, [user]);
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      {profile && (
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
            <Avatar sx={{ m: 1, width: 120, height: 140 }} src={logo} />

            <Typography component="h1" variant="h5">
              Profile
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="published name English"
                name="publishednameen"
                onChange={(e) => setPublishednameen(e.target.value)}
                value={publishednameen}
              />
              <TextField
                margin="normal"
                fullWidth
                label="published name Arabic"
                name="publishednamear"
                onChange={(e) => setPublishednamear(e.target.value)}
                value={publishednamear}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Logo"
                name="publishednamear"
                onChange={(e) => setLogo(e.target.value)}
                value={logo}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={async () => {
                  setLoading(true);
                  profile.publishednameen = publishednameen;
                  profile.publishednamear = publishednamear;
                  profile.logo = logo;
                  await registerdUsersService._save(profile);
                  setLoading(false);
                  mainState.render = "profile";
                  setMainState({ ...mainState });
                }}
              >
                {loading ? <CircularProgress color="warning"/> : "Save"}
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </ThemeProvider>
  );
}
