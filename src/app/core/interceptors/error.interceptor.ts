import { HttpInterceptorFn } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe();
  // Nota (por qué): Dejarlo minimal ahora. Si quieren, agregan catchError para mapear mensajes y toasts.
};
