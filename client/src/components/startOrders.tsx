import { MainStateType ,UserOrderType } from "./mainState";
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

interface AddOrdersProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}

export function AllOrdersPage({ mainState, setMainState }: AddOrdersProps) {
  const [selectedStartOrder, setSelectedStartOrder] =
    useState<UserOrderType | null>(null);
  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);
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
            {mainState.startOrders.map((uo: any) => {
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
                      /*     onClick={() => {
                         mainState.currentOrder = uo;
                        mainState.currentOrder.userProducts.forEach((upo) => {
                          const userProduct =
                            mainState.userProfile.userProducts.find(
                              (up) => up.id == upo.userproductid
                            );
                          if (userProduct) userProduct.myOrder = upo;
                        });
                        
                        setMainState({ ...mainState }); 
                      }} */
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
          mainState.startOrders = mainState.startOrders.filter(
            (u: any) => u.id != selectedStartOrder.id
          );
          mainState.render = "allOrders";
          setMainState({ ...mainState });
        }}
      />
    </div>
  );
}
