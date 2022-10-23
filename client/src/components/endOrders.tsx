import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import { MainStateType, UserOrderType } from "./mainState";
import { useState } from "react";
import Button from "@mui/material/Button";
import ArticleIcon from "@mui/icons-material/Article";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
interface EndOrderPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function EndOrderPage({ mainState, setMainState }: EndOrderPageProps) {
  const { endOrders } = mainState;
  const [open, setOpen] = useState(false);
  const [selectedEndOrder, setSelectedEndOrder] = useState(null);

  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* <caption style={{ textAlign: "right" }}>
          Total : {getTotalPrice({ order })}{" "}
        </caption> */}
          <TableHead>
            <TableRow>
              <TableCell align="center">id</TableCell>
              <TableCell align="center">clientname</TableCell>
              <TableCell align="center">clienttel</TableCell>
              <TableCell align="center">userprofileid</TableCell>
              <TableCell align="center">startdate</TableCell>
              <TableCell align="center">status</TableCell>
              <TableCell align="center">enddate</TableCell>
              <TableCell align="center">view Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {endOrders?.map((uo: any) => {
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
                  <TableCell align="center">{uo.status}</TableCell>
                  <TableCell align="center">{uo.enddate}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      title="viwe order"
                      onClick={() => {
                        setSelectedEndOrder(uo);
                        setOpen(true);
                      }}
                    >
                      <ArticleIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {selectedEndOrder && (
          <ViewOrder
            open={open}
            setOpen={setOpen}
            order={selectedEndOrder}
            mainState={mainState}
            setMainState={setMainState}
          />
        )}
      </TableContainer>
    </div>
  );
}
interface ViewOrderEndProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  order: UserOrderType;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}

export function ViewOrder({
  open,
  setOpen,
  order,
  mainState,
  setMainState,
}: ViewOrderEndProps) {
  const getTotalPrice = ({ order }: any) => {
    let totalPrice = 0;
    const arr = order.userProducts;
    if (!arr) return totalPrice;
    arr.forEach((productOrder: any) => {
      totalPrice += productOrder.quantity * productOrder.unitprice;
    });
    return totalPrice;
  };
  console.log("endOrder" ,order)
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      fullWidth
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText
          sx={{ marginBottom: "2%", color: "black", textAlign: "left" }}
        >
          Name : {order.clientname}
        </DialogContentText>
        <DialogContentText
          sx={{ marginBottom: "2%", color: "black", textAlign: "left" }}
        >
          Phone : {order.clienttel}
        </DialogContentText>
        <DialogContentText
          sx={{ marginBottom: "2%", color: "black", textAlign: "left" }}
        >
          Date Started : {order.startdate}
        </DialogContentText>
        <DialogContentText
          sx={{ marginBottom: "5%", color: "black", textAlign: "left" }}
        >
          Date End : {order.enddate}
        </DialogContentText>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <caption style={{ textAlign: "right" }}>
              Total : {getTotalPrice({ order })}
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
                <TableCell align="center">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.userProducts?.map((productOrder: any) => {
                return (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{productOrder.id}</TableCell>
                    <TableCell align="center">
                      {productOrder &&
                        productOrder.myUserProduct &&
                        productOrder.myUserProduct.product &&
                        productOrder.myUserProduct.product.category &&
                        productOrder.myUserProduct.product.category.nameen}
                    </TableCell>
                    <TableCell align="center">
                      {productOrder &&
                        productOrder.myUserProduct &&
                        productOrder.myUserProduct.product &&
                        productOrder.myUserProduct.product.category &&
                        productOrder.myUserProduct.product.brand.nameen}
                    </TableCell>
                    <TableCell align="center">
                      {productOrder &&
                        productOrder.myUserProduct &&
                        productOrder.myUserProduct.product &&
                        productOrder.myUserProduct.product.category &&
                        productOrder.myUserProduct.product.origin.nameen}
                    </TableCell>
                    <TableCell align="center">
                      {productOrder &&
                        productOrder.myUserProduct &&
                        productOrder.myUserProduct.product &&
                        productOrder.myUserProduct.product.descriptionen}
                    </TableCell>
                    <TableCell align="center">
                      {productOrder && productOrder.quantity}
                    </TableCell>
                    <TableCell align="center">
                      {productOrder && productOrder.unitprice}
                    </TableCell>
                    <TableCell align="center">
                      {productOrder.quantity * productOrder.unitprice}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
