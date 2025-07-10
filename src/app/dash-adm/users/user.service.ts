import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  // Données fictives pour tester l'interface
  private fakeUsers: User[] = [
    {
      id: '1',
      name: 'Ahmed Ben Ali',
      email: 'ahmed.benali@example.com',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Fatima Zahra',
      email: 'fatima.zahra@example.com',
      role: 'user'
    },
    {
      id: '3',
      name: 'Mohammed Alami',
      email: 'mohammed.alami@example.com',
      role: 'admin'
    },
    {
      id: '4',
      name: 'Amina Tazi',
      email: 'amina.tazi@example.com',
      role: 'user'
    },
    {
      id: '5',
      name: 'Karim El Fassi',
      email: 'karim.elfassi@example.com',
      role: 'user'
    },
    {
      id: '6',
      name: 'Sara Bennani',
      email: 'sara.bennani@example.com',
      role: 'admin'
    },
    {
      id: '7',
      name: 'Youssef Idrissi',
      email: 'youssef.idrissi@example.com',
      role: 'user'
    },
    {
      id: '8',
      name: 'Layla Mansouri',
      email: 'layla.mansouri@example.com',
      role: 'user'
    },
    {
      id: '9',
      name: 'Hassan Berrada',
      email: 'hassan.berrada@example.com',
      role: 'admin'
    },
    {
      id: '10',
      name: 'Nadia El Khoury',
      email: 'nadia.elkhoury@example.com',
      role: 'user'
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // Retourner les données fictives avec un délai pour simuler une API
    return of(this.fakeUsers).pipe(delay(800));
  }

  getUserById(id: string): Observable<User> {
    const user = this.fakeUsers.find(u => u.id === id);
    if (user) {
      return of(user).pipe(delay(500));
    }
    throw new Error('Utilisateur non trouvé');
  }

  addUser(user: User): Observable<User> {
    const newUser = {
      ...user,
      id: (this.fakeUsers.length + 1).toString()
    };
    this.fakeUsers.push(newUser);
    return of(newUser).pipe(delay(600));
  }

  updateUser(id: string, user: User): Observable<User> {
    const index = this.fakeUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.fakeUsers[index] = { ...user, id };
      return of(this.fakeUsers[index]).pipe(delay(600));
    }
    throw new Error('Utilisateur non trouvé');
  }

  deleteUser(id: string): Observable<void> {
    const index = this.fakeUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.fakeUsers.splice(index, 1);
      return of(void 0).pipe(delay(400));
    }
    throw new Error('Utilisateur non trouvé');
  }

  blockUser(id: string): Observable<void> {
    // Simuler le blocage d'un utilisateur
    return of(void 0).pipe(delay(300));
  }
} 