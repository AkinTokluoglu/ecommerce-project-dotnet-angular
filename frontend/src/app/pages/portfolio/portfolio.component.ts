import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portfolio-page">
      <div class="page-header">
        <h1>Portfolyo</h1>
        <p>Tamamladığımız projelerden örnekler</p>
      </div>
      
      <div class="portfolio-container">
        @for (item of portfolioItems; track item.id) {
          <div class="portfolio-item" (click)="openItem(item)">
            <img [src]="item.image" [alt]="item.title">
            <div class="overlay">
              <h3>{{ item.title }}</h3>
              <p>{{ item.category }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .portfolio-page {
      min-height: 80vh;
      background: #FAFAFA;
    }
    
    .page-header {
      background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%);
      padding: 3rem 2rem;
      text-align: center;
      color: white;
    }
    
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .portfolio-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    
    .portfolio-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      height: 300px;
    }
    
    .portfolio-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    
    .portfolio-item:hover img {
      transform: scale(1.1);
    }
    
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: white;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s;
    }
    
    .portfolio-item:hover .overlay {
      transform: translateY(0);
      opacity: 1;
    }
    
    .overlay h3 {
      margin-bottom: 0.25rem;
    }
    
    .overlay p {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  `]
})
export class PortfolioComponent implements OnInit {
  portfolioItems: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getPortfolioItems().subscribe({
      next: (data) => {
        this.portfolioItems = data.map(item => ({
          ...item,
          image: item.images[0] // İlk görseli kapak yap
        }));
      }
    });
  }

  openItem(item: any): void {
    console.log('Opening item:', item);
    // İleride detay modalı eklenebilir
  }
}
