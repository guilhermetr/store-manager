import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageDisplayService } from 'src/app/services/message-display.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService, 
    private router: Router,
    private messageDisplayService: MessageDisplayService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.checkPasswords })
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { notSame: true }
  }

  arePasswordsMatching(): boolean {
    const passwordControl = this.form.get('password')!;
    const confirmPasswordControl = this.form.get('confirmPassword')!;    
    return passwordControl.value === confirmPasswordControl.value;
  }
  
  register() {
    this.authService.register(this.form.get('username')!.value,  this.form.get('password')!.value).subscribe((isRegistered: boolean) => {
      if (isRegistered) {
        this.messageDisplayService.displayMessage('Usuario criado com sucesso!');
        this.router.navigate(['/login']);
      }
    });
  }
  
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!form || !form.control) {
      return false;
    }

    const isEveryControlDirty = Object.keys(form.control.controls).every(key => {
      const control = form.control.get(key);
      return control && control.dirty;
    });

    const invalidCtrl = !!(control && control.invalid && control.dirty);
    const invalidParent = !!(form.control.invalid && isEveryControlDirty);

    return invalidCtrl || invalidParent;
  }
}
