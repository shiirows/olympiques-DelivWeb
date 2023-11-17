import { Component, Input, OnInit } from '@angular/core';
import { Heading } from 'src/app/core/models/Heading';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {

  @Input("heading")

  public heading : Heading

  constructor() {}

  ngOnInit(): void {
  }

}