import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-home">
      <div class="welcome-section">
        <h1>🎯 Tableau de Bord Administrateur</h1>
        <p>Bienvenue dans votre espace d'administration</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Utilisateurs</h3>
            <p class="stat-number">1,234</p>
            <p class="stat-change positive">+12% ce mois</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>Produits</h3>
            <p class="stat-number">567</p>
            <p class="stat-change positive">+8% ce mois</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Ventes</h3>
            <p class="stat-number">89,123 DT</p>
            <p class="stat-change positive">+15% ce mois</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Commandes</h3>
            <p class="stat-number">456</p>
            <p class="stat-change negative">-3% ce mois</p>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>Actions Rapides</h2>
        <div class="actions-grid">
          <button class="action-btn" routerLink="/dash-adm/users/add">
            <span>➕</span>
            <span>Ajouter Utilisateur</span>
          </button>
          <button class="action-btn" routerLink="/dash-adm/products/add">
            <span>📦</span>
            <span>Ajouter Produit</span>
          </button>
          <button class="action-btn">
            <span>📊</span>
            <span>Voir Rapports</span>
          </button>
          <button class="action-btn">
            <span>⚙️</span>
            <span>Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px;
    }
    
    .welcome-section h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .welcome-section p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      transition: transform 0.2s;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-icon {
      font-size: 2.5rem;
      margin-right: 1rem;
    }
    
    .stat-content h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1rem;
    }
    
    .stat-number {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }
    
    .stat-change {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .stat-change.positive {
      color: #27ae60;
    }
    
    .stat-change.negative {
      color: #e74c3c;
    }
    
    .quick-actions {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .quick-actions h2 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
    }
    
    .action-btn:hover {
      background: #e9ecef;
      border-color: #667eea;
      transform: translateY(-2px);
    }
    
    .action-btn span:first-child {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .action-btn span:last-child {
      font-weight: 500;
      color: #2c3e50;
    }
  `]
})
export class DashboardHomeComponent {} 