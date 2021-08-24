const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql');

app.use('/', express.static('frontend'))

app.use('/graphql', graphqlHTTP({
    schema:schema,
    graphiql: true,
}));

const port = process.env.PORT | 4000

app.listen(port, () => {
    console.log("the server is runnig on port 4000")
})