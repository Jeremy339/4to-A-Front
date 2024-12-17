import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password'
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';  // Importa FormsModule


const PrimengModules=[
  ButtonModule,
  PasswordModule,
  TableModule,
  DialogModule,
  InputTextModule,
  ToolbarModule,
  DropdownModule,
  ReactiveFormsModule,
  FormsModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...PrimengModules
  ],
  exports:[
   ...PrimengModules
  ]
})
export class PrimengModule { }
