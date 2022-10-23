import { MainStateType, UsersOrdersProductType } from "./mainState";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import userProductsOrdersService from "../service/userProductsOrdersService";
import { IconButton } from "rsuite";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
interface CurrentorderProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function Currentorder({ mainState, setMainState }: CurrentorderProps) {
  const { currentOrder } = mainState;
  const userProfile = mainState.allUsersProfiles.find(
    (up) => up.id === currentOrder.userprofileid
  );

  const getTotalPrice = ({ currentOrder }: any) => {
    let totalPrice = 0;
    const arr = currentOrder.userProducts;
    if (!arr) return totalPrice;
    arr.forEach((productOrder: any) => {
      totalPrice += productOrder.quantity * productOrder.unitprice;
    });
    return totalPrice;
  };
  return (
    <div>
      <div
        className="container"
        style={{ marginTop: "5%", marginBottom: "5%" }}
      >
        <div className="row" style={{ marginBottom: "5%" }}>
          <span className="mx-2">
            Name Company : {userProfile?.publishednameen}
          </span>
          <span className="mx-2">Name Client : {currentOrder.clientname}</span>
          <span className="mx-2">Phone : {currentOrder.clienttel}</span>
          <span className="mx-2">Start Date :{currentOrder.startdate}</span>
        </div>
        <div className="row">
          <TableContainer>
            <Table aria-label="simple table">
              <caption style={{ textAlign: "right" }}>
                Total : {getTotalPrice({ currentOrder })}
              </caption>
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
        </div>
      </div>
    </div>
  );
}

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
