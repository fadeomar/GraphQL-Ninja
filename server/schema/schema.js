const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../modles/book');
const Author = require('../modles/author');

const {
    GraphQLObjectType,
     GraphQLString ,
     GraphQLSchema,
     GraphQLID,
     GraphQLInt,
     GraphQLList,
     GraphQLNonNull
    } = graphql;

// const books = [
//     {name:'asdasd', genre:'ffddd', id:'1', authorId:'1'},
//     {name:'dadada', genre:'dd', id:'2', authorId:'2'},
//     {name:'jjjj', genre:'fxxfddd', id:'3', authorId:'3'},
//     {name:'nnnn', genre:'vvvvvvv', id:'4', authorId:'3'},
//     {name:'ccccc', genre:'nnnnnn', id:'5', authorId:'1'},
//     {name:'wwqasd', genre:'rrrrrrr', id:'6', authorId:'2'},
// ];

// const author = [
//     {name:'fadi', age : 20, id:'1'},
//     {name:'asd1', age : 23, id:'2'},
//     {name:'asd2', age : 24, id:'3'},
// ]

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:() => ({ 
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        genre : {type : GraphQLString},
        author: {
            type : AuthorType,
            resolve(parent, args){
                console.log(parent, args)
                // return _.find(author, {id: parent.authorId})
                return Author.findById(parent.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:() => ({ 
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        age : {type : GraphQLInt},
        books : {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, {authorId: parent.id})
                return Book.find({ authorId: parent.id})
            }
        }
    })
});

const RoutQuery = new GraphQLObjectType({
    name:'RouteQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                // code to get data from DB
            //    return _.find(books, {id:args.id})
            return Book.findById(args.id)
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                // code to get data from DB
            //    return _.find(author, {id:args.id})
                return Author.findById(args.id)
            }
        },
        books : {
            type:new GraphQLList(BookType),
            resolve(parent, args){
                // return books
                return Book.find({})
            }
        },
        authors : {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors
                return Author.find({})
            }
        }
    }
})

// book(id:'2'){
//     name, 
//     genre
// }

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type : AuthorType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook : {
            type: BookType,
            args:{
                name : {type: new GraphQLNonNull(GraphQLString)},
                genre: {type : new GraphQLNonNull(GraphQLString)},
                authorId: {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId : args.authorId
                })

                return book.save()
            }
        }
    },
})

module.exports = new GraphQLSchema({
    query: RoutQuery,
    mutation:Mutation
})