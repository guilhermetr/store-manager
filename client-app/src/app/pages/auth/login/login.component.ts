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
    const result = this.authService.login(this.username, this.password);
    if (result) {
      this.router.navigate(['/products']);
    } else {
      this.messageDisplayService.displayMessage('Usuario ou senha incorretos. Tente novamente.')
    }
  }
  
}
