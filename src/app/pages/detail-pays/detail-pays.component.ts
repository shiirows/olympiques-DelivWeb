import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { Heading } from 'src/app/core/models/Heading';

@Component({
  selector: 'app-detail-pays',
  templateUrl: './detail-pays.component.html',
  styleUrls: ['./detail-pays.component.scss'],
})
export class DetailPaysComponent implements OnInit, OnDestroy {
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public olympics$: Observable<Olympic[] | null> = of(null);
  destroy$: Subject<boolean> = new Subject();

  public olympic: Olympic;
  public countryId: number;
  public totalMedalsCount: number = 0;
  public totalAthletesCount: number = 0;
  public totalParticipationCount: number = 0;
  public heading: Heading;

  ngOnInit(): void {
    this.countryId = +this.route.snapshot.params['id'];
    this.olympics$ = this.olympicService.getOlympics();
    this.getDataByPaysId(this.countryId);
  }

  getDataByPaysId(countryId: number): void {
    if (this.olympics$) {
      this.olympics$
        .pipe(takeUntil(this.destroy$))
        .subscribe((olympics: Olympic[]) => {
          this.olympic = olympics.find((country) => country.id === countryId);
          if (this.olympic) {
            this.configureLineChart();
            this.additionMedals();
            this.additionAthlete();
            this.additionCountry();
            this.updateHeadingData();
          } else {
            console.error(
              'Aucune correspondance trouvée pour countryId : ' + countryId
            );
          }
        });
    } else {
      console.error('this.olympics$ est undefined');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private updateHeadingData(): void {
    // Mise à jour des données de heading à l'intérieur du subscribe
    this.heading = {
      title: this.olympic.country,
      items: [
        {
          action: 'Number of entries',
          data: this.totalParticipationCount,
        },
        {
          action: 'Total number medals',
          data: this.totalMedalsCount,
        },
        {
          action: 'Total number of athletes',
          data: this.totalAthletesCount,
        },
      ],
    };
  }

  public additionMedals(): void {
    if (this.olympic && this.olympic.participations) {
      this.totalMedalsCount = this.olympic.participations.reduce(
        (acc, participation) => acc + participation.medalsCount,
        0
      );
    }
  }

  public additionAthlete(): void {
    let totalAthletes = 0;
    if (this.olympic && this.olympic.participations) {
      this.olympic.participations.forEach((participation) => {
        totalAthletes += participation.athleteCount;
      });
    }
    this.totalAthletesCount = totalAthletes;
  }

  public additionCountry(): void {
    if (this.olympic && this.olympic.participations) {
      const uniqueCountries = new Set();

      this.olympic.participations.forEach((participation) => {
        uniqueCountries.add(participation.city);
      });

      this.totalParticipationCount = uniqueCountries.size;
    }
  }

  public configureLineChart(): void {
    let root = am5.Root.new('chartdiv');

    const participations = this.olympic.participations;

    const formattedParticipations = participations.map((participation) => ({
      year: participation.year,
      city: participation.city,
      medalsCount: participation.medalsCount,
    }));

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
        pinchZoomX: true,
      })
    );

    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    // The data
    const data = formattedParticipations;

    let xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.grid.template.set('location', 0.5);
    xRenderer.labels.template.setAll({
      location: 0.5,
      multiLocation: 0.5,
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'year',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: false,
        }),
      })
    );

    function createSeries(name, field): void {
      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          categoryXField: 'year',
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: 'horizontal',
            labelText: '[bold]{name}[/]: {valueY}',
          }),
        })
      );

      series.bullets.push(function (): am5.Bullet {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 5,
            fill: series.get('fill'),
          }),
        });
      });

      series.set('setStateOnChildren', true);
      series.states.create('hover', {});

      series.mainContainer.set('setStateOnChildren', true);
      series.mainContainer.states.create('hover', {});

      series.strokes.template.states.create('hover', {
        strokeWidth: 4,
      });

      series.data.setAll(data);
      series.appear(1000);
    }

    createSeries('medalsCount', 'medalsCount');

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    legend.itemContainers.template.states.create('hover', {});

    legend.data.setAll(chart.series.values);
    chart.appear(1000, 100);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
