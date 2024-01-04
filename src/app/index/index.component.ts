import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent{
  isMenuListVisible: boolean = false;
  isMenuListVisibleVoucher: boolean = false;
  isMenuListVisibleNew: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  toggleMenuList() {
    this.isMenuListVisible = !this.isMenuListVisible;
  }
  toggleMenuListVoucher() {
    this.isMenuListVisibleVoucher = !this.isMenuListVisible;
  }
  toggleMenuListNew() {
    this.isMenuListVisibleNew = !this.isMenuListVisible;
  }
}
