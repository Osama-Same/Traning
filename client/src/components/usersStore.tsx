import { useState, useEffect } from "react";
import {
  MainStateType,
  BrandType,
  OriginType,
  CategoryType,
  UsersStoreType,
} from "./mainState";
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
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
interface UsersStorePageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function UsersStorePage({
  mainState,
  setMainState,
}: UsersStorePageProps) {
  const { UsersStore } = mainState;
  console.log("UsersStore", UsersStore);
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
  const [search, setSearch] = useState("");

  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <Container component="main" maxWidth="xl">
        <Box
          sx={{
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack spacing={2} direction="row">
            <TextField
              fullWidth
              label="Search"
              id="fullWidth"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                let SearchProduct: any = UsersStore.filter((e: any) => {
                  return (
                    e.product.descriptionen
                      .toUpperCase()
                      .search(search.toUpperCase()) !== -1
                  );
                });
                mainState.UsersStore = SearchProduct;
                setMainState({ ...mainState });
              }}
            >
              Search
            </Button>
          </Stack>
        </Box>
      </Container>
      <div className="row">
        {UsersStore.map((userProduct: any) => {
          return (
            <div className="col-md-4 pt-3 pb-3">
              <Card>
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe">{userProduct.userid}</Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    mainState.language === "EN"
                      ? userProduct.product && userProduct.product.descriptionen
                      : userProduct.product && userProduct.product.descriptionar
                  }
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={userProduct.product && userProduct.product.image}
                  alt="Paella dish"
                />
                <CardContent>
                  <Stack
                    mb={2}
                    mt={2}
                    spacing={2}
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Chip
                      avatar={
                        <Avatar
                          alt="Natacha"
                          src={
                            userProduct.product.origin &&
                            userProduct.product.origin.flag
                          }
                        />
                      }
                      label={
                        mainState.language === "EN"
                          ? userProduct.product.origin &&
                            userProduct.product.origin.nameen
                          : userProduct.product.origin &&
                            userProduct.product.origin.namear
                      }
                      variant="outlined"
                    />
                    <Chip
                      avatar={
                        <Avatar
                          alt="Natacha"
                          src={
                            userProduct.product.category &&
                            userProduct.product.category.logo
                          }
                        />
                      }
                      label={
                        mainState.language === "EN"
                          ? userProduct.product &&
                            userProduct.product.category &&
                            userProduct.product.category.publishednameen
                          : userProduct.product &&
                            userProduct.product.category &&
                            userProduct.product.category.publishednamear
                      }
                      variant="outlined"
                    />
                    <Chip
                      avatar={
                        <Avatar
                          alt="Natacha"
                          src={
                            userProduct.product.brand &&
                            userProduct.product.brand.logo
                          }
                        />
                      }
                      label={
                        mainState.language === "EN"
                          ? userProduct.product &&
                            userProduct.product.brand &&
                            userProduct.product.brand.nameen
                          : userProduct.product &&
                            userProduct.product.brand &&
                            userProduct.product.brand.namear
                      }
                      variant="outlined"
                    />
                  </Stack>
                  <Stack
                    mb={2}
                    mt={2}
                    spacing={2}
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Chip
                      label={`Cost Price : ${userProduct.costprice}`}
                      variant="outlined"
                    />
                    <Chip
                      label={`Quantity : ${userProduct.quantity}`}
                      variant="outlined"
                    />
                    <Chip
                      label={`sales price : ${userProduct.salesprice}`}
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
                <CardActions disableSpacing>
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedStore(userProduct);
                      setOpen(true);
                    }}
                  >
                    {mainState.language === "EN" ? "Update" : "تحديث"}
                  </Button>
                  <Button
                    disabled={
                      userProduct.product && userProduct.product.length > 0
                    }
                    onClick={async () => {
                      setSelectedStore(userProduct);
                      setopenConfirmDelDlg(true);
                    }}
                  >
                    {mainState.language === "EN" ? "Delete" : "حذف"}
                  </Button>
                </CardActions>
              </Card>
            </div>
          );
        })}

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
            mainState.UsersStore = mainState.UsersStore.filter(
              (u) => u.id != selectedStore.id
            );
            setloading(false);
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
