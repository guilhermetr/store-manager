import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageDisplayService } from 'src/app/services/message-display.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private messageDisplayService: MessageDisplayService
  ) { }

  login() {
    this.authService.login(this.username, this.password).subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.router.navigate(['/products']);
      }
    });
  }
  
}
