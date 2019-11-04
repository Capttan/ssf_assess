import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse, ReviewResponse } from './models';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4

    // export interface SearchCriteria {
    //   // Search terms
    //   terms: string;
    //   // How many results to return
    //   limit?: number;
    //   // Number of results to skip from the top of the query
    //   offset?: number;
    // }

    let terms = searchCriteria.terms || 'Alone';
    // let terms = 'Alone';
    let limit = searchCriteria.limit || 10;
    let offset = searchCriteria.offset || 0;


    //Task 3
    // const params = new HttpParams().set('terms', terms).set('limit', `${limit}`).set('offset', `${offset}`);
    const params = new HttpParams().set('terms', terms).set('limit', `${limit}`).set('offset', `${offset}`);
    const headers = new HttpHeaders().set('Accept', 'application/json');
    console.log(params.toString());

    const httpOptions = {
      headers: headers,
      params: params
    };

    // const api_hack = 'https://cors-anywhere.herokuapp.com/';
    const api_url = 'http://localhost:3000/api/search';

    // this.http.get<BooksResponse>(api_url, httpOptions).toPromise()
    //   .then((result) => { console.log(result); })
    //   .catch((err) => { console.log(err); });

    return this.http.get<BooksResponse>(api_url, httpOptions).toPromise();

    //TODO: do i have to handle string length = 0

    // return (null);
  }

  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5

    const headers = new HttpHeaders().set('Accept', 'application/json');

    const httpOptions = {
      headers: headers
    };

    const api_url = 'http://localhost:3000/api/book/' + bookId;

    // this.http.get<BookResponse>(api_url, httpOptions).toPromise()
    //   .then((result) => { console.log('getBook:', result); })
    //   .catch((err) => { console.log(err); });

    return this.http.get<BookResponse>(api_url, httpOptions).toPromise();
    // return (null);
  }

  getReview(bookId: string, bookTitle: string): Promise<ReviewResponse> {
    //TODO - for Task 5

    console.log('getReview: ', bookId);
    console.log('getReview: ', bookTitle);
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const params = new HttpParams().set('bookTitle', bookTitle);

    const httpOptions = {
      headers: headers,
      params: params
    };

    const api_url = 'http://localhost:3000/api/book/' + bookId + '/review';

    // this.http.get<ReviewResponse>(api_url, httpOptions).toPromise()
    //   .then((result) => { console.log('getBook:', result); })
    //   .catch((err) => { console.log(err); });

    return this.http.get<ReviewResponse>(api_url, httpOptions).toPromise();
    // return (null);
  }
}
