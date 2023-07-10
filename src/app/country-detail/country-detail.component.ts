import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit{

  @Input() country: any;

  @Output() back = new EventEmitter<boolean>();

  languages: string[] = [];

  ngOnInit(): void {
    this.languages = Object.values(this.country?.languages)
  }

  onBack(){
    this.back.emit(true);
  }

}
