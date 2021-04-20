import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosTransformer,
  AxiosAdapter,
} from "axios"
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from "axios-extensions"

export class HttpService {
  // 싱글톤 패턴으로 axios Instance에 환경 설정
  private readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: "https://maivve.tk:8443/",
      headers: {
        "Cache-Control": "no-cache",
      },
      adapter: throttleAdapterEnhancer(
        cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter)
      ),
      transformResponse: this.getTransformResponse(),
    })
  }

  public getInstance() {
    return this.instance
  }
  private getTransformResponse(): AxiosTransformer {
    return (data: any) => {
      try {
        const _data = JSON.parse(data)
        return {
          ..._data,
        }
      } catch (error) {
        return {}
      }
    }
  }
}
