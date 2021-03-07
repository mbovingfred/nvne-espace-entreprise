import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faFolder } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-nvne-input-file',
  templateUrl: './nvne-input-file.component.html',
  styleUrls: ['./nvne-input-file.component.css']
})
export class NvneInputFileComponent implements OnInit {
  faFolder = faFolder;
  @Input() public ngModel:string;

  @Input() public accept:string;

  @Input() public name:string;

  @Input() public requiredProperty:string;

  @Input() public placeholder:string;

  @Input() public max:string;

  @Input() public disabledProperty:string;

  @Output() onChangeEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public selectFile(event) {
    console.log(event.target);
    console.log("Setting kbis "+event);
    this.onChangeEvent.emit(event);
  }

}
