export type MainStateType = {
  render: string;
  language: string;
  user: RegisteredUserType | null;
  allOrigins: OriginType[];
  allBrands: BrandType[];
  allUnits: UnitType[];
  allCategories: CategoryType[];
  allProducts: ProductType[];
  allUsersProfiles: UserProfileType[];
  allUserProductOrders: UsersOrdersProductType[];
  UsersStore: UsersStoreType[];
  userProfile: UserProfileType | null | any;
  selectedUser: UserProfileType | null;
  currentOrder: UserOrderType | null | any;
  allUserOrder: UserOrderType[];
};

// user
export type RegisteredUserType = {
  id: number;
  name: string;
  authorization: string;
};

// user Order Products
export type UsersOrdersProductType = {
  id?: number;
  orderid: number;
  userproductid: number;
  quantity: number;
  unitprice: number;
};

// Origin Type
export type OriginType = {
  id: number;
  nameen: string;
  namear: string;
  flag: string;
};

// brand Type

export type BrandType = {
  id: number;
  nameen: string;
  namear: string;
  descriptionen: string;
  descriptionar: string;
  logo: string;
};

// Unit Type
export type UnitType = {
  id: number;
  nameen: string;
  namear: string;
};

// Category Type
export type CategoryType = {
  id: number;
  nameen: string;
  namear: string;
  descriptionen: string;
  descriptionar: string;
  logo: string;
  parentid: number;
  publishednameen: string;
  publishednamear: string;
  categorytype: number;
};

// Product Type
export type ProductType = {
  id: number;
  barcode: string;
  descriptionen: string;
  descriptionar: string;
  image: string;
  originid: number;
  brandid: number;
  categoryid: number;
  quantity: number;
  unitid: number;
};

//  User Profile Type
export type UserProfileType = {
  id: number;
  userProducts: any;
  userid: number;
  publishednameen: string;
  publishednamear: string;
  logo: string;
  startOrder: UsersOrdersProductType;
  endOrder: UsersOrdersProductType;
};

//  Users Store Type

export type UsersStoreType = {
  product: any;
  id: number;
  userid: number;
  productid: string;
  quantity: number;
  costprice: number;
  salesprice: number;
};

// User Order Type

export type UserOrderType = {
  id: number;
  clientname: string;
  clienttel: string;
  userprofileid: number;
  startdate?: string;
  enddate?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  userProducts: UsersOrdersProductType[];
  startOrder: UsersOrdersProductType[];
  endOrder: UsersOrdersProductType[];
};
