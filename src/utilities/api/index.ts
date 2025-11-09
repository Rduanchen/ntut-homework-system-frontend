import AuthApi from "./auth";
import SystemApi from "./system";
import HomeworkApi from "./homework";

const BASE_URL = '/api';

const api = {
  auth: new AuthApi(BASE_URL),
  system: new SystemApi(BASE_URL),
  homework: new HomeworkApi(BASE_URL),
}
export default api;