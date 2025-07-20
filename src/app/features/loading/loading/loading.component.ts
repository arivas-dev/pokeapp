import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Navigate to pokemon team after 3 seconds
    setTimeout(() => {
      this.router.navigate(['/pokemon-team']);
    }, 3000);
  }

}
