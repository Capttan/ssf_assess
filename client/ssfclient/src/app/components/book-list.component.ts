import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BooksResponse } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  limit = 10; //set by user
  offset = 0;
  terms = ''; //set by user
  grandTotal = 0;

  books: BooksResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
    , private bookSvc: BookService) { }

  ngOnInit() {
    const state = window.history.state;
    if (!state['terms'])
      return this.router.navigate(['/']);


    this.terms = state.terms;
    this.limit = parseInt(state.limit) || 10;

    console.log('state.terms: ', state.terms);
    console.log('state.limit: ', state.limit);
    console.log('state.limit(type): ', typeof (state.limit));

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: 50 //this.limit
    }

    // TODO: should not display all at the start
    // this.bookSvc.getBooks(searchCriterial)
    //   .then(result => {
    //     console.log('getBooks: ', result);
    //     this.books = result;
    //     this.grandTotal = this.books.total;
    //   }).catch(error => {
    //     const errorResponse = error as ErrorResponse;
    //     alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
    //   })

    // Very hacky way of doing this but insufficient time left

    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        console.log('getBooks: ', result);
        this.books = result;
        this.grandTotal = this.books.total;
        let searchCriterial: SearchCriteria = {
          terms: this.terms,
          limit: this.limit
        }
        this.bookSvc.getBooks(searchCriterial)
          .then(result => {
            console.log('getBooks: ', result);
            this.books = result;
          }).catch(error => {
            const errorResponse = error as ErrorResponse;
            alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
          });
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })

  }

  next() {
    //TODO - for Task 4
    // access BookResponse (i.e this.books)

    // export interface BooksResponse {
    //   data: BookSummary[];
    //   // The search term that resulted in this qurey
    //   terms: string;
    //   // Time stamp of this response (new Date()).getTime()
    //   timestamp: number;
    //   // Total number of results from this search
    //   total: number;
    //   // Number of results from total limit < total
    //   limit: number;
    //   // Number of records skipped from the top
    //   offset: number;
    // }

    if (this.offset + this.limit < this.grandTotal) {
      this.offset += this.limit;
    }

    console.log(this.offset);

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
      offset: this.offset
    }
    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        console.log('getBooks: ', result);
        this.books = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })

  }

  previous() {
    //TODO - for Task 4

    if (this.offset - this.limit >= 0) {
      this.offset -= this.limit;
    } else {
      this.offset = 0;
    }

    console.log(this.offset);

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
      offset: this.offset
    }
    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        console.log('getBooks: ', result);
        this.books = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })

  }

  bookDetails(book_id: string) {
    //TODO
    console.info('Book id: ', book_id);

    this.bookSvc.getBook(book_id)
      .then(result => {
        console.log('bookDetails: ', result);
        this.router.navigate(['/detail', book_id]);
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      });
  }

  back() {
    this.router.navigate(['/']);
  }

}
