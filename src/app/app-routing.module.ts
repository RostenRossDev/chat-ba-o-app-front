import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {FormsModule} from '@angular/forms'

const routes: Routes = [
  {path: '', redirectTo:'chat', pathMatch:'full'},
  {path: 'chat', component: ChatComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
