import { useState, useEffect, Fragment } from "react";
import { MainStateType } from "./mainState";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
import originsService from "../service/originsService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import {OriginType} from "./mainState"
const baseImagesURL = "http://www.tochangehybrid.com/groceriesImages/origins/";

interface OriginsPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
//========================================================================================================

export function OriginsPage({ mainState, setMainState }: OriginsPageProps) {
  const { allOrigins } = mainState;
  const [selectedOrigin, setSelectedOrigin] = useState<OriginType | null>(null);
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
              setSelectedOrigin({ id: 0, nameen: "", namear: "", flag: "" });
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
              <TableCell align="center">flag</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allOrigins.map((origin) => (
              <TableRow
                key={origin.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{origin.id}</TableCell>
                <TableCell align="center">
                  {mainState.language === "EN" ? origin.nameen : origin.namear}
                </TableCell>
                <TableCell align="center">
                  {mainState.language === "EN" ? origin.namear : origin.nameen}
                </TableCell>
                <TableCell align="center">
                  <img
                    src={`${baseImagesURL}${origin.id}.jpg`}
                    alt={`${baseImagesURL}${origin.id}.jpg`}
                    width={50}
                    height={40}
                  />
                </TableCell>
                {loading && selectedOrigin && selectedOrigin.id == origin.id ? (
                  <TableCell align="center">
                    <CircularProgress />
                  </TableCell>
                ) : (
                  <Fragment>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          setSelectedOrigin(origin);
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
                          setSelectedOrigin(origin);
                          setopenConfirmDelDlg(true);
                        }}
                      >
                        {mainState.language === "EN" ? "Delete" : "حذف"}
                      </Button>
                    </TableCell>
                  </Fragment>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedOrigin && (
          <OriginForm
            open={open}
            setOpen={setOpen}
            origin={selectedOrigin}
            mainState={mainState}
            setMainState={setMainState}
          />
        )}
        <ConfirmDeleteDialog
          open={openConfirmDelDlg}
          setopen={setopenConfirmDelDlg}
          text={`prodect ${
            selectedOrigin && selectedOrigin.nameen
          }  will be deleted permenantly, are you sure?`}
          onConfirm={async () => {
            if (!selectedOrigin) return;
            setloading(true);
            await originsService._delete(selectedOrigin.id);
            setloading(false);
            mainState.allOrigins = mainState.allOrigins.filter(
              (u) => u.id !== selectedOrigin.id
            );
            mainState.render = "origins";
            setMainState({ ...mainState });
          }}
        />
      </TableContainer>
    </div>
  );
}
//--------------------------------------------------------------------------------------------------------

interface UnitsFormProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  origin: OriginType;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
function OriginForm({
  open,
  setOpen,
  origin,
  mainState,
  setMainState,
}: UnitsFormProps) {
  const [nameen, setNameen] = useState(origin.nameen);
  const [namear, setNamear] = useState(origin.namear);
  const [flag, setFlag] = useState(origin.flag);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setNameen(origin.nameen);
    setNamear(origin.namear);
    setFlag(origin.flag);
  }, [origin]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText sx={{ marginBottom: "5%", color: "black" }}>
          origin Form
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
            label="Flag"
            onChange={(e) => setFlag(e.target.value)}
            name="flag"
            value={flag}
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
            origin.nameen = nameen;
            origin.namear = namear;
            origin.flag = flag;
            const res: any = await originsService._save(origin);
            if (origin.id == 0) {
              origin.id = parseInt(res.insertId);
              mainState.allOrigins = [origin, ...mainState.allOrigins];
            }
            setLoading(false);
            setOpen(false);
            mainState.render = "origins";
            setMainState({ ...mainState });
          }}
        >
          {loading ? <CircularProgress /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
