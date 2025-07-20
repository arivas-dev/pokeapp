import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  trainerName: string = 'José';

  constructor() { }

  ngOnInit(): void {
    // Load trainer name from localStorage if available
    const trainerProfileData = localStorage.getItem('trainerProfile');
    if (trainerProfileData) {
      try {
        const profileData = JSON.parse(trainerProfileData);
        this.trainerName = profileData.name || 'José';
      } catch (error) {
        console.error('Error parsing trainer profile data:', error);
      }
    }
  }

  onProfileDropdown(): void {
    console.log('Profile dropdown clicked');
    // TODO: Show profile dropdown menu
  }

  onSearch(): void {
    console.log('Search clicked');
    // TODO: Implement search functionality
  }
}
