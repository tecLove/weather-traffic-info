import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { UtilService } from 'src/app/core/services/utils/util.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.scss']
})
export class HomeComponentComponent implements OnInit {
  isServerError: boolean;
  constructor(private utilService: UtilService) {
    this.isServerError = false;
   }

  ngOnInit(): void {
    this.utilService.serverError.subscribe((res) => {
      this.isServerError = res;
      if (res) {
        timer(3000).subscribe(() => {
          this.utilService.clearServerError();
        });
      }
  });
  }
}
