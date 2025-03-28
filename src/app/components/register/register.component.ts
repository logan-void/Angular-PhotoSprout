import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );
  };

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService
        .register(email!, password!)
        .then(() => {
          console.log('User registered successfully');
          return this.authService.login(email!, password!);
        })
        .then(() => console.log('user logged in successfuly'))
        .then(() => this.router.navigate(['/']))
        .catch((err) => console.error(err));
    };
  };

  get emailControl() {
    return this.registerForm.get('email');
  };

  get passwordControl() {
    return this.registerForm.get('password');
  };

  get repeatPasswordControl() {
    return this.registerForm.get('repeatPassword');
  };

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsNotMatching: true };
  };
};
