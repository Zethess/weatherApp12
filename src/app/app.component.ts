import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, interval, of, throwError} from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { WeatherService } from './services/weather.service';
import { UbicationService } from './services/ubication.service';
import { DailyWeather, List, Weather } from './interfaces/daily-weather/daily-weather.interface';
import { ActualWeather } from './interfaces/actual-weather/actual-weather.interface';
import { List2 } from './interfaces/hourly-weather/hourly-weather.interface';
import { Chart, ChartConfiguration } from 'chart.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'weatherApp';

  horaActual$!: Observable<string> ;
  proximosDias: string[] = [];
  tiempoDiario: List[] = [];
  tiempoHoras: List2[] = [];
  tiempoActual: ActualWeather | null = null;
  cityName: string = 'Cáceres';
  inputValue: string = '';
  iscityNameValid: boolean = true;
  private weatherSubscription: Subscription | undefined;
  private weatherActualSubscription: Subscription | undefined;
  private weatherByHoursSubscription: Subscription | undefined;
  private dailyTemperature: number[] = [];
  constructor(
    private weatherService:WeatherService,
    private ubicationService:UbicationService
  ){}

ngOnInit(): void {
  this.horaActual$ = interval(60000).pipe(
    // Emite un valor inicial para que se cargue al inicio de la aplicación
      startWith(0),
      map(() => {
        const fecha = new Date();
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        return `${horas}:${minutos}`;
      })
    );
    this.calcularProximosDias();
    this.getDatosTiempo3h5d('Cáceres');
    this.ubicationService.loadCities();
    }
public onEnterKeyPress(): void {
  if (this.inputValue.length >= 2) {

    let inputValueMatch = false;
    let i = 0;
    while(!inputValueMatch &&  i < this.ubicationService.citiesName.length){
      if(this.ubicationService.citiesName[i].name.toLowerCase() === this.inputValue.toLowerCase()){
        inputValueMatch = true;
        this.getDatosTiempo3h5d(this.inputValue);
        this.cityName = this.inputValue;
      }
      i++;
    }
    console.log(inputValueMatch);

  }
}

public calcularProximosDias(): void {
  for (let i = 0; i < 7; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    this.proximosDias.push(fecha.toLocaleDateString('es-ES', { weekday: 'long' }));
  }
}

public getWeatherImage(weather: Weather[]): string {
  const firstWeather:any = weather[0];
  return this.weatherService.getWeatherImage(firstWeather[0].main, firstWeather[0].description);
}
public getActaulWeatherImage(weather: Weather[]): string {
  const firstWeather:any = weather[0];
  return this.weatherService.getWeatherImage(firstWeather.main, firstWeather.description);
}

public getWeatherName(weather:Weather[]): string {
  const firstWeather:any = weather[0];
  const {main, description}:any = firstWeather[0]

  if (main === "Clouds" || description === "light rain") {
   return description.charAt(0).toUpperCase() + description.slice(1);
  }

  return main;
}
public getActualWeatherName(weather:Weather[]): string {
  const firstWeather:any = weather[0];
  const {main, description}:any = firstWeather

  if (main === "Clouds" || description === "light rain") {
   return description.charAt(0).toUpperCase() + description.slice(1);
  }

  return main;
}
private getDatosTiempoDiario(ciudad: string): void{
  if (this.weatherSubscription) {
    this.weatherSubscription.unsubscribe();
  }
  this.weatherSubscription = this.weatherService.getDatosTiempo1d16d(ciudad)
  .subscribe((datos) => {
    console.log(datos);
    this.tiempoDiario = datos.list;
    this.getDailyTemperature(datos);
  });
}
private getDatosTiempoActual(ciudad: string): void{
  if (this.weatherActualSubscription) {
    this.weatherActualSubscription.unsubscribe();
  }
  this.weatherActualSubscription = this.weatherService.getDatosTiempoActual(ciudad)
  .subscribe((datos) => {
    console.log(datos);
    this.tiempoActual = datos;
  });
}
private getDatosTiempo3h5d(ciudad: string): void {
  if (this.weatherByHoursSubscription) {
    this.weatherByHoursSubscription.unsubscribe();
  }
  this.weatherByHoursSubscription = this.weatherService.getDatosTiempo3h5d(ciudad)
  .subscribe(datos => {
    if (datos !== null) {
      this.getDatosTiempoDiario(this.cityName);
      this.getDatosTiempoActual(this.cityName);
      this.tiempoHoras = datos.list;
    }
  });
}
private getDailyTemperature(data:DailyWeather){
  this.dailyTemperature = [];
  for (let index = 0; index < this.proximosDias.length; index++) {
    this.dailyTemperature.push(Math.round(data.list[index].temp.eve));
  }
  this.createNewChart();
}
private createNewChart():void{
  let chartConfig = {
    type: 'line',
    data: {
        labels: this.proximosDias.map(function(dia) {
          return dia.substring(0, 3);
      }),
        datasets: [{
            label: 'Temperatura',
            data: this.dailyTemperature,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                  display: false
                }
            }],
            xAxes: [{
                gridLines: {
                  display: false
                }
            }]
        },

    }
};
  new Chart("myChart", chartConfig);
}

}
