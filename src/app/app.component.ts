import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('search', { static: false }) search: any;

  title = 'countries-rest-api';

  countries: any;

  countriesCopy: any;

  selected: any = [];

  regionList: any;

  searchKey: any;

  url = 'https://restcountries.com/v3.1/all';

  countries2Show: any;

  theme = Theme.LIGHT;

  countrySelected = false;

  country: any;

  loader = false;

  searchDebouncer: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getCountries();
    this.theme = (localStorage.getItem('theme') as Theme) ?? this.theme;
  }

  getCountries() {
    this.loader = true;
    this.http.get(this.url).subscribe({
      next: (result) => {
        this.countries = result;
        this.countriesCopy = [...this.countries];
        this.countries2Show = [...this.countries];
        this.regionList = new Set(
          this.countries.map((country: { region: string }) => country?.region)
        );
        this.loader = false;
      },
      error: () => {
        this.snackBar.open('Error getting Countries', '', {
          panelClass: ['main-container-tost', 'p-0', 'text-danger'],
        });
        this.loader = false;
      },
    });
  }

  onRegionChange(): void {
    this.searchKey = '';
    this.countries2Show =
      this.selected?.length === 0
        ? [...this.countries]
        : this.countries.filter((country: { region: string }) =>
            this.selected.includes(country?.region)
          );
    this.countriesCopy = this.countries2Show;
  }

  onSearchWrapper() {
    if (this.searchDebouncer) clearTimeout(this.searchDebouncer);
    this.searchDebouncer = setTimeout(() => this.onSearch(), 555);
  }

  onSearch(): void {
    if (!this.searchKey || this.searchKey?.length === 0) {
      this.onRegionChange();
      return;
    }
    this.countries2Show = this.countriesCopy.filter(
      (country: {
        region: string;
        capital: string;
        name: { common: string };
      }) => {
        return (
          country?.region
            ?.toLowerCase()
            ?.includes(this.searchKey.toLowerCase()) ||
          country?.capital?.[0]
            ?.toLowerCase()
            ?.includes(this.searchKey.toLowerCase()) ||
          country?.name?.common
            ?.toLowerCase()
            ?.includes(this.searchKey.toLowerCase())
        );
      }
    );
  }

  themeChange() {
    this.theme = this.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    localStorage.removeItem('theme');
    localStorage.setItem('theme', this.theme);
  }

  onCountry(country: any) {
    this.countrySelected = true;
    this.country = country;
  }

  back($event: boolean) {
    if ($event) this.countrySelected = false;
  }

  home() {
    this.back(true);
  }
}
