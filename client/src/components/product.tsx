import { useState, useEffect } from "react";
import {
  MainStateType,
  BrandType,
  OriginType,
  CategoryType,
  ProductType,
} from "./mainState";
import { CategoriesTree } from "./categories";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Stack from "@mui/material/Stack";
import AutoCompleteSelect from "./common/AutoCompleteSelect";
import TableContainer from "@mui/material/TableContainer";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Delete, Edit } from "@mui/icons-material";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
import ProductsService from "../service/productsService";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import usersProductsService from "../service/usersProductsService";
import productsService from "../service/productsService";
import { updateUserState } from "./users";
const baseImagesURL = "http://www.tochangehybrid.com/groceriesImages/products/";

//========================================================================================================
interface ProductsPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}

//========================================================================================================
export function ProductsPage({ mainState, setMainState }: ProductsPageProps) {
  const { allProducts } = mainState;

  const [selectedProductCategory, setselectedProductCategory] =
    useState<CategoryType | null>(null);

  const [selectedBrand, setselectedBrand] = useState<BrandType | any>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | any>(
    null
  );
  const [selectedOrigin, setSelectedOrigin] = useState<OriginType | any>(null);

  const [open, setOpen] = useState(false);

  const [dispProducts, setdispProducts] = useState(allProducts);

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
          <br />
          <div>
            <CategoriesTree
              allowEdit={false}
              categories={mainState.allCategories}
              mainState={mainState}
              setMainState={setMainState}
              onSelect={(category: CategoryType | any) => {
                // console.log("category", category.products);
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
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                disabled={
                  !selectedBrand || !selectedOrigin || !selectedProductCategory
                }
                onClick={() => {
                  if (!selectedProductCategory) return;
                  setOpen(true);
                  const newProduct: ProductType = {
                    id: 0,
                    barcode: "",
                    descriptionen: "",
                    descriptionar: "",
                    image: "",
                    originid: selectedOrigin.id,
                    brandid: selectedBrand.id,
                    categoryid: selectedProductCategory.id,
                    quantity: 0,
                    unitid: 0,
                  };
                  setSelectedProduct(newProduct);
                  setMainState({ ...mainState });
                }}
              >
                <AddIcon />
              </Button>
            </Stack>
            {dispProducts && (
              <ProductsTable
                products={dispProducts}
                setdispProducts={setdispProducts}
                mainState={mainState}
                setMainState={setMainState}
              />
            )}
          </TableContainer>
        </div>
      </div>
      {selectedProduct && (
        <ProductForm
          open={open}
          setOpen={setOpen}
          products={dispProducts}
          product={selectedProduct}
          mainState={mainState}
          setMainState={setMainState}
          setdispProducts={setdispProducts}
        />
      )}
    </div>
  );
}

//========================================================================================================

interface ProductsFromProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  products: ProductType[] | any;
  product: ProductType;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
  setdispProducts: (m: ProductType[]) => void;
}
//========================================================================================================
export function ProductForm({
  open,
  setOpen,
  products,
  product,
  mainState,
  setMainState,
  setdispProducts,
}: ProductsFromProps) {
  const { allUnits } = mainState;
  const [originid, setOriginid] = useState(product.originid);
  const [brandid, setBrandid] = useState(product.brandid);
  const [categoryid, setCategoryid] = useState(product.categoryid);
  const [unitid, setUnitid] = useState(product.unitid);
  const [image, setImage] = useState(product.image);
  const [descriptionen, setdescriptionen] = useState(product.descriptionen);
  const [descriptionar, setdescriptionar] = useState(product.descriptionar);
  const [barcode, setBarcode] = useState(product.barcode);
  const [loading, setloading] = useState(false);
  const [quantity, setQuantity] = useState(product.quantity);
  console.log(product);
  useEffect(() => {
    if (!product) return;
    setCategoryid(product.categoryid);
    setBrandid(product.brandid);
    setImage(product.image);
    setdescriptionen(product.descriptionen);
    setdescriptionar(product.descriptionar);
    setBarcode(product.barcode);
    setQuantity(product.quantity);
    setUnitid(product.unitid);
    setOriginid(product.originid);
  }, [product]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText sx={{ marginBottom: "5%", color: "black" }}>
          Product Form
        </DialogContentText>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginBottom: "5%",
          }}
        >
          <TextField
            fullWidth
            label="originid"
            disabled
            onChange={(e) => setOriginid(parseInt(e.target.value))}
            name="originid"
            value={originid}
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
            label="brandid"
            disabled
            onChange={(e) => setBrandid(parseInt(e.target.value))}
            name="brandid"
            value={brandid}
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
            label="categoryid"
            onChange={(e) => setCategoryid(parseInt(e.target.value))}
            name="categoryid"
            value={categoryid}
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
            label="image"
            onChange={(e) => setImage(e.target.value)}
            name="image"
            value={image}
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
            label="Descriptionen"
            onChange={(e) => setdescriptionen(e.target.value)}
            name="descriptionen"
            value={descriptionen}
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
            label="Descriptionar"
            onChange={(e) => setdescriptionar(e.target.value)}
            name="descriptionar"
            value={descriptionar}
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
            label="barcode"
            onChange={(e) => setBarcode(e.target.value)}
            name="barcode"
            value={barcode}
          />
        </Box>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginBottom: "5%",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Unit</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="selectedUnit"
              name="selectedUnit"
              onChange={(e: any) => setUnitid(e.target.value)}
              value={unitid}
            >
              {allUnits.map((e: any) => {
                return <MenuItem value={e.id}>{e.nameen}</MenuItem>;
              })}
            </Select>
          </FormControl>
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
            setloading(true);
            product.originid = originid;
            product.brandid = brandid;
            product.image = image;
            product.descriptionen = descriptionen;
            product.descriptionar = descriptionar;
            product.barcode = barcode;
            product.quantity = quantity;
            product.unitid = unitid;
            product.categoryid = categoryid;
            const res: any = await ProductsService._save(product);
            if (product.id == 0) {
              product.id = parseInt(res.insertId);
              setdispProducts([product, ...products]);
              mainState.allProducts = [product, ...mainState.allProducts];
              setMainState({ ...mainState });
            }
            setloading(false);
            setOpen(false);
            mainState.render = "products";
            setMainState({ ...mainState });
          }}
        >
          {loading ? <CircularProgress /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ProductTableProps {
  products: ProductType | any;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
  setdispProducts: (m: ProductType[]) => void;
}
export function ProductsTable({
  products,
  mainState,
  setMainState,
  setdispProducts,
}: ProductTableProps) {
  const { user, UsersStore } = mainState;
  const myProducts = UsersStore.filter((p) => p.userid == user?.id);

  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | any>(
    null
  );

  const [open, setOpen] = useState(false);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">id</TableCell>
            {user && user.authorization === "user" && (
              <TableCell align="center">check</TableCell>
            )}
            <TableCell align="center">Product Description</TableCell>
            <TableCell align="center">Brand</TableCell>
            <TableCell align="center">Origin</TableCell>
            <TableCell align="center">quantity</TableCell>
            <TableCell align="center">unit</TableCell>
            <TableCell align="center">barcode</TableCell>
            <TableCell align="center">descriptionen</TableCell>
            <TableCell align="center">image</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        {products.map((product: any) => {
          return (
            <TableRow
              key={product.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">{product.id}</TableCell>
              {user && user.authorization === "user" && (
                <TableCell align="center">
                  <Checkbox
                    checked={
                      myProducts.find((up: any) => up.productid == product.id)
                        ? true
                        : false
                    }
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    onClick={async (e: any) => {
                      if (e.target.checked) {
                        let data: any = {
                          id: 0,
                          userid: user.id,
                          productid: product.id,
                          quantity: 0,
                          costprice: 0,
                          salesprice: 0,
                        };

                        await usersProductsService._save(data);
                        mainState.UsersStore = [data, ...mainState.UsersStore];
                        setMainState({ ...mainState });
                      } else {
                        const userProduct = myProducts.find(
                          (up: any) => up.productid == product.id
                        );
                        if (!userProduct) return;
                        await usersProductsService._delete(userProduct.id);
                        mainState.UsersStore = mainState.UsersStore.filter(
                          (u) => u.id !== userProduct.id
                        );
                        setMainState({ ...mainState });
                      }
                    }}
                  />
                </TableCell>
              )}
              <TableCell align="center">
                {product?.category && product.category.publishednameen}
              </TableCell>
              <TableCell align="center">
                {product.brand && product.brand.nameen}
              </TableCell>
              <TableCell align="center">
                {product.origin && product.origin.nameen}
              </TableCell>
              <TableCell align="center"> {product.quantity}</TableCell>
              <TableCell align="center">
                {product.unit && product.unit.nameen}
              </TableCell>
              <TableCell align="center"> {product.barcode}</TableCell>
              <TableCell align="center">{product.descriptionen}</TableCell>

              <TableCell align="center">
                <img
                  src={`${baseImagesURL}${product.id}.jpg`}
                  alt="url"
                  width={80}
                  height={50}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => {
                    setSelectedProduct(product);
                    setopenConfirmDelDlg(true);
                  }}
                >
                  <Delete />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpen(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>

      {selectedProduct && (
        <ConfirmDeleteDialog
          open={openConfirmDelDlg}
          setopen={setopenConfirmDelDlg}
          text={`Product ${
            selectedProduct && selectedProduct.barcode
          }  will be deleted permenantly, are you sure?`}
          onConfirm={async () => {
            await productsService._delete(selectedProduct.id);
            mainState.allProducts = mainState.allProducts.filter(
              (u) => u.id !== selectedProduct.id
            );
            setdispProducts([selectedProduct.id, ...products]);
            setMainState({ ...mainState });
          }}
        />
      )}

      {selectedProduct && (
        <ProductForm
          open={open}
          setOpen={setOpen}
          products={products}
          product={selectedProduct}
          mainState={mainState}
          setMainState={setMainState}
          setdispProducts={setdispProducts}
        />
      )}
    </TableContainer>
  );
}
