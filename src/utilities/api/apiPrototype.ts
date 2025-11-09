import axios, { type AxiosInstance } from 'axios'

export interface ApiError {
  code?: string
  message: string
}

export default class ApiRequestPrototype {
  protected apiClient: AxiosInstance

  constructor (baseURL = '/') {
    this.apiClient = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.apiClient.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.data) {
          throw error.response.data as ApiError
        }
        throw error
      },
    )
  }
}
