import { MainStateType } from "./mainState";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { IconButton } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import userProductsOrdersService from "../service/userProductsOrdersService";
import { toast } from "react-toastify";
const baseImagesURL = "http://www.tochangehybrid.com/groceriesImages/products/";

interface UserProductCardProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}

export function UserProductCard({
  mainState,
  setMainState,
}: UserProductCardProps) {
  const userProduct: any = mainState.userProfile?.userProducts;
  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <div className="row">
        {userProduct &&
          userProduct.map((_userProduct: any) => (
            <div className="col-md-4  pt-3 pb-3">
              <div className="card">
                <div className="card-header">
                  {mainState.language === "EN"
                    ? _userProduct.product.category.publishednameen
                    : _userProduct.product.category.publishednamear}
                </div>
                <img
                  src={`${baseImagesURL}${_userProduct.product.id}.jpg`}
                  className="card-img-top"
                  alt={_userProduct.product.image}
                  width="100"
                  height="200"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {mainState.language === "EN"
                      ? _userProduct.product.descriptionen
                      : _userProduct.product.descriptionar}
                  </h5>
                  <p className="card-text">
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={_userProduct.product.category.logo}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          mainState.language === "EN"
                            ? _userProduct.product.descriptionen
                            : _userProduct.product.descriptionar
                        }
                      />
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={_userProduct.product.brand.logo}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          mainState.language === "EN"
                            ? _userProduct.product.brand.nameen
                            : _userProduct.product.brand.namear
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={_userProduct.product.origin.flag}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          mainState.language === "EN"
                            ? _userProduct.product.origin.nameen
                            : _userProduct.product.origin.namear
                        }
                      />
                      <ListItemAvatar>
                        <IconButton aria-label="settings">
                          <Chip
                            label={
                              mainState.language === "EN"
                                ? `$${_userProduct.salesprice}${" "}${
                                    _userProduct.product.unit.nameen
                                  }`
                                : `$${_userProduct.salesprice}${" "}${
                                    _userProduct.product.unit.namear
                                  }`
                            }
                            color="primary"
                            variant="outlined"
                          />
                        </IconButton>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${_userProduct.product.quantity}`}
                      />
                    </ListItem>
                  </p>
                </div>
                {mainState && mainState.currentOrder && (
                  <div className="card-footer">
                    <BottomNavigation>
                      <Badge
                        badgeContent={
                          _userProduct.myOrder && _userProduct.myOrder.quantity
                        }
                        color="secondary"
                      >
                        <Button
                          title="Add to Cart"
                          onClick={async () => {
                            _userProduct.myOrder =
                              mainState.currentOrder?.userProducts.find(
                                (up: any) => up.id === _userProduct.id
                              );
                            if (_userProduct.myOrder) {
                              _userProduct.myOrder.quantity += 1;
                            } else {
                              _userProduct.myOrder = {
                                id: 0,
                                orderid: mainState.currentOrder?.id,
                                userproductid: _userProduct.id,
                                quantity: 1,
                                unitprice: _userProduct.salesprice,
                              };
                              const res = await userProductsOrdersService._save(
                                _userProduct.myOrder
                              );
                              if (_userProduct.myOrder.id == 0) {
                                _userProduct.myOrder.id = parseInt(
                                  res.insertId
                                );
                                mainState.currentOrder.userProducts = [
                                  _userProduct.myOrder,
                                  ...mainState.currentOrder.userProducts,
                                ];
                                setMainState({ ...mainState });
                              } else {
                                toast.error("Server Error");
                              }
                            }
                          }}
                        >
                          <BottomNavigationAction
                            icon={<AddShoppingCartIcon color="primary" />}
                          />
                          Add to Cart
                        </Button>
                      </Badge>
                    </BottomNavigation>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
