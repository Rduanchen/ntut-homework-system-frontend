import ApiRequest from './apiPrototype'

export interface ClassListResponse {
  classList: string[]
}

export interface LoginAmountResponse {
  amount: number
}

export default class SystemApi extends ApiRequest {
  constructor (baseURL = '/') {
    super(baseURL)
  }

  async getClassList (): Promise<ClassListResponse> {
    const response = await this.apiClient.get<ClassListResponse>('/system/class-list')
    return response.data
  }

  async getLoginAmount (): Promise<LoginAmountResponse> {
    const response = await this.apiClient.get<LoginAmountResponse>('/system/login-amount')
    return response.data
  }
}
