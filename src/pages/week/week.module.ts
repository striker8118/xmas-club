import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeekPage } from './week';

@NgModule({
  declarations: [
    WeekPage,
  ],
  imports: [
    IonicPageModule.forChild(WeekPage),
  ],
  exports: [
    WeekPage
  ]
})
export class WeekModule {}
