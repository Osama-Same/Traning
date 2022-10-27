import { Fragment, useState } from "react";
import { MainStateType, CategoryType } from "./mainState";
import IconButton from "@mui/material/IconButton";
import { TreeView, TreeItem } from "@mui/lab";
import { Edit, Delete, AddCircleOutline } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ConfirmDeleteDialog from "./common/ConfirmDeleteDialog";
import categoriesService from "../service/categoriesService";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
const baseCategoriesURL =
  "http://www.tochangehybrid.com/groceriesImages/categories/";

//========================================================================================
interface CategoriesFormProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  category: CategoryType;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
function CategoriesForm({
  open,
  setOpen,
  category,
  mainState,
  setMainState,
}: CategoriesFormProps) {
  const [nameen, setNameen] = useState(category.nameen);
  const [namear, setNamear] = useState(category.namear);
  const [logo, setLogo] = useState(category.logo);
  const [descriptionen, setdescriptionen] = useState(category.descriptionen);
  const [descriptionar, setdescriptionar] = useState(category.descriptionar);
  const [parentid, setparentid] = useState(category.parentid);
  const [publishednameen, setPublishednameen] = useState(
    category.publishednameen
  );
  const [publishednamear, setPublishednamear] = useState(
    category.publishednamear
  );
  const [categorytype, setCategorytype] = useState(category.categorytype);
  const [loading, setloading] = useState(false);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogContentText sx={{ marginBottom: "5%", color: "black" }}>
          category Form
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
            label="Parent id"
            onChange={(e) => setparentid(parseInt(e.target.value))}
            name="parentid"
            value={parentid}
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
            label="Logo"
            onChange={(e) => setLogo(e.target.value)}
            name="logo"
            value={logo}
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
            label="Description Arabic"
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
            label="Description publishedname English"
            onChange={(e) => setPublishednameen(e.target.value)}
            name="publishednameen"
            value={publishednameen}
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
            label="Description publishedname Arabic"
            onChange={(e) => setPublishednamear(e.target.value)}
            name="publishednameen"
            value={publishednamear}
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
            label="categorytype"
            onChange={(e) => setCategorytype(parseInt(e.target.value))}
            name="categorytype"
            value={categorytype}
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
            setloading(true);
            category.parentid = parentid;
            category.nameen = nameen;
            category.namear = namear;
            category.logo = logo;
            category.descriptionen = descriptionen;
            category.descriptionar = descriptionar;
            category.publishednameen = publishednameen;
            category.publishednamear = publishednamear;
            category.categorytype = categorytype;
            const res: any = await categoriesService._save(category);
            if (category.id == 0) {
              category.id = parseInt(res.insertId);
              mainState.allCategories = [category, ...mainState.allCategories];
              setMainState({ ...mainState });
              setloading(false);
              setOpen(false);
            }

            mainState.render = "categories";
            mainState.allCategories = [category, ...mainState.allCategories];
            setMainState({ ...mainState });
            setloading(false);
            setOpen(false);
          }}
        >
          {loading ? <CircularProgress /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
//========================================================================================
interface CategoryNodeProps {
  category: CategoryType;
  allCategories: CategoryType[];
  allowEdit: boolean;
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
  onSelect?: (s: CategoryType) => void;
}
//----------------------------------------------------------------------------------------
export function CategoryNode({
  category,
  allCategories,
  allowEdit,
  mainState,
  setMainState,
  onSelect,
}: CategoryNodeProps) {
  const subCategories: CategoryType[] = allCategories.filter(
    (c) => c.parentid == category.id
  );

  const imgsrc = `${baseCategoriesURL}${category.id}.jpg`;
  const [openConfirmDelDlg, setopenConfirmDelDlg] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [selectedCategory, setselectedCategory] = useState<CategoryType | null>(
    null
  );
  return (
    <Fragment>
      <TreeItem
        nodeId={category.id.toString()}
        onClick={() => {
          if (onSelect) onSelect(category);
        }}
        label={
          <List>
            <ListItem disablePadding>
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src={imgsrc} />
              </ListItemIcon>
              <ListItemText primary={category.nameen} />
              {allowEdit && (
                <div>
                  <IconButton
                    color="error"
                    title="delete"
                    disabled={subCategories.length > 0}
                    onClick={() => {
                      setselectedCategory(category);
                      setopenConfirmDelDlg(true);
                    }}
                  >
                    {loading ? <CircularProgress /> : <Delete />}
                  </IconButton>
                  <IconButton
                    color="primary"
                    title="update"
                    onClick={() => {
                      setselectedCategory(category);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="primary"
                    disabled={category.categorytype !== 0}
                    onClick={() => {
                      const newCategory: CategoryType = {
                        id: 0,
                        nameen: "",
                        namear: "",
                        descriptionen: "",
                        descriptionar: "",
                        logo: "",
                        parentid: category.id,
                        publishednameen: "",
                        publishednamear: "",
                        categorytype: 0,
                      };

                      setselectedCategory(newCategory);
                      setOpen(true);
                    }}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </div>
              )}
            </ListItem>
          </List>
        }
      >
        {subCategories.length > 0 &&
          subCategories.map((sc) => (
            <CategoryNode
              category={sc}
              allCategories={allCategories}
              allowEdit={allowEdit}
              mainState={mainState}
              setMainState={setMainState}
              onSelect={onSelect}
            />
          ))}
      </TreeItem>
      <ConfirmDeleteDialog
        open={openConfirmDelDlg}
        setopen={setopenConfirmDelDlg}
        text={`catugure ${
          selectedCategory && selectedCategory.nameen
        }  will be deleted permenantly, are you sure?`}
        onConfirm={async () => {
          if (!selectedCategory) return;
          setloading(true);
          await categoriesService._delete(selectedCategory.id);
          setloading(false);
          mainState.allCategories = mainState.allCategories.filter(
            (u) => u.id != selectedCategory.id
          );

          mainState.render = "categories";
          setMainState({ ...mainState });
        }}
      />
      {selectedCategory && (
        <CategoriesForm
          open={open}
          setOpen={setOpen}
          category={selectedCategory}
          mainState={mainState}
          setMainState={setMainState}
        />
      )}
    </Fragment>
  );
}

//========================================================================================
interface CategoriesTreeProps {
  allowEdit: boolean;
  categories: CategoryType[];
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
  onSelect?: (s: CategoryType) => void;
}
//----------------------------------------------------------------------------------------
export function CategoriesTree({
  allowEdit,
  categories,
  mainState,
  setMainState,
  onSelect,
}: CategoriesTreeProps) {
  const [baseCategories, setbaseCategories] = useState<CategoryType[]>(
    categories.filter((c) => c.parentid === 0)
  );
  const [selectedCategory, setselectedCategory] = useState<CategoryType | null>(
    null
  );
  const [open, setOpen] = useState(false);
  return (
    <div>
      {allowEdit && (
        <IconButton
          color="primary"
          title="Add Category"
          onClick={() => {
            const newCategory: CategoryType = {
              id: 0,
              nameen: "",
              namear: "",
              descriptionen: "",
              descriptionar: "",
              logo: "",
              parentid: 0,
              publishednameen: "",
              publishednamear: "",
              categorytype: 0,
            };
            setselectedCategory(newCategory);
            setOpen(true);
          }}
        >
          <AddIcon />
        </IconButton>
      )}
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {baseCategories.map((category) => (
          <CategoryNode
            category={category}
            allCategories={categories}
            allowEdit={allowEdit}
            mainState={mainState}
            setMainState={setMainState}
            onSelect={onSelect}
          />
        ))}
      </TreeView>
      {selectedCategory && (
        <CategoriesForm
          open={open}
          setOpen={setOpen}
          category={selectedCategory}
          mainState={mainState}
          setMainState={setMainState}
        />
      )}
    </div>
  );
}
//=============================================================================================
interface CategoriesPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
//-----------------------------------------------------------------------------------
export function CategoriesPage({
  mainState,
  setMainState,
}: CategoriesPageProps) {
  const { allCategories } = mainState;
  return (
    <div className="row">
      <CategoriesTree
        allowEdit={true}
        categories={allCategories}
        mainState={mainState}
        setMainState={setMainState}
      />
    </div>
  );
}
