import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  // Mock data for testing the interface
  private fakeUsers: User[] = [
    {
      _id: '1',
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      email: 'ahmed.benali@example.com',
      password: 'hashedPassword123',
      role: 'admin',
      phone: '+212 6 12 34 56 78',
      address: '123 Rue Mohammed V, Casablanca',
      gender: 'male',
      birthDate: '1990-05-15',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product1', 'product2'],
      wishlist: ['product3', 'product4'],
      recoveryEmail: 'ahmed.recovery@example.com',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      firstName: 'Fatima',
      lastName: 'Zahra',
      email: 'fatima.zahra@example.com',
      password: 'hashedPassword456',
      role: 'user',
      phone: '+212 6 98 76 54 32',
      address: '456 Avenue Hassan II, Rabat',
      gender: 'female',
      birthDate: '1995-08-22',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product5'],
      wishlist: ['product6', 'product7'],
      recoveryEmail: 'fatima.recovery@example.com',
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-01-10')
    },
    {
      _id: '3',
      firstName: 'Mohammed',
      lastName: 'Alami',
      email: 'mohammed.alami@example.com',
      password: 'hashedPassword789',
      role: 'admin',
      phone: '+212 6 11 22 33 44',
      address: '789 Boulevard Mohammed VI, Marrakech',
      gender: 'male',
      birthDate: '1988-12-10',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: [],
      wishlist: ['product8'],
      recoveryEmail: 'mohammed.recovery@example.com',
      createdAt: new Date('2023-02-05'),
      updatedAt: new Date('2024-01-12')
    },
    {
      _id: '4',
      firstName: 'Amina',
      lastName: 'Tazi',
      email: 'amina.tazi@example.com',
      password: 'hashedPassword101',
      role: 'user',
      phone: '+212 6 55 66 77 88',
      address: '321 Rue Ibn Khaldoun, Fès',
      gender: 'female',
      birthDate: '1992-03-18',
      ban: true,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product9'],
      wishlist: [],
      recoveryEmail: 'amina.recovery@example.com',
      createdAt: new Date('2023-04-12'),
      updatedAt: new Date('2024-01-08')
    },
    {
      _id: '5',
      firstName: 'Karim',
      lastName: 'El Fassi',
      email: 'karim.elfassi@example.com',
      password: 'hashedPassword202',
      role: 'vendor',
      phone: '+212 6 99 88 77 66',
      address: '654 Avenue Mohammed V, Agadir',
      gender: 'male',
      birthDate: '1985-07-30',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product10', 'product11'],
      wishlist: ['product12'],
      recoveryEmail: 'karim.recovery@example.com',
      createdAt: new Date('2023-01-25'),
      updatedAt: new Date('2024-01-14')
    },
    {
      _id: '6',
      firstName: 'Sara',
      lastName: 'Bennani',
      email: 'sara.bennani@example.com',
      password: 'hashedPassword303',
      role: 'admin',
      phone: '+212 6 44 33 22 11',
      address: '987 Rue Al Qods, Tanger',
      gender: 'female',
      birthDate: '1993-11-05',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product13'],
      wishlist: ['product14', 'product15'],
      recoveryEmail: 'sara.recovery@example.com',
      createdAt: new Date('2023-05-18'),
      updatedAt: new Date('2024-01-16')
    },
    {
      _id: '7',
      firstName: 'Youssef',
      lastName: 'Idrissi',
      email: 'youssef.idrissi@example.com',
      password: 'hashedPassword404',
      role: 'user',
      phone: '+212 6 77 66 55 44',
      address: '147 Rue Ibn Sina, Meknès',
      gender: 'male',
      birthDate: '1991-09-14',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: [],
      wishlist: ['product16'],
      recoveryEmail: 'youssef.recovery@example.com',
      createdAt: new Date('2023-06-22'),
      updatedAt: new Date('2024-01-09')
    },
    {
      _id: '8',
      firstName: 'Layla',
      lastName: 'Mansouri',
      email: 'layla.mansouri@example.com',
      password: 'hashedPassword505',
      role: 'user',
      phone: '+212 6 33 44 55 66',
      address: '258 Avenue Ibn Batouta, Tétouan',
      gender: 'female',
      birthDate: '1994-04-25',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product17', 'product18'],
      wishlist: ['product19'],
      recoveryEmail: 'layla.recovery@example.com',
      createdAt: new Date('2023-07-30'),
      updatedAt: new Date('2024-01-11')
    },
    {
      _id: '9',
      firstName: 'Hassan',
      lastName: 'Berrada',
      email: 'hassan.berrada@example.com',
      password: 'hashedPassword606',
      role: 'admin',
      phone: '+212 6 88 99 00 11',
      address: '369 Boulevard Mohammed V, Oujda',
      gender: 'male',
      birthDate: '1987-01-08',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product20'],
      wishlist: [],
      recoveryEmail: 'hassan.recovery@example.com',
      createdAt: new Date('2023-08-15'),
      updatedAt: new Date('2024-01-13')
    },
    {
      _id: '10',
      firstName: 'Nadia',
      lastName: 'El Khoury',
      email: 'nadia.elkhoury@example.com',
      password: 'hashedPassword707',
      role: 'vendor',
      phone: '+212 6 22 33 44 55',
      address: '741 Rue Ibn Tachfine, Safi',
      gender: 'female',
      birthDate: '1989-06-12',
      ban: false,
      imageUrl: 'https://via.placeholder.com/150',
      cart: ['product21', 'product22'],
      wishlist: ['product23', 'product24'],
      recoveryEmail: 'nadia.recovery@example.com',
      createdAt: new Date('2023-09-05'),
      updatedAt: new Date('2024-01-17')
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // Return mock data with delay to simulate API
    return of(this.fakeUsers).pipe(delay(800));
  }

  getUserById(id: string): Observable<User> {
    const user = this.fakeUsers.find(u => u._id === id);
    if (user) {
      return of(user).pipe(delay(500));
    }
    throw new Error('User not found');
  }

  addUser(user: User): Observable<User> {
    const newUser = {
      ...user,
      _id: (this.fakeUsers.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.fakeUsers.push(newUser);
    return of(newUser).pipe(delay(600));
  }

  updateUser(id: string, user: User): Observable<User> {
    const index = this.fakeUsers.findIndex(u => u._id === id);
    if (index !== -1) {
      this.fakeUsers[index] = { 
        ...user, 
        _id: id,
        updatedAt: new Date()
      };
      return of(this.fakeUsers[index]).pipe(delay(600));
    }
    throw new Error('User not found');
  }

  deleteUser(id: string): Observable<void> {
    const index = this.fakeUsers.findIndex(u => u._id === id);
    if (index !== -1) {
      this.fakeUsers.splice(index, 1);
      return of(void 0).pipe(delay(400));
    }
    throw new Error('User not found');
  }

  blockUser(id: string): Observable<void> {
    const index = this.fakeUsers.findIndex(u => u._id === id);
    if (index !== -1) {
      this.fakeUsers[index].ban = !this.fakeUsers[index].ban;
      this.fakeUsers[index].updatedAt = new Date();
    }
    return of(void 0).pipe(delay(300));
  }
} 