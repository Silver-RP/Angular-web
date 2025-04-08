import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { HeadComponent } from '../../layout/head/head.component';
import { DetailsChildComponent } from '../../components/details/details/details.component';
import { RelatedProductsComponent } from "../../components/details/related/related.component";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeadComponent,
    DetailsChildComponent,
    RelatedProductsComponent
],

  
})
export class DetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}



