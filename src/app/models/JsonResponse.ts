export class JsonResponse {
    data?: object;
    error?: object;
    meta?: object;
  
    constructor(data?: object, errors?: object, meta?: object) {
        this.data = data;
        this.error = errors;
        this.meta = meta;
    }
  }