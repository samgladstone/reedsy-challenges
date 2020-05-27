# Node.js Fullstack Engineer Challenge

You can submit all the answers to this assignment in a single repository (or as a zipped folder), containing markdown and code.

**For questions 3-5 use the latest Node LTS**.

## 1. About you

> Tell us about one of your commercial projects with Node.js and/or AngularJS.

See [Brink Submission Manager](1-submission-manager.md).

## 2. Document versioning

> Detail how you would store several versioned, text-based documents, and present a schema for your solution.
>
> It should be able to show:
>   - the document in its current state
>   - the document at any point in its history
>   - the changes made between two versions
>
>Strive for disk space efficiency.

See [Brink Submission Manager](2-document-versioning.md).

## 3. Node.js REST API

> Implement a REST API using Express.js that handles Export and Import requests. The solution should ideally be written in Typescript, or else using plain JavaScript's `class` structure.
>
> The API should expose endpoints to:
> - `POST` a request for a **new Export job**. Valid requests should be saved in memory. Invalid requests should return an error. The request must have the following schema:
>
>  ```javascript
>  {
>    bookId: string,
>    type: "epub" | "pdf"
>  }
>  ```
>
>- `GET` a list of **Export requests**, grouped by their current `state` (see below).
> - `POST` a request for a new **Import job**. Valid requests should be saved in memory. Invalid requests should return an error. The request must have the following schema:
>
>  ```javascript
>  {
>    bookId: string,
>    type: "word" | "pdf" | "wattpad" | "evernote",
>    url: string
>  }
>  ```
>
> - `GET` a list of **Import requests**, grouped by their current `state` (see below).
>
> Both export and import requests should be created with a `pending` state, and with a `created_at` timestamp. An import or export should take the amount of time outlined below. After the specified time, the state should be updated from `pending` to `finished` and update an `updated_at` timestamp.
>
> | Job type     | Processing time (s) |
> | ------------ | ------------------- |
> | ePub export  | 10                  |
> | PDF export   | 25                  |
> | import (any) | 60                  |
>
> **Add test coverage as you see fit.**
>
> The project should be responsible for managing all the required dependencies and should run just by using:
> - `yarn install` + `yarn start`
> or
> - `npm install` + `npm start`.

See [Book Requests Porter](3-book-requests-porter).

## 4. AngularJS

> Using **Vue.js or AngularJS (1.x)**, create a basic SPA that implements the following UI:
> 
> ![AngularJS 1](./images/node_4-01.png "AngularJS 1")
> 
> ![AngularJS 2](./images/node_4-02.png "AngularJS 2")
> 
> - Each page should display 5 books;
> - A few pages should be available in order for pagination to work;
> - Book entries should be clickable and expand/collapse to show/hide more > information about the selected book;
> - Book store links should only be displayed when the respective URL is available; make different entries as represented on the images above so different store availability scenarios are represented;
> - Improve the UI as you think works best.
> 
> **Add test coverage as you see fit.**
> 
> The project should be responsible for managing all the required dependencies and should run just by using:
> -  `yarn install` + `yarn start`
> or
> - `npm install` + `npm start`.

See [Books SPA](4-books-spa).

NB: You can duplicate the books in `/src/store/books.json` to see the paging working with many pages.

## 5. Bonus Question

> When multiple users are collaborating on a document, collisions in their edits inevitably occur. Implement a module that can handle basic text update operations, and combine two colliding edits into a single operation.
>
> An operation is described as an array of any combination of three types of edits:
>
> - `{ move: number }` to advance the caret
> - `{ insert: string }` to insert the string at caret
> - `{ delete: number }` to delete a number of chars from the caret onwards
> 
> Implement the following methods:
> - `Operation.prototype.combine(operation)` Updates the operation by combining it with another colliding operation
> - `Operation.combine(op1, op2)` Static method that returns a new operation by combining the arguments without mutating them
> - `Operation.prototype.apply(string)` Applies the operation to the provided argument
> 
> For example:
> 
> ```javascript
> const s = "abcdefg";
> const op1 = new Operation([{ move: 1 }, { insert: "FOO" }]);
> const op2 = new Operation([{ move: 3 }, { insert: "BAR" }]);
> 
> op1.apply(s); // => "aFOObcdefg"
> op2.apply(s); // => "abcBARdefg"
> 
> const combined1 = Operation.combine(op1, op2); // => [{ move: 1 }, { insert: 'FOO' }, { move: 2}, { insert: 'BAR' } ]
> combined1.apply(s); // => "aFOObcBARdefg"
> 
> const combined2 = Operation.combine(op2, op1);
> // NB: This expectation is true for this specific case, but not in the general case.
> // Can you think of an example where this assertion might not be true?
> expect(combined2.apply(s)).to.equal(combined1.apply(s));
> ```
> 
> **Add test coverage to demonstrate the module functionality.** Again, TypeScript is preferred in this solution.
> 
> The project should be responsible for managing all the required dependencies and should run just by using:
> - `yarn install` + `yarn test`
> or
> - `npm install` + `npm test`.

See [Document Collaboration](5-document-collaboration).

* I have given an object oriented-solution but, while working on it, I have wondered if a functional solution would be more performant.

* I have assumed that inserting text also moves the caret. For example, inserting `'abc'` at position 6 results in the caret being at position 9 (after the inserted text). It could have been intended that the position should remain 6 and so the caret is still at the start of the inserted text. However, I think that the option I have chosen results in a cleaner implementation. This is because it prioritises modification to the original text rather than to the modification that was just made. This seems sensible to me.

* I have also assumed that it is OK to combine and reorder operations where the application results in the same text. I do recognise that this loses track of the history of the edits (if each individual edit needed to be displayed to a user). For example:

 ```js
 [{ move: 2 }, { move: 4 }] === [{ move: 6 }];

 [{ delete: 2 }, { delete: 3 }] === [{ delete: 5 }];

 [{ insert: 'abc' }, { delete: 3 }] === [{ delete: 3 }, { insert: 'abc' }];

 [{ insert: 'abc' }, { insert: 'def' }] === [{ insert: 'abcdef' }];

 [{ insert: 'abc' }, { delete: 3 }, { insert: 'def' }] === [{ delete: 3 }, { insert: 'abcdef' }];
 ```

### Example for `Operation.combine(op1, op2).apply(string) !== Operation.combine(op2, op1).apply(string)`

It strikes me that an ideal solution to this problem would always return the same result, regardless of which operation is applied is the *first* operation. If I think of handling conflicts in GIT and what an automated merge strategy could look like, I don't think that a tool would be useful if the following were true: merging branch B into branch A results in branch A being different to what branch B would be if we merge branch A into it.

So, I think the ideal solution would follow GITs example and present these conflicts to a user, who can manually resolve them.

However, if we are strictly combining the results and cannot ask for human intervention there are several tricky situations:
1. If one operation tries to insert into a location that the other has deleted. It strikes me that the most sensible way to resolve this issue is to prioritise the delete. As the text either side of the insert has been deleted in one operation, the other operations insert can be discarded as it was only relevant to the deleted text.
2. When two pieces of text are inserted in the same location. This is difficult to prioritise, so I have tried to merge the text of the inserts where possible, and otherwise prioritised the insert from the initial operation.

### Reflections

This was challenging!! I have written something that works with what the tests I designed for it, so I think it is reasonably robust. That said, I think I may have over complicated it slightly. I would have liked to spend some time:
1. Breaking up the long function into smaller testable units.
2. Writing a load of integration tests to try and come up with strange scenarios (if I were to continue implementing this as an actual feature).

I was also hoping to include negative move values, but there is currently no functionality for figuring out how to move over what the other operation inserted in the middle of a negative move (see the failing test). I think to do this, it would be better to reorganise the original operation so that all moves are positive.