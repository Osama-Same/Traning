import { useState, useEffect } from "react";
import { MainStateType , BrandType  ,OriginType ,CategoryType ,UsersStoreType} from "./mainState";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Button from "@mui/material/Button";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
import UsersProductsService from "../service/usersProductsService";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import AutoCompleteSelect from "./common/AutoCompleteSelect";
import { CategoriesTree } from "./categories";

interface UsersStorePageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function UsersStorePage({
  mainState,
  setMainState,
}: UsersStorePageProps) {
  const { UsersStore } = mainState;

  const [selectedStore, setSelectedStore] = useState<UsersStoreType | null>(
    null
  );
  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [selectedBrand, setselectedBrand] = useState<BrandType | any>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<OriginType | any>(null);
  const [dispProducts, setdispProducts] = useState(mainState.allProducts);
  const [selectedProductCategory, setselectedProductCategory] =
    useState<CategoryType | null>(null);

  return (
    <div
      className="container-fluid"
      style={{ marginTop: "5%", marginBottom: "5%" }}
    >
      <div className="row">
        <div className="col-3">
          <AutoCompleteSelect
            textLabel="Brand"
            options={mainState.allBrands}
            selectedOption={selectedBrand}
            onChange={(brand: any) => setselectedBrand(brand)}
            labelOption="nameen"
            labelImage="logo"
          />
          <br></br>
          <AutoCompleteSelect
            textLabel="Origin"
            options={mainState.allOrigins}
            selectedOption={selectedOrigin}
            onChange={(origin: any) => setSelectedOrigin(origin)}
            labelOption="nameen"
            labelImage="flag"
          />
          <br></br>
          <div>
            <CategoriesTree
              allowEdit={false}
              categories={mainState.allCategories}
              mainState={mainState}
              setMainState={setMainState}
              onSelect={(category: CategoryType | any) => {
                if (category && category.products) {
                  setdispProducts(category.products);
                }
                if (category.categorytype !== 0) {
                  setselectedProductCategory(category);
                } else {
                  setselectedProductCategory(null);
                }
              }}
            />
          </div>
        </div>

        <div className="col">
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">idUser</TableCell>
                  <TableCell align="center">Product Description</TableCell>
                  <TableCell align="center">quantity</TableCell>
                  <TableCell align="center">costprice</TableCell>
                  <TableCell align="center">salesprice</TableCell>
                  <TableCell align="center">Update</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {UsersStore &&
                  UsersStore.map((userProduct: any) => {
                    return (
                      <TableRow
                        key={userProduct.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{userProduct.id}</TableCell>
                        <TableCell align="center">{userProduct.id}</TableCell>
                        <TableCell align="center">
                          {mainState.language === "EN"
                            ? userProduct.product &&
                              userProduct.product.category &&
                              userProduct.product.category.publishednameen
                            : userProduct.product &&
                              userProduct.product.category &&
                              userProduct.product.category.publishednamear}
                        </TableCell>
                        <TableCell align="center">
                          {userProduct.quantity}
                        </TableCell>
                        <TableCell align="center">
                          {userProduct.costprice}
                        </TableCell>
                        <TableCell align="center">
                          {userProduct.salesprice}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setSelectedStore(userProduct);
                              setOpen(true);
                            }}
                          >
                            {mainState.language === "EN" ? "Update" : "تحديث"}
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            disabled={
                              userProduct.product &&
                              userProduct.product.length > 0
                            }
                            onClick={async () => {
                              setSelectedStore(userProduct);
                              setopenConfirmDelDlg(true);
                            }}
                          >
                            {mainState.language === "EN" ? "Delete" : "حذف"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <ConfirmDeleteDialog
              open={openConfirmDelDlg}
              setopen={setopenConfirmDelDlg}
              text={`usersStore ${
                selectedStore && selectedStore.id
              }  will be deleted permenantly, are you sure?`}
              onConfirm={async () => {
                if (!selectedStore) return;
                setloading(true);
                await UsersProductsService._delete(selectedStore.id);
                setloading(false);
                mainState.UsersStore = mainState.UsersStore.filter(
                  (u) => u.id != selectedStore.id
                );
                setMainState({ ...mainState });
              }}
            />
            {selectedStore && (
              <StoreForm
                open={open}
                setOpen={setOpen}
                userProduct={selectedStore}
                mainState={mainState}
                setMainState={setMainState}
              />
            )}
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
interface StoreFormProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  userProduct: UsersStoreType;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
function StoreForm({
  open,
  setOpen,
  userProduct,
  mainState,
  setMainState,
}: StoreFormProps) {
  const [userid, setUserid] = useState(userProduct.userid);
  const [productid, setProductid] = useState(userProduct.productid);
  const [quantity, setQuantity] = useState(userProduct.quantity);
  const [costprice, setCostprice] = useState(userProduct.costprice);
  const [salesprice, setSalesprice] = useState(userProduct.salesprice);
  const [loading, setLoading] = useState(false);
  console.log("userProduct", userProduct);
  useEffect(() => {
    if (!userProduct) return;
    setUserid(userProduct.userid);
    setProductid(userProduct.productid);
    setQuantity(userProduct.quantity);
    setCostprice(userProduct.costprice);
    setSalesprice(userProduct.salesprice);
  }, [userProduct]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText sx={{ marginBottom: "5%", color: "black" }}>
          User Product Form
        </DialogContentText>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginBottom: "5%",
          }}
        >
          <TextField fullWidth label={"userid"} disabled value={userid} />
        </Box>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginBottom: "5%",
          }}
        >
          <TextField
            fullWidth
            label={"productid"}
            disabled
            value={userProduct ? userProduct.productid : "***"}
          />
        </Box>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginBottom: "5%",
          }}
        >
          <TextField
            fullWidth
            label="quantity"
            onChange={(e: any) => setQuantity(e.target.value)}
            name="quantity"
            value={quantity}
          />
        </Box>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginBottom: "5%",
          }}
        >
          <TextField
            fullWidth
            label="costprice"
            onChange={(e: any) => setCostprice(e.target.value)}
            name="costprice"
            value={costprice}
          />
        </Box>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginBottom: "5%",
          }}
        >
          <TextField
            fullWidth
            label="salesprice"
            onChange={(e: any) => setSalesprice(e.target.value)}
            name="salesprice"
            value={salesprice}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            setLoading(true);
            userProduct.productid = productid;
            userProduct.userid = userid;
            userProduct.quantity = quantity;
            userProduct.costprice = costprice;
            userProduct.salesprice = salesprice;
            userProduct.productid = productid;
            const res: any = await UsersProductsService._save(userProduct);
            if (userProduct.id == 0) {
              userProduct.id = parseInt(res.insertId);
              mainState.UsersStore = [userProduct, ...mainState.UsersStore];
            }
            setLoading(false);
            setOpen(false);
            setMainState({ ...mainState });
          }}
        >
          {loading ? <CircularProgress /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
