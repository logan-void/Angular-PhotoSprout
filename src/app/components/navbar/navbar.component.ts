import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user = computed(() => this.authService.user());
  loading = computed(() => this.authService.loading());

  constructor(private authService: AuthService, private router: Router) {}


  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  };
};
