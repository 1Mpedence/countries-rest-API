import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { fromEvent, Observable, throwError } from 'rxjs';
import { catchError, map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

  theme = 'light';

  countrySelected = false;

  country: any;

  loader = false;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.theme = localStorage.getItem('theme') ?? 'light';
  }

  getCountries() {
    this.loader = true;
    this.http.get(this.url).pipe(
      map((data) => {
        this.countries = data;
      }), catchError(this.handleError)
    ).subscribe((result) => {
      this.countriesCopy = [...this.countries];
      this.countries2Show = [...this.countries];
      this.regionList = new Set(this.countries.map((country: { region: string; }) => country?.region));
      this.loader = false;
    });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  onRegionChange(): void{
    this.searchKey = '';
    this.countries2Show = (this.selected?.length === 0) ?
      [...this.countries] :
      this.countries.filter((country: { region: string; }) => this.selected.includes(country?.region));
    this.countriesCopy = this.countries2Show;
  }

  onSearch(): void{
    if(!this.searchKey || this.searchKey?.length === 0){
      this.onRegionChange();
      return;
    }
    console.log(this.countriesCopy);
    this.countries2Show = this.countriesCopy.filter((country: { region: string; capital: string; name: { common: string; }; }) => {
      return (
        country?.region?.toLowerCase()?.includes(this.searchKey.toLowerCase()) ||
        country?.capital?.[0]?.toLowerCase()?.includes(this.searchKey.toLowerCase()) || 
        country?.name?.common?.toLowerCase()?.includes(this.searchKey.toLowerCase())
      )
    })
  }

  themeChange(){
    this.theme = (this.theme === 'light') ? 'dark' : 'light'; 
    localStorage.removeItem('theme');
    localStorage.setItem('theme', this.theme);
  }

  onCountry(country: any){
    this.countrySelected = true;
    this.country = country;
    console.log(country);
  }

  back($event: boolean){
    if($event)  this.countrySelected = false;
  }

  home(){
    this.back(true);
  }

}
