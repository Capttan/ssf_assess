import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BookResponse, ReviewResponse } from '../models';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  book: BookResponse = null;
  review: ReviewResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
    , private bookSvc: BookService) { }

  ngOnInit() {

    let book_id = this.activatedRoute.snapshot.params.book_id;
    this.bookSvc.getBook(book_id)
      .then(result => {
        console.log('book-detail-comp: ', result);
        console.log('data.title: ', result.data[0].title);  
        this.book = result;
        // this.book.timestamp
        this.bookSvc.getReview(book_id, result.data[0].title).then(result => {
          console.log('review: ', result);
          this.review = result;

        }).catch(error => {
          const errorResponse = error as ErrorResponse;
          alert(`Status review: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
        });
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      });

  }


  backToBooks() {
    this.router.navigate(['/books']);
  }
}
