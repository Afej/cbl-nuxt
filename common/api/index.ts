import axios, {
  type Method,
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type ResponseType,
} from 'axios'

export interface Request {
  headers?: Record<string, string>
  data?: any
  params?: any
  responseType?: ResponseType
}

class Api {
  private api: AxiosInstance
  private static instance: Api

  private constructor() {
    this.api = axios.create({
      timeout: 60000,
    })
    this.setupInterceptors()
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api()
    }
    return Api.instance
  }

  private setupInterceptors() {
    this.api.interceptors.request.use((config) => {
      // Add any common headers or configurations here specific to your API/Project
      // const token = useCookie('token').value

      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }
      return config
    })

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
        }
        return Promise.reject(error)
      }
    )
  }

  public setBaseUrl(url: string) {
    this.api.defaults.baseURL = url
  }

  public setToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  private async handleRequest<T>(
    url: string,
    method: Method,
    config: Request = {}
  ): Promise<AxiosResponse<T>> {
    const { headers, data, params, responseType } = config
    const response = await this.api.request<T>({
      url,
      method,
      data,
      params,
      headers,
      responseType,
    })
    return response
  }

  public get<T>(url: string, config: Request = {}): Promise<AxiosResponse<T>> {
    return this.handleRequest<T>(url, 'get', config)
  }

  public post<T>(url: string, config: Request = {}): Promise<AxiosResponse<T>> {
    return this.handleRequest<T>(url, 'post', config)
  }

  public put<T>(url: string, config: Request = {}): Promise<AxiosResponse<T>> {
    return this.handleRequest<T>(url, 'put', config)
  }

  public delete<T>(
    url: string,
    config: Request = {}
  ): Promise<AxiosResponse<T>> {
    return this.handleRequest<T>(url, 'delete', config)
  }

  public patch<T>(
    url: string,
    config: Request = {}
  ): Promise<AxiosResponse<T>> {
    return this.handleRequest<T>(url, 'patch', config)
  }
}

export default Api.getInstance()
