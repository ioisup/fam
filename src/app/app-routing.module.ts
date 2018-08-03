import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { HeaderLayoutComponent } from './layouts/header-layout/header-layout.component'
import { HeaderlessLayoutComponent } from './layouts/headerless-layout/headerless-layout.component'

const routes: Routes = [
  {
    path: '',
    component: HeaderLayoutComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {path: '',component: HomeComponent}
    ]
  },
  {
    path: '',
    component: HeaderlessLayoutComponent,
    children: [
      {path: 'login',component: LoginComponent, data:{title:'Login'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
