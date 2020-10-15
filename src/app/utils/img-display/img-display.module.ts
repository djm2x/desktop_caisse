import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgDisplayComponent } from './img-display.component';

@NgModule({
  declarations: [ImgDisplayComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ImgDisplayComponent
  ]
})
export class ImgDisplayModule { }
