import { MainStateType, UserOrderType } from "./mainState";
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
import { Currentorder } from "./currentorder";
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
          currentOrder={selectedCurrentOrder}
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
  currentOrder: UserOrderType | null | any;
}

const UserTableProduct = ({
  open,
  setOpen,
  mainState,
  setMainState,
  currentOrder,
}: UserTableProductProps) => {
  console.log("currentOrder", currentOrder.userProducts);
  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogContent>
          <DialogContentText
            sx={{ marginBottom: "2%", color: "black", textAlign: "left" }}
          >
            Name : {currentOrder.clientname}
          </DialogContentText>
          <DialogContentText
            sx={{ marginBottom: "2%", color: "black", textAlign: "left" }}
          >
            Phone : {currentOrder.clienttel}
          </DialogContentText>
          <DialogContentText
            sx={{ marginBottom: "2%", color: "black", textAlign: "left" }}
          >
            Date Started : {currentOrder.startdate}
          </DialogContentText>
          <DialogContentText
            sx={{ marginBottom: "5%", color: "black", textAlign: "left" }}
          >
            Date End : {currentOrder.enddate}
          </DialogContentText>
        </DialogContent>
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
              {currentOrder.userProducts.map((productOrders: any) => {
                return (
                  <TableRow
                    key={productOrders.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{productOrders.id}</TableCell>
                    <TableCell align="center">
                      {productOrders.myUserProduct.product.category.nameen}
                    </TableCell>
                    <TableCell align="center">
                      {productOrders.myUserProduct.product.brand.nameen}
                    </TableCell>
                    <TableCell align="center">
                      {productOrders.myUserProduct.product.origin.nameen}
                    </TableCell>
                    <TableCell align="center">
                      {productOrders.myUserProduct.product.descriptionen}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </div>
  );
};
