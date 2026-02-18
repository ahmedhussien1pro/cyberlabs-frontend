import type { InternalAxiosRequestConfig } from 'axios';

class RequestQueue {
  private static instance: RequestQueue;
  private queue: Array<{
    config: InternalAxiosRequestConfig;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  private constructor() {}

  public static getInstance(): RequestQueue {
    if (!RequestQueue.instance) {
      RequestQueue.instance = new RequestQueue();
    }
    return RequestQueue.instance;
  }

  add(config: InternalAxiosRequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ config, resolve, reject });
    });
  }

  async processQueue(token: string, axiosInstance: any): Promise<void> {
    const requests = [...this.queue];
    this.queue = [];

    for (const { config, resolve, reject } of requests) {
      try {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const response = await axiosInstance(config);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    }
  }

  rejectQueue(error: any): void {
    const requests = [...this.queue];
    this.queue = [];

    for (const { reject } of requests) {
      reject(error);
    }
  }

  clear(): void {
    this.queue = [];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

export const requestQueue = RequestQueue.getInstance();
