import { Component, OnInit } from '@angular/core';
import { FoodOrderService } from '../../service/food-order.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-food-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './food-order.component.html',
  styleUrls: ['./food-order.component.css'],
})
export class FoodOrdersComponent implements OnInit {
  foodReports: any[] = [];
  totalFine = 0;
  userDetails: any;
  monthName!: string;

  constructor(private foodOrderService: FoodOrderService) { }

  ngOnInit(): void {
    this.fetchFoodReports();
  }


  fetchFoodReports(): void {
    let month = 11;
    this.monthName = this.getMonth(month);
    this.foodOrderService.getMonthlyReport(11).subscribe(
      (response) => {
        this.foodReports = response.reports || [];
        this.userDetails = response?.user;

        console.log(response);
        this.calculateTotalFine();
      },
      (error) => {
        console.error('Error fetching food reports:', error);
      }
    );
  }

  getMonth(monthNumber:number):string{
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNames[monthNumber-1]
  }

  calculateTotalFine(): void {
    this.totalFine = this.foodReports.reduce((fine, report) => {
      const optIns = report.opt_ins || {};
      let dailyFine = 0;

      for (const meal in optIns) {
        if (optIns[meal] === 'Pending') {
          dailyFine += 100;
        }
      }

      return fine + dailyFine;
    }, 0);
  }
}
