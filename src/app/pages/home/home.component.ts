import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { ChartData } from 'src/app/core/models/ChartData';
import { Heading } from 'src/app/core/models/Heading';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private olympicService: OlympicService,
    private route: Router,
    private el: ElementRef
  ) {}

  public olympics$: Observable<Olympic[] | null> = of(null);
  destroy$: Subject<boolean> = new Subject();
  public chartData: ChartData[] = [];
  public totalPays: number = 0;
  public totalJos: number = 0;
  isMobile: boolean = true;

  public heading: Heading;

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics: Olympic[]) => {
      if (olympics) {
        olympics.forEach((olympic: Olympic) => {
          this.chartData.push({
            id: olympic.id,
            label: olympic.country,
            data: olympic.participations.map(
              (participation: any) => participation.medalsCount
            ),
          });
          this.totalJos += olympic.participations.length;
        });
        this.configurePieChart();
        this.totalPays = this.chartData.length;

        this.updateHeadingData();
      }
    });
  }

  private updateHeadingData(): void {
    // Mise à jour des données de heading à l'intérieur du subscribe
    this.heading = {
      title: 'Medals per country',
      items: [
        {
          action: 'Number of JOs',
          data: this.totalJos,
        },
        {
          action: 'Number of Country',
          data: this.totalPays,
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public configurePieChart(): void {
    const chartContainerWidth =
      this.el.nativeElement.querySelector('#chartdiv').clientWidth;
    if (chartContainerWidth < 500) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }

    let root = am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270,
      })
    );

    // Ajoute une série de données (tranches) au graphique en secteurs
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value', // La valeur du secteur
        categoryField: 'category', // L'étiquette du secteur
        alignLabels: this.isMobile,

        endAngle: 270,
      })
    );
    series.states.create('hidden', {
      endAngle: -90,
    });

    series.slices.template.set(
      'tooltipText',
      '{category}: [bold] {value} medal'
    );

    // étiquette du pie
    series.labels.template.setAll({
      fontSize: 20,
      text: '[bold]{category}',
      textType: 'circular',
      inside: true,
      radius: 10,
    });

    series.slices.template.events.on('click', (ev): void => {
      const dataContext = ev.target.dataItem?.dataContext as { id: number };
      if (dataContext && typeof dataContext.id === 'number') {
        this.route.navigate(['detailpays', dataContext.id]);
      }
    });

    let totalMedalsData = this.chartData.map((item: any) => ({
      id: item.id,
      category: item.label,
      value: item.data.reduce((a: number, b: number) => a + b, 0),
    }));
    series.data.setAll(totalMedalsData);
    series.appear(2000, 100);
  }
}
