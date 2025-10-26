import 'document-register-element'; // por compatibilidad amplia
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ElementHostComponent } from './app/element-host.component';

(async () => {
  const app = await createApplication(appConfig); // usa tus routes + http + interceptors
  const ElementCtor = createCustomElement(ElementHostComponent, { injector: app.injector });
  customElements.define('medilog-app', ElementCtor);
})().catch(err => console.error(err));