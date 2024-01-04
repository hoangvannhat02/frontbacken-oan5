import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private renderer:Renderer2,private router:Router){}
  user:any;
  ngOnInit(): void {
    let getdatauser = localStorage.getItem("user")
    let data = getdatauser ? JSON.parse(getdatauser) : []
    if(getdatauser){
      this.user = data
      console.log(this.user);
      
    }
  }


  logout(){
    localStorage.removeItem("user");
    this.router.navigate(["/login"])
  }
  // ngAfterViewInit(): void {
  //   this.renderer.listen('document', 'click', (event) => {
  //     event.preventDefault();
  //     const clickedElement = event.target as HTMLElement;

  //     // Kiểm tra nếu phần tử được click có class là 'box-manage-menu'
  //     if (clickedElement.classList.contains('box-manage-menu')) {
  //       const menuListElement = clickedElement.nextElementSibling as HTMLElement;
  //       if(menuListElement){
  //         this.renderer.setStyle(menuListElement, 'display', (menuListElement.style.display === 'none' || !menuListElement.style.display) ? 'block' : 'none');
  //       }
  //     }
  //   });
  // }
}
