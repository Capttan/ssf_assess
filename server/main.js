// Load the libraries
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const morgan = require('morgan');

// const request = require('request');

//to use request as a promise for parallel/sequential processing of multiple requests
const request = require('request-promise-native');

const api_key = require('./api_key');

console.log(api_key);

// SQL
const SEARCH_BOOKS = 'select * from book2018 where title like ? or authors like ? limit ? offset ?';
const SEARCH_BOOKS_TEST = 'select * from book2018 limit ? offset ?'; // [`%${terms}%`]
// const GET_COMMENTS_BY_GID = 'select * from comment where gid = ? limit 50';

const SEARCH_BOOK_ID = 'select * from book2018 where book_id = ?'; // [`%${book_id}%`]

// Configure the application
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;

// Setup a connection pool for MySQL
const pool = mysql.createPool(require('./config'));

const app = express();

// Install standard middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

//Define custom middleware

const hkMiddleware = (req, res, next) => {
    // console.log(req);
    const a = req.body;
    req.kappa = req.body;
    req.body = 'hello'; // this will overwrite the original req.body (which means to say I can preprocess the body before actually processing it)
    next();
}

// Define the routes


// GET /api/search
app.get('/api/search',
    (req, resp) => {
        const terms = req.query.terms;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        console.log('terms:', terms);
        console.log('limit:', limit);
        console.log('offset:', offset);

        pool.getConnection(
            (err, conn) => {
                if (err)
                    // return resp.status(500).json({ message: JSON.stringify(err) });
                    // HTTP status code
                    return resp.status(500).json({
                        status: 500,
                        message: 'search poolConn Err',
                        timestamp: (new Date()).getTime()
                    });
                // Just testing for now, need to change later
                conn.query(SEARCH_BOOKS, [`%${terms}%`, `%${terms}%`, limit, offset],
                // conn.query(SEARCH_BOOKS_TEST, [limit, offset],
                    (err, result) => {
                        conn.release();
                        if (err)
                            // return resp.status(500).json({ message: JSON.stringify(err) });
                            return resp.status(500).json({
                                status: 500,
                                message: 'search poolQuery Err',
                                timestamp: (new Date()).getTime()
                            });

                        // massage the returned data here    
                        // resp.status(200).json(result); // no massaging
                        console.log(result.length);

                        let returnObj = result.map((v) => { //each element of result is v

                            //process authors 

                            let authorsArr = v.authors.split('|')
                            // console.log(authorsArr); 

                            let objElement = {
                                book_id: v.book_id,
                                title: v.title,
                                authors: authorsArr, // need to process authors (delimited by |)
                                rating: v.rating
                            }

                            return objElement;

                        });

                        // returnObj['terms'] = terms;
                        // // Time stamp of this response (new Date()).getTime()
                        // returnObj['timestamp'] = (new Date()).getTime();
                        // // Total number of results from this search
                        // returnObj['total'] = result.length;
                        // // Number of results from total limit < total
                        // returnObj['limit'] = limit;
                        // // Number of records skipped from the top
                        // returnObj['offset'] = offset;

                        let returnObjFull = {
                            // "data": BookSummary = returnObj,
                            "data": returnObj,
                            "terms": terms,
                            // Time stamp of this response (new Date()).getTime()
                            "timestamp": (new Date()).getTime(),
                            // Total number of results from this search
                            "total": result.length,
                            // Number of results from total limit < total
                            "limit": limit,
                            // Number of records skipped from the top
                            "offset": offset
                        }


                        console.log(returnObjFull);

                        // resp.status(200).json(JSON.stringify(returnObj)); // no massaging
                        resp.status(200).json(returnObjFull); // no massaging

                    }
                )
            }
        );
    }
);


// GET /api/comments/:gid
app.get('/api/book/:book_id',
    (req, resp) => {
        const book_id = req.params.book_id;

        console.log('book_id:', book_id);

        pool.getConnection(
            (err, conn) => {
                if (err)
                    // return resp.status(500).json({ message: JSON.stringify(err) });
                    // HTTP status code
                    return resp.status(500).json({
                        status: 500,
                        message: 'search poolConn Err',
                        timestamp: (new Date()).getTime()
                    });
                // Just testing for now, need to change later
                // conn.query(SEARCH_BOOKS, [`%${terms}%`, `%${terms}%`, limit, offset],
                conn.query(SEARCH_BOOK_ID, [book_id],
                    (err, result) => {
                        conn.release();
                        if (err)
                            // return resp.status(500).json({ message: JSON.stringify(err) });
                            return resp.status(500).json({
                                status: 500,
                                message: 'search poolQuery Err',
                                timestamp: (new Date()).getTime()
                            });

                        // massage the returned data here    
                        // resp.status(200).json(result); // no massaging
                        console.log(result);
                        console.log(result.length);

                        if (result.length == 0) {
                            return resp.status(404).json({
                                status: 404,
                                message: 'book_id not valid',
                                timestamp: (new Date()).getTime()
                            });
                        } //null result becomes false

                        // let returnObj = result.map((v) => { //each element of result is v

                        //     return v;
                        // });

                        let returnObj = result.map((v) => { //each element of result is v

                            //process authors 

                            let authorsArr = v.authors.split('|')
                            let genresArr = v.genres.split('|')
                            // console.log(authorsArr); 

                            let objElement = {
                                book_id: v.book_id,
                                title: v.title,
                                authors: authorsArr, // need to process authors (delimited by |)  
                                description: v.description,
                                edition: v.edition,
                                format: v.format,
                                pages: v.pages,
                                rating: v.rating,
                                rating_count: v.rating_count,
                                review_count: v.review_count,
                                genres: genresArr, // need to process authors (delimited by |)
                                image_url: v.image_url
                            }

                            return objElement;

                        });

                        // returnObj['terms'] = terms;
                        // // Time stamp of this response (new Date()).getTime()
                        // returnObj['timestamp'] = (new Date()).getTime();
                        // // Total number of results from this search
                        // returnObj['total'] = result.length;
                        // // Number of results from total limit < total
                        // returnObj['limit'] = limit;
                        // // Number of records skipped from the top
                        // returnObj['offset'] = offset;

                        let returnObjFull = {
                            // "data": BookSummary = returnObj,
                            "data": returnObj,
                            "timestamp": (new Date()).getTime(),
                        }


                        // resp.status(200).json(JSON.stringify(returnObj)); // no massaging
                        resp.status(200).json(returnObjFull);

                    }
                )
            }
        );
    }
);


// GET /api/comments/:gid
app.get('/api/book/:book_id/review',
    // app.get('/api/review',
    (req, resp) => {
        const book_id = req.params.book_id;
        const bookTitle = req.query.bookTitle;

        console.log('book_id:', book_id);
        console.log('bookTitle:', bookTitle);


        const options = {
            url: `https://api.nytimes.com/svc/books/v3/reviews.json`,
            qs: {
                'title': bookTitle,
                'api-key': api_key.key // -> uri + '?access_token=xxxxx%20xxxxx'
            },
        };

        // const options = {
        //     // url: `https://api.nytimes.com/svc/books/v3/reviews.json?author=Stephen+King&api-key=CYrJiTYBHBEoKWINEGrpkntgD6sATqxR`
        //     url: `https://api.nytimes.com/svc/books/v3/reviews.json?title=Becoming&api-key=CYrJiTYBHBEoKWINEGrpkntgD6sATqxR`
        // };


        // request.get(`${HN}/item/${newsId}.json`).then(r => JSON.parse(r));
        // request.get(`https://api.nytimes.com/svc/books/v3/reviews.json?title=Becoming&api-key=CYrJiTYBHBEoKWINEGrpkntgD6sATqxR`).then(r => JSON.parse(r))
        request.get(options).then(r => JSON.parse(r))
            .then((result) => {
                console.log(result)
                console.log(typeof (result));

                //define the return object first

                let reviewResponse = {
                    // One or more reviews
                    data: [],
                    // Time stamp of this response (new Date()).getTime()
                    timestamp: (new Date()).getTime()
                }


                if (result.num_results > 0) {

                    console.log(result.results);
                    let returnObj = result.results.map((v) => {

                        let objElement = {
                        book_id: v.isbn13[0],
                        title: v.book_title,
                        authors: v.book_author,
                        byline: v.byline,
                        summary: v.summary,
                        url: v.uri
                        }

                        reviewResponse.data.push(objElement);

                        return objElement;
                    });

                    console.log('returnObj', returnObj);

                }


                console.log('reviewResponse', reviewResponse);

                resp.status(200).json(reviewResponse);
            })
            .catch(err => {
                console.log(err)
                console.log(typeof (err));
                resp.status(500).json({
                    status: 500,
                    message: 'request Err',
                    timestamp: (new Date()).getTime()
                });

                
            });

    }
);



app.use((req, resp) => {
    // Response 404 in JSON
    resp.status(404).json({ message: `Not found: ${req.originalUrl}` });
});

// Start the server
app.listen(PORT, () => {
    console.info(`Application started at port ${PORT} on ${new Date()}`);
});