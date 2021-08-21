const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql')
const axios = require("axios")


// Geo Object Type
const GeoObjectType = new GraphQLObjectType({
    name:"Geo",
    fields: () => ({
        lat: {
            type: GraphQLString
        },
        lng: {
            type: GraphQLString
        }
    })
})

// Geo Input Object Type
const GeoInputObjectType = new GraphQLInputObjectType({
    name:"GeoInput",
    fields: () => ({
        lat: {
            type: GraphQLString
        },
        lng: {
            type: GraphQLString
        }
    })
})


// Adress Object Type
const AddressObjectType = new GraphQLObjectType({
    name:"Address",
    fields: () => ({
        street: {
            type: GraphQLString
        },
        suite: {
            type: GraphQLString
        },
        city: {
            type: GraphQLString
        },
        zipcode: {
            type: GraphQLString
        },
        geo: {
            type: GeoObjectType
        }
    })
})

// Adress Input Object Type
const AddressInputObjectType = new GraphQLInputObjectType({
    name:"AddressInput",
    fields: () => ({
        street: {
            type: GraphQLString
        },
        suite: {
            type: GraphQLString
        },
        city: {
            type: GraphQLString
        },
        zipcode: {
            type: GraphQLString
        },
        geo: {
            type: GeoInputObjectType
        }
    })
})

// User Type
const UserObjectType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        address: {
            type: AddressObjectType
        },
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserObjectType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve(parent, args) {
                return axios.get("http://localhost:3000/users/" + args.id).then(res => res.data)
            }
        },
        users: {
            type: new GraphQLList(UserObjectType),
            resolve(parent, args) {
                return axios.get("http://localhost:3000/users").then(res => res.data)
            }
        }
    }
})

// Mutations
const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        addUser: {
            type: UserObjectType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                username: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                address: {
                    type: AddressInputObjectType
                }
            },
            resolve(parent, args) {
                return axios.post("http://localhost:3000/users", {
                    name:args.name,
                    username:args.username,
                    email:args.email,
                    address:args.address
                }).then(res => res.data)
            }
        },
        deleteUser: {
            type: UserObjectType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parent, args) {
                return axios.delete('http://localhost:3000/users/'+ args.id).then(res => res.data)
            }
        },
        EditUser: {
            type: UserObjectType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                name: {
                    type: GraphQLString
                },
                username: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                address: {
                    type: AddressInputObjectType
                }
            },
            resolve(parent, args) {
                return axios.patch("http://localhost:3000/users/"+ args.id,args).then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})