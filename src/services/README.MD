# [MongoDB](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/index.html) & [Robo3t](https://www.robomongo.org/)
Join collections with MongoDB aggregate function  
  
> user defined variables  
> \$project  
> pipelines  
> \$lookup  
> \$filter  
> \$isArray  
> \$eq  
  
  
## Animals Collection
``` 
db.animals.insert([
{
    "_id" : ObjectId("5d28b580d8d6bb70ee3b17b2"),
    "dates" : {
        "created" : ISODate("2019-07-12T16:29:52.732Z"),
        "modified" : ISODate("2019-07-12T16:29:52.732Z")
    },
    "contributors" : [ 
        "flname@outlook.com"
    ],
    "name" : "Florida bonneted bat (Eumops floridanus)",
    "description" : "bat man",
    "imageSrc" : "https://live.staticflickr.com/3949/15541718041_300757f800_b.jpg",
    "endangered" : true,
    "__v" : 0
},
{
    "_id" : ObjectId("5d28d29266ada002d41006f1"),
    "dates" : {
        "created" : ISODate("2019-07-12T18:33:54.218Z"),
        "modified" : ISODate("2019-07-12T18:33:54.218Z")
    },
    "contributors" : [ 
        "user.name@outlook.com", 
        "temp@gmail.com", 
        ""
    ],
    "name" : "Elephant",
    "description" : "African region",
    "imageSrc" : "https://c402277.ssl.cf1.rackcdn.com/photos/11552/images/hero_small/rsz_namibia_will_burrard_lucas_wwf_us_1.jpg?1462219623",
    "endangered" : false,
    "__v" : 0
}])
```
  
## Contributors Collection
``` 
db.contributors.insert([
{
    "_id" : ObjectId("5d2c98df871e577d7304cf8f"),
    "firstname" : "FirstName",
    "lastname" : "LastName",
    "useremail" : "firs.last@outlook.com",
    "username" : "flnames",
    "audit" : [ 
        {
            "modified" : ISODate("2019-07-15T15:16:47.161Z"),
            "contributor_id" : ObjectId("5d2c98df871e577d7304cf8f")
        }
    ],
    "__v" : 0
},
{
    "_id" : ObjectId("5d2cd9ed72cd95995f4c9e43"),
    "firstname" : "User",
    "lastname" : "Name",
    "useremail" : "user.name@outlook.com",
    "username" : "username",
    "audit" : [ 
        {
            "modified" : ISODate("2019-07-15T00:00:00.000Z"),
            "contributor_id" : ObjectId("5d2cd9ed72cd95995f4c9e43")
        }
    ],
    "__v" : 0
}   
])
```
  
  ## Aggregate of Animals and Contributors 
``` 
db.animals.aggregate([
    {
        $lookup: {
            from: "contributors",
            let: {animals_contributors: '$contributors'},
            pipeline: [{
                $project: {
                    _id: false, useremail: 1, username: 1, 
                    is_contributor: {$in: ['$useremail', '$$animals_contributors']}
                }            
            }],
            as: "contributors"
        }        
    },
    {
    $project: {
        name: 1, description: 1, contributors: 1, endangered: 1, imageSrc: 1,
        contributors_is_array: {$isArray: '$contributors'},
        contributors: '$contributors',
        contributors_filtered: {
            $filter: {
                input: '$contributors',
                as: 'sponsor',
                cond: {$eq: ['$sponsor.is_contributor', false]}
            }
        }
    }}
])
```
  
## Aggregate results ($eq not working)  
Expected a single array item with each contributors_filtered $project field  
```
/* 1 */
{
    "_id" : ObjectId("5d28b580d8d6bb70ee3b17b2"),
    "name" : "Florida bonneted bat (Eumops floridanus)",
    "description" : "bat man",
    "imageSrc" : "https://live.staticflickr.com/3949/15541718041_300757f800_b.jpg",
    "endangered" : true,
    "contributors" : [ 
        {
            "useremail" : "flname@outlook.com",
            "username" : "flname",
            "is_contributor" : true
        }, 
        {
            "useremail" : "user.name@outlook.com",
            "username" : "username",
            "is_contributor" : false
        }
    ],
    "contributors_is_array" : true,
    "contributors_filtered" : []
}

/* 2 */
{
    "_id" : ObjectId("5d28d29266ada002d41006f1"),
    "name" : "Elephant",
    "description" : "African region",
    "imageSrc" : "https://c402277.ssl.cf1.rackcdn.com/photos/11552/images/hero_small/rsz_namibia_will_burrard_lucas_wwf_us_1.jpg?1462219623",
    "endangered" : false,
    "contributors" : [ 
        {
            "useremail" : "flname@outlook.com",
            "username" : "flname",
            "is_contributor" : false
        }, 
        {
            "useremail" : "user.name@outlook.com",
            "username" : "username",
            "is_contributor" : true
        }
    ],
    "contributors_is_array" : true,
    "contributors_filtered" : []
}
```