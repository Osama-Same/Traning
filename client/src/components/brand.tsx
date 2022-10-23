import { useState, useEffect, Fragment } from "react";
import { MainStateType, BrandType } from "./mainState";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
import CircularProgress from "@mui/material/CircularProgress";
import brandsService from "../service/brandsService";
const baseBrandsURL = "http://www.tochangehybrid.com/groceriesImages/brands/";

//========================================================================================================

interface BrandPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
//========================================================================================================

export function BrandPage({ mainState, setMainState }: BrandPageProps) {
  const { allBrands } = mainState;
  const [selectedBrand, setSelectedBrand] = useState<BrandType | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);
  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <TableContainer>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedBrand({
                id: 0,
                nameen: "",
                namear: "",
                descriptionen: "",
                descriptionar: "",
                logo: "",
              });
              setOpen(true);
            }}
          >
            <AddIcon />
          </Button>
        </Stack>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">id</TableCell>
              <TableCell align="center">nameen</TableCell>
              <TableCell align="center">namear</TableCell>
              <TableCell align="center">descriptionen</TableCell>
              <TableCell align="center">descriptionar</TableCell>
              <TableCell align="center">logo</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBrands.map((brand) => (
              <TableRow
                key={brand.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{brand.id}</TableCell>
                <TableCell align="center">
                  {" "}
                  {mainState.language === "EN" ? brand.nameen : brand.namear}
                </TableCell>
                <TableCell align="center">
                  {mainState.language === "EN" ? brand.namear : brand.nameen}
                </TableCell>
                <TableCell align="center">
                  {" "}
                  {mainState.language === "EN"
                    ? brand.descriptionen
                    : brand.descriptionar}
                </TableCell>
                <TableCell align="center">
                  {" "}
                  {mainState.language === "EN"
                    ? brand.descriptionar
                    : brand.descriptionen}
                </TableCell>
                <TableCell align="center">
                  <img
                    src={`${baseBrandsURL}${brand.id}.jpg`}
                    alt={`${baseBrandsURL}${brand.id}.jpg`}
                    width={50}
                    height={40}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedBrand(brand);
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
                    onClick={async () => {
                      setSelectedBrand(brand);
                      setopenConfirmDelDlg(true);
                    }}
                  >
                    {mainState.language === "EN" ? "Delete" : "حذف"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedBrand && (
          <BrandForm
            open={open}
            setOpen={setOpen}
            brand={selectedBrand}
            mainState={mainState}
            setMainState={setMainState}
          />
        )}
        <ConfirmDeleteDialog
          open={openConfirmDelDlg}
          setopen={setopenConfirmDelDlg}
          text={`prodect ${
            selectedBrand && selectedBrand.nameen
          }  will be deleted permenantly, are you sure?`}
          onConfirm={async () => {
            if (!selectedBrand) return;
            setloading(true);
            await brandsService._delete(selectedBrand.id);
            setloading(false);
            mainState.allBrands = mainState.allBrands.filter(
              (u) => u.id != selectedBrand.id
            );
            mainState.render = "brands";
            setMainState({ ...mainState });
          }}
        />
      </TableContainer>
    </div>
  );
}
//========================================================================================================
interface BrandFormProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  brand: BrandType;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
//--------------------------------------------------------------------------------------------------------

function BrandForm({
  open,
  setOpen,
  brand,
  mainState,
  setMainState,
}: BrandFormProps) {
  const [nameen, setNameen] = useState(brand.nameen);
  const [namear, setNamear] = useState(brand.namear);
  const [descriptionen, setDescriptionen] = useState(brand.descriptionen);
  const [descriptionar, setDescriptionar] = useState(brand.descriptionar);
  const [logo, setLogo] = useState(brand.logo);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setNameen(brand.nameen);
    setNamear(brand.namear);
    setDescriptionen(brand.descriptionen);
    setDescriptionar(brand.descriptionar);
    setLogo(brand.logo);
  }, [brand]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText sx={{ marginBottom: "5%", color: "black" }}>
          Brand Form
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
            label="Name English"
            onChange={(e) => setNameen(e.target.value)}
            name="nameen"
            value={nameen}
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
            label="Name Arabic"
            onChange={(e) => setNamear(e.target.value)}
            name="namear"
            value={namear}
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
            label="Description English"
            onChange={(e) => setDescriptionen(e.target.value)}
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
            label="Description Arabic"
            onChange={(e) => setDescriptionar(e.target.value)}
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
            label="Logo"
            onChange={(e) => setLogo(e.target.value)}
            name="logo"
            value={logo}
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
            brand.nameen = nameen;
            brand.namear = namear;
            brand.descriptionen = descriptionen;
            brand.descriptionar = descriptionar;
            brand.logo = logo;
            const res: any = await brandsService._save(brand);
            if (brand.id == 0) {
              brand.id = parseInt(res.insertId);
              mainState.allBrands = [brand, ...mainState.allBrands];
            }
            setLoading(false);
            setOpen(false);
            mainState.render = "brands";
            setMainState({ ...mainState });
          }}
        >
          {loading ? <CircularProgress /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
