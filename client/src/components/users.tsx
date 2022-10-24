import { MainStateType } from "./mainState";
import originsService from "../service/originsService";
import brandsService from "../service/brandsService";
import unitsService from "../service/unitsService";
import categoriesService from "../service/categoriesService";
import productsService from "../service/productsService";
import registerdUsersService from "../service/registerdUsersService";
import usersProductsService from "../service/usersProductsService";
import usersOrdersService from "../service/usersOrdersService";
import userProductsOrdersService from "../service/userProductsOrdersService";

export async function updateUserState(
  mainState: MainStateType,
  setMainState: (m: MainStateType) => void
) {
  const _allOrigins: any[] = await originsService._get();
  const _allBrands: any[] = await brandsService._get();
  const _allUnits: any[] = await unitsService._get();
  const _allCategories: any[] = await categoriesService._get();
  const _allProducts: any[] = await productsService._get();
  const _allUsersProfiles: any[] = await registerdUsersService._get();
  const _alluserProducts: any[] = await usersProductsService._get();
  const _allUsersOrders: any[] = await usersOrdersService._get();
  const _allUserProductOrders: any[] = await userProductsOrdersService._get();
  const { user } = mainState;

  //========================================================================================================

  // All Products
  _allProducts.forEach((product) => {
    product.brand = _allBrands.find((b) => b.id === product.brandid);
    product.origin = _allOrigins.find((or) => or.id == product.originid);
    product.category = _allCategories.find((c) => c.id == product.categoryid);
    product.unit = _allUnits.find((u) => u.id == product.unitid);
  });
  _allCategories.forEach((category) => {
    category.products = _allProducts.filter((p) => p.categoryid == category.id);
    category.subcategories = _allProducts.filter(
      (p) => p.categoryid == category.parentid
    );
  });

  //========================================================================================================

  // _all User and Products and user Order

  _allUsersProfiles.forEach((userProfile: any) => {
    userProfile.userProducts = _alluserProducts.filter(
      (up: any) => up.userid == userProfile.userid
    );
    userProfile.userProducts.forEach((up: any) => {
      up.product = _allProducts.find((p: any) => p.id == up.productid);
    });
    userProfile.orders = _allUsersOrders.filter(
      (o: any) => o.userprofileid == userProfile.id
    );
    userProfile.startOrder = _allUsersOrders.filter(
      (so: any) => so.status === 0
    );
    userProfile.endOrder = _allUsersOrders.filter((so: any) => so.status !== 0);
    userProfile.orders.forEach((userOrder: any) => {
      userOrder.userProducts = _allUserProductOrders.filter(
        (upo) => upo.orderid == userOrder.id
      );
      userOrder.userProducts.forEach((upo: any) => {
        upo.myUserProduct = userProfile.userProducts.find(
          (up: any) => up.id == upo.userproductid
        );
      });
    });
  });

  // user and all Products

  const _userProducts = _alluserProducts.filter((up) => up.userid == user?.id);

  _userProducts.forEach((up) => {
    const product = _allProducts.find((p) => p.id === up.productid);
    if (product) {
      up.product = product;
      product.brand = _allBrands.find((br) => br.id == product.brandid);
      product.origin = _allOrigins.find((or) => or.id == product.originid);
      product.category = _allCategories.find(
        (cat) => cat.id == product.categoryid
      );
      if (!product.category.userProducts) product.category.userProducts = [];
      product.category.userProducts.push(up);
      product.unit = _allUnits.find((un) => un.id == product.unitid);
    }
  });

  // selected Users
  mainState.userProfile = _allUsersProfiles.find((u) => u.userid == user?.id);

  mainState.allUserOrder = _allUsersOrders;
  mainState.allOrigins = _allOrigins;
  mainState.allBrands = _allBrands;
  mainState.allUnits = _allUnits;
  mainState.allCategories = _allCategories;
  mainState.allProducts = _allProducts;

  //========================================================================================================
  if (!user) {
    mainState.render = "usersCard";
    mainState.UsersStore = _userProducts;
    mainState.allUsersProfiles = _allUsersProfiles;
    mainState.allUserOrder = _allUsersOrders;
    mainState.allOrigins = _allOrigins;
    mainState.allBrands = _allBrands;
    mainState.allUnits = _allUnits;
    mainState.allCategories = _allCategories;
    mainState.allProducts = _allProducts;
    mainState.allUserProductOrders = _allUserProductOrders;
  } else {
    if (user.authorization === "admin") {
      mainState.render = "units";
    }
    if (user.authorization === "user") {
      mainState.render = "usersCard";
      mainState.UsersStore = _userProducts;
      mainState.allUsersProfiles = _allUsersProfiles;
      mainState.allUserOrder = _allUsersOrders;
      mainState.allOrigins = _allOrigins;
      mainState.allBrands = _allBrands;
      mainState.allUnits = _allUnits;
      mainState.allCategories = _allCategories;
      mainState.allProducts = _allProducts;
      mainState.allUserProductOrders = _allUserProductOrders;
      mainState.userProfile = _allUsersProfiles.find(
        (u) => u.userid == user?.id
      );
    }
  }
  setMainState({ ...mainState });
}
