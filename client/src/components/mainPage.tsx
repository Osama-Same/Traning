import { LoginPage } from "./login";
import { MainStateType } from "./mainState";
import { OriginsPage } from "./origins";
import { BrandPage } from "./brand";
import { UnitsPage } from "./units";
import { CategoriesPage } from "./categories";
import { ProductsPage } from "./product";
import { UserProfile } from "./userProfile";
import { RegisterPage } from "./register";
import { UsersStorePage } from "./usersStore";
import { UserCard } from "./usersCard";
import { UserProductCard } from "./userProductCard";
import { NewOrderFormPage } from "./newOrder";
import { AllOrdersPage } from "./startOrders";
import { EndOrderPage } from "./endOrders";
import { Currentorder } from "./currentorder";
interface MainPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}

export function MainPage({ mainState, setMainState }: MainPageProps) {
  const { render } = mainState;
  console.log("mainState", mainState);
  if (render === "login")
    return <LoginPage mainState={mainState} setMainState={setMainState} />;
  if (render === "register")
    return <RegisterPage mainState={mainState} setMainState={setMainState} />;
  if (render === "origins")
    return <OriginsPage mainState={mainState} setMainState={setMainState} />;
  if (render === "brands")
    return <BrandPage mainState={mainState} setMainState={setMainState} />;
  if (render === "units")
    return <UnitsPage mainState={mainState} setMainState={setMainState} />;
  if (render === "categories")
    return <CategoriesPage mainState={mainState} setMainState={setMainState} />;
  if (render === "products")
    return <ProductsPage mainState={mainState} setMainState={setMainState} />;
  if (render === "profile")
    return <UserProfile mainState={mainState} setMainState={setMainState} />;
  if (render === "usersStore")
    return <UsersStorePage mainState={mainState} setMainState={setMainState} />;
  if (render === "usersCard")
    return <UserCard mainState={mainState} setMainState={setMainState} />;
  if (render === "userProductCard")
    return (
      <UserProductCard mainState={mainState} setMainState={setMainState} />
    );
  if (render === "neworder")
    return (
      <NewOrderFormPage mainState={mainState} setMainState={setMainState} />
    );
  if (render === "startOrders")
    return <AllOrdersPage mainState={mainState} setMainState={setMainState} />;
  if (render === "endOrders")
    return <EndOrderPage mainState={mainState} setMainState={setMainState} />;
  if (render === "currentorder")
    return <Currentorder mainState={mainState} setMainState={setMainState} />;

  return <div>Not user</div>;
}
