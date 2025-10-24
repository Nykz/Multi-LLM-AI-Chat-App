import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);

  sendMessage(message: string): Observable<string> {
    return this.http.post<{ reply: string }>('http://localhost:3000/api/chat', { message }).pipe(
      map((response) => response.reply),
      catchError((error: HttpErrorResponse) => {
        console.error('Error sending message:', error);

        let errorMsg = 'An unknown error occurred.';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Client error: ${error.error.message}`;
        } else if (error.error?.error) {
          errorMsg = `Server error: ${error.error.error}`;
        }

        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
