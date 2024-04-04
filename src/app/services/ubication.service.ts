import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from '@angular/core';
import { City } from "../interfaces/assets/cities-data/city-data.interface";

@Injectable({providedIn: 'root'})
export class UbicationService{
  public citiesName: City[] = [];
  constructor(private http:HttpClient) { }

  public loadCities():void{
     this.http.get<City[]>('../../assets/cities-data/city-list.json').subscribe((data:City[])=>{
      this.citiesName = data;
     })
  }

}
