# Document Versioning

## Design Decisions

1. Versioned documents fit nicely into a document database or similar solution.
   * The factors involve in choosing which storage solution to use depend on the wider requirements of the system, so I have left that out. Choices could include files on disk, databases (document or relational) or a range of cloud solutions.
2. As the most important factor for storing these document is disk space efficiency, the minimum data that can be stored is one instance of the document's text together with all the changes that have been made across the versions.
3. The saved instance of the document's text could either be the initial or the latest text. From the information I have, I think that it's reasonable to assume that this choice does not impact storage size and that the latest text will be accessed more frequently. So, I have chosen to save the latest text.
   * It follows that other versions of the text will need to be generated as they are needed. This may be computationally expensive, but this is acceptable when prioritising disk space.
4. `Operations` store the changes made to the document. I have included deleting and adding text, which in turn assumes that this is not rich text.
   * `Operations` must be applied in the same order when recreating versions of the document. To save space, I have not included an operation order field as it could be inferred from the order that they are saved in. This relies on that order being preserved and the system could be more resilient if an order were included.
   * I figure that, when compared to the approach used in question 5 of the challenge, combining different operations into a single object at a particular location would save a tiny amount of space, but that this is enough to justify the structure. However, one of `insert` / `delete` fields would be required.
5. I have also assumed that the current version of the document could have modifications that need to be saved before the time when a new version is created. This leads to the `changes` property on the main document. 
   * I.e. saving the progress towards the creation of the next version of the document.
   * To save space, this is an optional field so that an empty array is not stored when no changes have been made.
6. `Document.perviousVersions` is an optional to save space when there are no previous versions to be stored.
7. I have chosen to include some standard fields that relate to a document (such as a title and dates) and exclude IDs as this is dependent on the storage system in use.


## Schema

``` javascript
    Operation {
        location: number;
        insert?: string;  // Either insert or delete is required.
        delete?: number;
    };

    VersionDetails {
        createdDate: Date;
        updatedDate: Date;
        versionNumber: number;
        changes: [Operation];
    };

    Document {
        title: string;
        text: string;
        createdDate: Date;
        updatedDate: Date;
        versionNumber: number;
        changes?: [Operation];
        previousVersions?: [VersionDetails];
    };
```

## Other Considerations

1. I also think that there are many other factors that should be considered alongside this structure. For example, I have not included any details about the users who can edit the document nor a version creator. This is dependent on the purpose of the system and so I have left these considerations as outside of the scope of this question.
2. To save extra disk space, you could configure the serialisation of the documents so that the keys are transformed into a more compressed alias. 
3. To find the optimal solution, some consideration would be needed about combining operations together so that they take up less space. However, this again depends on the purpose of the system. 