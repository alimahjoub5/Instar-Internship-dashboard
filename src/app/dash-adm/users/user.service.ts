import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { ApiService } from '../../shared/services/api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.apiService.get('/users');
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get(`/users/byId?id=${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.apiService.post('/register', user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.apiService.put('/UpdateProfil', { ...user, id });
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete(`/users/delete?id=${id}`);
  }

  banUser(id: string, ban: boolean): Observable<any> {
    return this.apiService.put('/users/ban', { id, ban });
  }
} 