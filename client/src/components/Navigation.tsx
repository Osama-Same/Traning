import NavDropdown from "react-bootstrap/NavDropdown";
import { MainStateType } from "./mainState";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { logOut } from "../service/userService";
import Avatar from "@mui/material/Avatar";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Badge from "@mui/material/Badge";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getCurrentUser } from "../service/userService";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { updateUserState } from "./users";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
import usersOrdersService from "../service/usersOrdersService";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const darkTheme = createTheme({
  palette: { mode: "dark" },
});
interface NavigationProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
const Navigation = ({ mainState, setMainState }: NavigationProps) => {
  const { user } = mainState;
  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      {user && user.authorization === "admin" && (
        <Box sx={{ flexGrow: 1, backgroundColor: "primary.dark" }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <NavDropdown title={"DataBase"} id="basic-nav-dropdown">
                <MenuItem
                  onClick={() => {
                    mainState.render = "origins";
                    setMainState({ ...mainState });
                  }}
                >
                  Origins
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    mainState.render = "brands";
                    setMainState({ ...mainState });
                  }}
                >
                  Brands
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    mainState.render = "units";
                    setMainState({ ...mainState });
                  }}
                >
                  Units
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    mainState.render = "categories";
                    setMainState({ ...mainState });
                  }}
                >
                  Categories
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    mainState.render = "products";
                    setMainState({ ...mainState });
                  }}
                >
                  Products
                </MenuItem>
              </NavDropdown>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {user.authorization}
              </Typography>
              <NavDropdown title={user.name} id="basic-nav-dropdown">
                <MenuItem
                  onClick={() => {
                    logOut();
                    window.location.href = "/";
                    setMainState({ ...mainState });
                  }}
                >
                  Logout
                </MenuItem>
              </NavDropdown>
            </Toolbar>
          </AppBar>
        </Box>
      )}
      {user && user.authorization === "user" && (
        <Box sx={{ flexGrow: 1, backgroundColor: "primary.dark" }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              <NavDropdown title={"DataBase"} id="basic-nav-dropdown">
                <MenuItem
                  onClick={() => {
                    mainState.render = "usersStore";
                    setMainState({ ...mainState });
                  }}
                >
                  Users Store
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    mainState.render = "products";
                    setMainState({ ...mainState });
                  }}
                >
                  Users Products
                </MenuItem>
              </NavDropdown>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => {
                    mainState.render = "usersCard";
                    setMainState({ ...mainState });
                  }}
                >
                  <Avatar
                    alt={mainState?.selectedUser?.logo}
                    src={mainState?.selectedUser?.logo}
                  />
                  {mainState?.selectedUser?.publishednameen}
                </Button>
              </Typography>
              {mainState.userProfile && (
                <div>
                  <Badge
                    badgeContent={
                      mainState?.userProfile?.endOrder &&
                      mainState.userProfile?.endOrder?.length
                    }
                    color="secondary"
                  >
                    <IconButton
                      title=" End Orders"
                      color="inherit"
                      onClick={() => {
                        mainState.render = "endOrders";
                        setMainState({ ...mainState });
                      }}
                    >
                      <ListAltIcon />
                    </IconButton>
                  </Badge>
                  <Badge
                    badgeContent={
                      mainState.userProfile.startOrder &&
                      mainState.userProfile.startOrder.length
                    }
                    color="secondary"
                  >
                    <IconButton
                      title="Orders"
                      color="inherit"
                      onClick={() => {
                        mainState.render = "startOrders";
                        setMainState({ ...mainState });
                      }}
                    >
                      <AddShoppingCartIcon />
                    </IconButton>
                  </Badge>
                </div>
              )}
              <Button
                color="inherit"
                onClick={() => {
                  mainState.language =
                    mainState.language === "EN" ? "AR" : "EN";
                  setMainState({ ...mainState });
                }}
              >
                {mainState.language === "EN" ? `AR` : `EN`}
              </Button>
              <NavDropdown title={user.name} id="basic-nav-dropdown">
                <MenuItem
                  onClick={() => {
                    mainState.render = "profile";
                    setMainState({ ...mainState });
                  }}
                >
                  Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    logOut();
                    window.location.href = "/";
                    setMainState({ ...mainState });
                  }}
                >
                  Logout
                </MenuItem>
              </NavDropdown>
            </Toolbar>
          </AppBar>
        </Box>
      )}

      {!user && (
        <Box sx={{ flexGrow: 1, backgroundColor: "primary.dark" }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Button
                color="inherit"
                onClick={async () => {
                  mainState.render = "usersCard";
                  const _user: any = await getCurrentUser();
                  mainState.user = _user;
                  setMainState({ ...mainState });
                  updateUserState(mainState, setMainState);
                }}
              >
                Home
              </Button>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => {
                    mainState.render = "usersCard";
                    setMainState({ ...mainState });
                  }}
                >
                  <Avatar
                    alt={mainState?.selectedUser?.logo}
                    src={mainState?.selectedUser?.logo}
                  />
                  {mainState?.selectedUser?.publishednameen}
                </Button>

                {mainState.selectedUser && (
                  <Button
                    color="inherit"
                    onClick={() => {
                      mainState.render = "userProductCard";
                      setMainState({ ...mainState });
                    }}
                  >
                    <Avatar
                      alt={mainState?.selectedUser?.logo}
                      src={mainState?.selectedUser?.logo}
                    />
                    Product
                  </Button>
                )}
              </Typography>

              <Button
                color="inherit"
                onClick={() => {
                  mainState.language =
                    mainState.language === "EN" ? "AR" : "EN";
                  setMainState({ ...mainState });
                }}
              >
                {mainState.language === "EN" ? `AR` : `EN`}
              </Button>
              {mainState.render !== "userProductCard" &&
                mainState.render !== "currentorder" && (
                  <div>
                    <Button
                      variant="text"
                      color="inherit"
                      onClick={() => {
                        mainState.render = "login";
                        setMainState({ ...mainState });
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="text"
                      color="inherit"
                      onClick={() => {
                        mainState.render = "register";
                        setMainState({ ...mainState });
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              {mainState.render === "userProductCard" && (
                <div>
                  {mainState.currentOrder ? (
                    <div>
                      <span className="mx-2" style={{ color: "white" }}>
                        {mainState.currentOrder.clientname}{" "}
                      </span>
                      <Badge
                        badgeContent={
                          mainState.currentOrder.userProducts &&
                          mainState.currentOrder.userProducts.length
                        }
                        color="primary"
                      >
                        <IconButton
                          title="Shopping Cart "
                          color="inherit"
                          onClick={() => {
                            mainState.render = "currentorder";
                            setMainState({ ...mainState });
                          }}
                        >
                          <AddShoppingCartIcon />
                        </IconButton>
                      </Badge>
                      <Button
                        color="error"
                        title="Delete Order"
                        onClick={() => {
                          setopenConfirmDelDlg(true);
                          setMainState({ ...mainState });
                        }}
                      >
                        <RemoveShoppingCartIcon />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      color="inherit"
                      title="new Order"
                      onClick={async () => {
                        mainState.render = "neworder";
                        setMainState({ ...mainState });
                      }}
                    >
                      New Order
                    </Button>
                  )}
                </div>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      )}
      <ConfirmDeleteDialog
        open={openConfirmDelDlg}
        setopen={setopenConfirmDelDlg}
        text={`Order ${
          mainState.currentOrder && mainState.currentOrder.clientname
        }  will be deleted permenantly, are you sure?`}
        onConfirm={async () => {
          if (!mainState.currentOrder) return;
          setMainState({ ...mainState });

          await usersOrdersService._delete(mainState.currentOrder.id);
          mainState.currentOrder.userProducts.forEach((upo: any) => {
            const userProduct = mainState?.selectedUser?.userProducts.find(
              (up: any) => up.id == upo.userproductid
            );
            if (userProduct && userProduct.myOrder) userProduct.myOrder = null;
          });

          mainState.currentOrder = null;
          setMainState({ ...mainState });
        }}
      />
    </ThemeProvider>
  );
};

export default Navigation;
