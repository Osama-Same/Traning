import httpService from "./httpService";
const tableName = "categories";
const arr = [
  "nameen",
  "namear",
  "descriptionen",
  "descriptionar",
  "logo",
  "parentid",
  "publishednameen",
  "publishednamear",
  "categorytype",
];
async function _get() {
  const res = await httpService._get(tableName);
  return res;
}
async function _delete(id) {
  return await httpService._delete(id, tableName);
}
async function _save(item) {
  return await httpService._save(item, arr, tableName);
}
export default {
  _get,
  _save,
  _delete,
};
