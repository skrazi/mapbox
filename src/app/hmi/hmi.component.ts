import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-hmi',
  templateUrl: './hmi.component.html',
  styleUrls: ['./hmi.component.css']
})
export class HmiComponent implements OnInit {
  id: number;
  description: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id =+params['id'];
      }
    )

    // To get the name of the location
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.description = queryParams['description'];
      }
    )
  }

}
