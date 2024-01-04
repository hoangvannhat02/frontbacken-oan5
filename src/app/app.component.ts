import { AfterContentInit, AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'admin-front';
  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) { }
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
    }
  }
  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      const clickedElement = event.target as HTMLElement;
      const closestBoxManageMenu = clickedElement.closest('.box-manage-menu');
      const closestBoxUser = clickedElement.closest('.box-user');
      if (closestBoxManageMenu) {
        event.preventDefault();
        const menuListElement = closestBoxManageMenu.nextElementSibling as HTMLElement;

        if (menuListElement) {
          this.renderer.setStyle(menuListElement, 'display', (menuListElement.style.display === 'none' || !menuListElement.style.display) ? 'block' : 'none');
        }
      } else if (closestBoxUser) {
        const itemBoxUser = closestBoxUser.nextElementSibling as HTMLElement;
        console.log(itemBoxUser);

        if (itemBoxUser) {
          console.log(123);
          const hasHiddenClass = itemBoxUser.classList.contains('hidden');

          if (hasHiddenClass) {
            this.renderer.removeClass(itemBoxUser, 'hidden');
          } else {
            this.renderer.addClass(itemBoxUser, 'hidden');
          }
        }
       }

    });


  }
  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }
}
