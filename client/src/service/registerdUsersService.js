import httpService from "./httpService";
const tableName = "usersprofiles";
const arr = ["userid", "publishednameen", "publishednamear","logo"];

async function _get() {
    return await httpService._get(tableName);  
}

// async function _delete(id) {
//   await httpService._delete(id,tableName);
// }
async function _save(item) {
 return await httpService._save(item,arr,tableName)
 }

async function getUserProfile(user){
    const allUsers = await _get();
    const _userProfile = allUsers.find(u=>u.userid == user.id)
    return _userProfile;
}

export default{
  getUserProfile,
  _get,
  _save,
//   _delete
}