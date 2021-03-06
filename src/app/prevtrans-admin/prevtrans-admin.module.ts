import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import {PrevtransAdminRoutes} from './prevtrans-admin-routing.module';
import { PrevtransAdminComponent } from './prevtrans-admin.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(PrevtransAdminRoutes)
  ],
  declarations: [HeaderAdminComponent, PrevtransAdminComponent],
})
export class PrevtransAdminModule { }

