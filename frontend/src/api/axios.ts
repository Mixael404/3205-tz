import axios, { AxiosError, type AxiosResponse } from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

interface IRequestOptions {
  path: string,
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: object,
}

const createHttpRequest = async <T>({
  path,
  method = "GET",
  data,
}: IRequestOptions): Promise<AxiosResponse<T>> => {
  return http({
    method,
    url: path,
    data,
  });
};

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API ERROR: ", error.message);
    return Promise.reject(error);
  }
)

export default createHttpRequest;