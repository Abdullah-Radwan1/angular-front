import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../ENV';

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private apiUrl = `${URL}/addresses`;

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  getUserAddresses(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
  }


  addAddress(address: Address): Observable<any> {
    return this.http.post(this.apiUrl, address, { withCredentials: true });
  }

  updateAddress(id: string, address: Partial<Address>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, address, { withCredentials: true });
  }

  setDefaultAddress(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/set-default`, {}, { withCredentials: true });
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
