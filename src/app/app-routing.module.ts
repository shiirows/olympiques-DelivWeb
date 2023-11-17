import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailPaysComponent } from './pages/detail-pays/detail-pays.component';

const routes: Routes = [
  {path: 'detailpays/:id', component: DetailPaysComponent},
  { path: '',component: HomeComponent},
  {path: '**',component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
