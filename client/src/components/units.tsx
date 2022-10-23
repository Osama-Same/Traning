import { useState, useEffect, Fragment } from "react";
import { MainStateType ,UnitType} from "./mainState";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
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
import unitsService from "../service/unitsService";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

interface UnitsPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}

export function UnitsPage({ mainState, setMainState }: UnitsPageProps) {
  const { allUnits } = mainState;
  const [selectedUnit, setSelectedUnit] = useState<UnitType | null>(null);
  const [confirmDelDlg, setConfirmDelDlg] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);

  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <TableContainer>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedUnit({ id: 0, nameen: "", namear: "" });
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
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUnits.map((unit) => {
              return (
                <TableRow
                  key={unit.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{unit.id}</TableCell>
                  <TableCell align="center">
                    {mainState.language === "EN" ? unit.nameen : unit.namear}
                  </TableCell>
                  <TableCell align="center">
                    {mainState.language === "EN" ? unit.namear : unit.nameen}
                  </TableCell>
                  {loading && selectedUnit && selectedUnit.id === unit.id ? (
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
                            setSelectedUnit(unit);
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
                            setSelectedUnit(unit);
                            setConfirmDelDlg(true);
                          }}
                        >
                          {mainState.language === "EN" ? "Delete" : "حذف"}
                        </Button>
                      </TableCell>
                    </Fragment>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <ConfirmDeleteDialog
            open={confirmDelDlg}
            setopen={setConfirmDelDlg}
            text={`prodect ${
              selectedUnit && selectedUnit.nameen
            }  will be deleted permenantly, are you sure?`}
            onConfirm={async () => {
              if (!selectedUnit) return;
              setloading(true);
              await unitsService._delete(selectedUnit.id);
              setloading(false);
              mainState.allUnits = mainState.allUnits.filter(
                (u) => u.id != selectedUnit.id
              );
              mainState.render = "units";
              setMainState({ ...mainState });
            }}
          />
          {selectedUnit && (
            <UnitsForm
              open={open}
              setOpen={setOpen}
              unit={selectedUnit}
              mainState={mainState}
              setMainState={setMainState}
            />
          )}
        </Table>
      </TableContainer>
    </div>
  );
}
//========================================================================================================
interface UnitsFormProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  unit: UnitType;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
//--------------------------------------------------------------------------------------------------------
function UnitsForm({
  open,
  setOpen,
  unit,
  setMainState,
  mainState,
}: UnitsFormProps) {
  const [nameen, setNameen] = useState(unit.nameen);
  const [namear, setNamear] = useState(unit.namear);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNameen(unit.nameen);
    setNamear(unit.namear);
  }, [unit]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText sx={{ marginBottom: "5%", color: "black" }}>
          unit Form
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
            unit.nameen = nameen;
            unit.namear = namear;
            const res: any = await unitsService._save(unit);
            if (unit.id == 0) {
              unit.id = parseInt(res.insertId);
              mainState.allUnits = [unit, ...mainState.allUnits];
            }

            setLoading(false);
            setOpen(false);
            mainState.render = "units";
            setMainState({ ...mainState });
          }}
        >
          {loading ? <CircularProgress /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
