import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRouteModule } from './approute.module';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search.component';
import { BookListComponent } from './components/book-list.component';
import { BookDetailComponent } from './components/book-detail.component';
import { BookService } from './book.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    BookListComponent,
    BookDetailComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule, FormsModule,
    AppRouteModule
  ],
  providers: [ BookService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
