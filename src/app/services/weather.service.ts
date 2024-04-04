import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environments } from 'src/environments/environment';
import { WeatherEnum } from "src/app/interfaces/interface";
import { DailyWeather } from "src/app/interfaces/daily-weather/daily-weather.interface";
import { ActualWeather } from '../interfaces/actual-weather/actual-weather.interface';
import { HourlyWeather } from '../interfaces/hourly-weather/hourly-weather.interface';

@Injectable({providedIn: 'root'})
export class WeatherService {

  private baseUrlLocal: string = environments.baseUrlLocalhost;
  private baseUrlRemote: string = environments.baseUrlOnline;
  private apiKey: string = environments.apiKey;
  private weatherEnum:WeatherEnum = {
    "Clear":"sun.png",
    "few clouds":"weather.png",
    "scattered clouds":"cloud.png",
    "broken clouds":"cloudy.png",
    "Snow":"snowy.png",
    "Rain":"rainy.png",
    "Thunderstorm":"storm.png",
    "overcast clouds":"cloudy.png",
    "Mist":"wind2.png",
    "light rain":"light-rain.png"
  }
  constructor(private httpClient: HttpClient){}

    getDatosTiempoActual(ciudad:string ): Observable<ActualWeather>{
      return this.httpClient.get<ActualWeather>(`${this.baseUrlRemote}/weather?q=${ciudad}&units=metric&APPID=${this.apiKey}`).pipe(
      tap((value: any) => {console.log(value);
      })
      );
    }
    getDatosTiempo3h5d(ciudad:string ): Observable<HourlyWeather>{
      return this.httpClient.get<HourlyWeather>(`${this.baseUrlRemote}/forecast?q=${ciudad}&units=metric&APPID=${this.apiKey}`).pipe(
      tap((value: any) => {console.log(value);
      })
      );
    }
    getDatosTiempo1d16d(ciudad:string ): Observable<DailyWeather>{
      return this.httpClient.get<DailyWeather>(`${this.baseUrlRemote}/forecast/daily?q=${ciudad}&units=metric&APPID=${this.apiKey}`).pipe(
      tap((value: any) => {console.log(value);
      })
      );
    }
    getDatosTiempo1h4d<T>(ciudad:string ): Observable<T[]>{
      return this.httpClient.get<T[]>(`${this.baseUrlRemote}/forecast/hourly?q=${ciudad}&units=metric&APPID=${this.apiKey}`).pipe(
      tap((value: any) => {console.log(value);
      })
      );
    }
    getWeatherImage(weatherType:string,weatherDescription: string):string{
      let weather:string = this.weatherEnum[weatherType];
      if (weatherType === "Clouds" || weatherDescription === "light rain") {
        weather = this.weatherEnum[weatherDescription]
      }
      return weather || this.weatherEnum["few clouds"];
    }
  }
