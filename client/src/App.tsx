import { useState, useEffect } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import { ToastContainer } from "react-toastify";
import { MainStateType } from "./components/mainState";
import { MainPage } from "./components/mainPage";
import { UserCard } from "./components/usersCard";
import brandsService from "./service/brandsService";

function App() {
  const [mainState, setMainState] = useState<MainStateType>({
    render: "",
    language: "EN",
    user: null,
    allOrigins: [],
    allBrands: [],
    allUnits: [],
    allCategories: [],
    allProducts: [],
    allUsersProfiles: [],
    UsersStore: [],
    userProfile: null,
    selectedUser: null,
    currentOrder: null,
    allUserOrder: [],
    startOrders: [],
    endOrders: [],
    allUserProductOrders: [],
  });
  useEffect(() => {
    update();
  });
  const [brand, setBrand] = useState([]);
  const update = async () => {
    const _allBrands = await brandsService._get();
    setBrand(_allBrands);
  };
  console.log(brand);
  return (
    <div className="App">
      <ToastContainer />
      <Navigation mainState={mainState} setMainState={setMainState} />
      <MainPage mainState={mainState} setMainState={setMainState} />
    </div>
  );
}

export default App;
