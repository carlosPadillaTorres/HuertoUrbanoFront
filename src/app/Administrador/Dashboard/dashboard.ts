import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BarraNavegacion],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private salesChart: any;
  private customerChart: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initSalesChart();
      this.initCustomerChart();

      const openSidebarBtn = document.getElementById('openSidebar');
      const closeSidebarBtn = document.getElementById('closeSidebar');
      const sidebar = document.querySelector('.sidebar');

      if (openSidebarBtn && sidebar) {
        openSidebarBtn.addEventListener('click', () => {
          sidebar.classList.add('active');
        });
      }

      if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
          sidebar.classList.remove('active');
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      if (this.salesChart) {
        this.salesChart.destroy();
      }
      if (this.customerChart) {
        this.customerChart.destroy();
      }
    }
  }

  private async initSalesChart(): Promise<void> {
    if (this.isBrowser) {
      const { default: Chart } = await import('chart.js/auto');

      const salesCtx = document.getElementById('salesChart') as HTMLCanvasElement;
      if (salesCtx) {
        this.salesChart = new Chart(salesCtx, {
          type: 'line',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
              label: 'Ventas ($)',
              data: [6500, 5900, 8000, 8100, 8600, 8550, 9000, 9800, 10200, 10500, 10700, 11200],
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                },
                border: {
                  display: false
                }
              },
              x: {
                grid: {
                  display: false
                },
                border: {
                  display: false
                }
              }
            }
          }
        });
      }
    }
  }

  private async initCustomerChart(): Promise<void> {
    if (this.isBrowser) {
      const { default: Chart } = await import('chart.js/auto');

      const customerCtx = document.getElementById('customerChart') as HTMLCanvasElement;
      if (customerCtx) {
        this.customerChart = new Chart(customerCtx, {
          type: 'bar',
          data: {
            labels: ['Orgánico', 'Directo', 'Referido', 'Social', 'Email', 'Otros'],
            datasets: [{
              label: 'Clientes',
              data: [320, 180, 150, 85, 65, 40],
              backgroundColor: [
                'rgba(79, 70, 229, 0.7)', 'rgba(99, 102, 241, 0.7)',
                'rgba(129, 140, 248, 0.7)', 'rgba(165, 180, 252, 0.7)',
                'rgba(199, 210, 254, 0.7)', 'rgba(224, 231, 255, 0.7)'
              ],
              borderColor: [
                'rgba(79, 70, 229, 1)', 'rgba(99, 102, 241, 1)',
                'rgba(129, 140, 248, 1)', 'rgba(165, 180, 252, 1)',
                'rgba(199, 210, 254, 1)', 'rgba(224, 231, 255, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: false
                },
                border: {
                  display: false
                }
              },
              x: {
                grid: {
                  display: false
                },
                border: {
                  display: false
                }
              }
            }
          }
        });
      }
    }
  }

  updateSalesChart(period: string): void {
    console.log(`Actualizando gráfico de ventas para: ${period}`);
    if (this.salesChart && this.isBrowser) {

    }
  }

  updateCustomerChart(event: Event): void {
    if (this.isBrowser) {
      const selectElement = event.target as HTMLSelectElement;
      const period = selectElement.value;
      console.log(`Actualizando gráfico de clientes para: ${period}`);
    }
  }


}
