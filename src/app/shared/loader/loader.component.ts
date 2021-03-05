import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { UtilService } from '../../core/services/utils/util.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() showLoader = false;
  @Input() globalInst = false;
  constructor(private utilService: UtilService) { }

  ngOnInit(): void {
    if (this.globalInst) {
      this.utilService.loader.subscribe((res) => {
        this.showLoader = res;
      });
    }
  }

}
