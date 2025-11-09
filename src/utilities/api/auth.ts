import ApiRequest from './apiPrototype'

export interface LoginRequest {
  username: string
  password: string
  classname: string
}

export interface ChangePasswordRequest {
  oldpassword: string
  newpassword: string
}

export interface UserInfoResponse {
  username: string
  studentID: string
}

export interface IsLoginResponse {
  valid: boolean
}

export default class AuthApi extends ApiRequest {
  constructor (baseURL = '/') {
    super(baseURL)
	}

  public async login (data: LoginRequest): Promise<void> {
    return this.apiClient.post<void>('/auth/login', data).then(response => response.data)
	}

  public async logout (): Promise<void> {
    return this.apiClient.post<void>('/auth/logout').then(response => response.data)
	}

  public async changePassword (data: ChangePasswordRequest): Promise<void> {
    return this.apiClient
      .post<void>('/auth/change-password', data)
      .then(response => response.data)
	}

  public async getUserInfo (): Promise<UserInfoResponse> {
    return this.apiClient
      .get<UserInfoResponse>('/auth/user-info')
      .then(response => response.data)
	}
}
