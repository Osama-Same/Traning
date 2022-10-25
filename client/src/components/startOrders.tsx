import {
  MainStateType,
  UserOrderType,
  UsersOrdersProductType,
} from "./mainState";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import ArticleIcon from "@mui/icons-material/Article";
import usersProductsService from "../service/usersProductsService";
import usersOrdersService from "../service/usersOrdersService";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import { IconButton } from "rsuite";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import userProductsOrdersService from "../service/userProductsOrdersService";
interface AddOrdersProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}

export function AllOrdersPage({ mainState, setMainState }: AddOrdersProps) {
  const [selectedStartOrder, setSelectedStartOrder] =
    useState<UserOrderType | null>(null);
  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCurrentOrder, setSelectedCurrentOrder] =
    useState<UserOrderType | null>(null);
  const [loading, setloading] = useState(false);

  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">id</TableCell>
              <TableCell align="center">clientname</TableCell>
              <TableCell align="center">clienttel</TableCell>
              <TableCell align="center">userprofileid</TableCell>
              <TableCell align="center">startdate</TableCell>
              <TableCell align="center">OrderProduct</TableCell>
              <TableCell align="center">status</TableCell>
              <TableCell align="center">enddate</TableCell>
              <TableCell align="center">End Order</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainState.userProfile.startOrder.map((uo: any) => {
              return (
                <TableRow
                  key={uo.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{uo.id}</TableCell>
                  <TableCell align="center">{uo.clientname}</TableCell>
                  <TableCell align="center">{uo.clienttel}</TableCell>
                  <TableCell align="center">{uo.userprofileid}</TableCell>
                  <TableCell align="center">{uo.startdate}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      disabled={uo.status === 1}
                      color="primary"
                      onClick={() => {
                        setOpen(true);
                        mainState.currentOrder = uo;
                        mainState.currentOrder.userProducts.forEach(
                          (upo: any) => {
                            const userProduct =
                              mainState.userProfile.userProducts.find(
                                (up: any) => up.id == upo.userproductid
                              );
                            if (userProduct) userProduct.myOrder = upo;
                          }
                        );
                        setSelectedCurrentOrder((mainState.currentOrder = uo));
                        setMainState({ ...mainState });
                      }}
                    >
                      Order
                    </Button>
                  </TableCell>
                  <TableCell align="center">{uo.status}</TableCell>
                  <TableCell align="center">{uo.enddate}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        if (uo.status == 0) {
                          setMainState({ ...mainState });
                          uo.status = 1;
                          uo.enddate = new Date().toString();
                          await usersOrdersService._save(uo);
                          if (uo.userProducts) {
                            for (const userProductOrder of uo.userProducts) {
                              if (userProductOrder) {
                                const userProduct: any =
                                  userProductOrder.myUserProduct;
                                if (userProduct) {
                                  userProduct.quantity -=
                                    userProductOrder.quantity;
                                  await usersProductsService._save(userProduct);
                                }
                              }
                            }
                          }

                          setMainState({ ...mainState });
                        }
                      }}
                    >
                      <ArticleIcon />
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => {
                        setSelectedStartOrder(uo);
                        setopenConfirmDelDlg(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDeleteDialog
        open={openConfirmDelDlg}
        setopen={setopenConfirmDelDlg}
        text={`order ${
          selectedStartOrder && selectedStartOrder.clientname
        }  will be deleted permenantly, are you sure?`}
        onConfirm={async () => {
          if (!selectedStartOrder) return;
          setloading(true);
          await usersOrdersService._delete(selectedStartOrder.id);
          setloading(false);
          mainState.userProfile.startOrders =
            mainState.userProfile.startOrders.filter(
              (u: any) => u.id != selectedStartOrder.id
            );
          mainState.render = "startOrder";
          setMainState({ ...mainState });
        }}
      />
      {selectedCurrentOrder && (
        <UserTableProduct
          open={open}
          setOpen={setOpen}
          mainState={mainState}
          setMainState={setMainState}
          productOrder={selectedCurrentOrder}
        />
      )}
    </div>
  );
}

interface UserTableProductProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
  productOrder: UserOrderType | null | any;
}

const UserTableProduct = ({
  open,
  setOpen,
  mainState,
  setMainState,
  productOrder,
}: UserTableProductProps) => {
  if (!mainState.currentOrder) return <div>No Order</div>;
  const userProfile = mainState.allUsersProfiles.find(
    (up) => up.id == mainState.currentOrder.userprofileid
  );
  const { currentOrder } = mainState;

  if (!userProfile) return <div>No User Profile</div>;
  const userProducts = userProfile.userProducts;
 
  console.log("userProducts", userProducts);
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText>Name : {productOrder.clientname}</DialogContentText>
        <DialogContentText>Phone : {productOrder.clienttel}</DialogContentText>
        <DialogContentText>
          {" "}
          Date Started : {productOrder.startdate}
        </DialogContentText>
        <DialogContentText>Date End : {productOrder.enddate}</DialogContentText>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">id</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">brand</TableCell>
                <TableCell align="center">origin</TableCell>
                <TableCell align="center">Product</TableCell>
                <TableCell align="center">quantity</TableCell>
                <TableCell align="center">unitprice</TableCell>
                <TableCell align="center">Save</TableCell>
                <TableCell align="center">Delete</TableCell>
                <TableCell align="center">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrder.userProducts.map((productOrder: any) => {
                return (
                  <UserProductOrderTable
                    mainState={mainState}
                    setMainState={setMainState}
                    productOrder={productOrder}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
};

interface UserProductOrderTableProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
  productOrder: UsersOrdersProductType;
}
export function UserProductOrderTable({
  mainState,
  setMainState,
  productOrder,
}: UserProductOrderTableProps) {
  const [unitprice, setUnitPrice] = useState(
    productOrder ? productOrder.unitprice : 0
  );
  const [quantity, setQuantity] = useState(
    productOrder ? productOrder.quantity : 0
  );
  const [editMode, setEditMode] = useState(false);
  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!mainState.currentOrder) return <div>No Order</div>;
  const userProfile = mainState.allUsersProfiles.find(
    (up) => up.id == mainState.currentOrder.userprofileid
  );
  if (!userProfile) return <div>No User Profile</div>;
  const userProducts = userProfile.userProducts;
  const userproduct = userProducts.find(
    (up: any) => up.id == productOrder.userproductid
  );
  return (
    <TableRow
      key={productOrder.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="center">{productOrder.id}</TableCell>
      <TableCell align="center">
        {mainState.language == "EN"
          ? userproduct &&
            userproduct.product &&
            userproduct.product.category &&
            userproduct.product.category.publishednameen
          : userproduct &&
            userproduct.product &&
            userproduct.product.category &&
            userproduct.product.category.publishednamear}
      </TableCell>
      <TableCell align="center">
        {mainState.language == "EN"
          ? userproduct &&
            userproduct.product &&
            userproduct.product.brand &&
            userproduct.product.brand.nameen
          : userproduct &&
            userproduct.product &&
            userproduct.product.brand &&
            userproduct.product.brand.namear}
      </TableCell>
      <TableCell align="center">
        {mainState.language == "EN"
          ? userproduct &&
            userproduct.product &&
            userproduct.product.origin &&
            userproduct.product.origin.nameen
          : userproduct &&
            userproduct.product &&
            userproduct.product.origin &&
            userproduct.product.origin.namear}
      </TableCell>
      <TableCell align="center">
        {mainState.language == "EN"
          ? userproduct &&
            userproduct.product &&
            userproduct.product.descriptionen
          : userproduct &&
            userproduct.product &&
            userproduct.product.descriptionar}
      </TableCell>
      <TableCell align="center">
        {editMode ? (
          <div>
            {!mainState.userProfile ? (
              <TextField
                label="quantity"
                type="number"
                size="small"
                name="quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(parseInt(e.target.value));
                }}
              />
            ) : (
              <span>{productOrder.unitprice} </span>
            )}
          </div>
        ) : (
          <span> {productOrder.quantity}</span>
        )}
      </TableCell>
      <TableCell align="center">
        {editMode ? (
          <div>
            {mainState.userProfile ? (
              <span>
                <TextField
                  label="unitprice"
                  type="number"
                  size="small"
                  name="unitprice"
                  value={unitprice}
                  onChange={(e) => {
                    setUnitPrice(parseInt(e.target.value));
                  }}
                />
              </span>
            ) : (
              <span>{productOrder.unitprice} </span>
            )}
          </div>
        ) : (
          <span> {productOrder.unitprice}</span>
        )}
      </TableCell>
      <TableCell align="center">
        <IconButton
          onClick={async () => {
            if (editMode && quantity != productOrder.quantity) {
              setLoading(true);
              setMainState({ ...mainState });
              productOrder.quantity = quantity;
              await userProductsOrdersService._save(productOrder);
              setLoading(false);
              setMainState({ ...mainState });
            } else if (editMode && unitprice != productOrder.unitprice) {
              setLoading(true);
              setMainState({ ...mainState });
              productOrder.unitprice = unitprice;
              await userProductsOrdersService._save(productOrder);
              setLoading(false);
              setMainState({ ...mainState });
            }
            setEditMode(!editMode);
          }}
        >
          {editMode ? (
            <SaveIcon color="primary" />
          ) : (
            <EditIcon color="primary" />
          )}
        </IconButton>
      </TableCell>
      <TableCell align="center">
        <Button
          color="error"
          title="Delete Order"
          variant="contained"
          onClick={() => {
            setopenConfirmDelDlg(true);
            setMainState({ ...mainState });
          }}
        >
          Delete
        </Button>
      </TableCell>
      <TableCell align="center">
        {productOrder.unitprice * productOrder.quantity}
      </TableCell>
      <ConfirmDeleteDialog
        open={openConfirmDelDlg}
        setopen={setopenConfirmDelDlg}
        text={`Order  ${userproduct.product.category.publishednameen}  will be deleted permenantly, are you sure?`}
        onConfirm={async () => {
          if (!mainState.currentOrder) return;
          setLoading(true);
          mainState.currentOrder.userProducts =
            mainState.currentOrder.userProducts.filter(
              (up: any) => up.id != productOrder.id
            );
          await userProductsOrdersService._delete(productOrder.id);
          if (mainState.selectedUser && mainState.selectedUser.userProducts) {
            const userProduct = mainState.selectedUser.userProducts.find(
              (up: any) => up.id == productOrder.userproductid
            );
            if (userProduct && userProduct.myOrder) userProduct.myOrder = null;
          }
          setLoading(false);
          setMainState({ ...mainState });
        }}
      />
    </TableRow>
  );
}
