import { merge } from "lodash";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import webpush from 'web-push';
import multer from "multer";
import path from "path";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
    GraphQLObjectType, 
    GraphQLSchema 
} from "graphql";
// project imports
import { 
    officesMutationFields, 
    officesQueryFields 
} from "./offices";
import { 
    docControlMutationFields, 
    docControlQueryFields 
} from "./documentControl";
import dbClient from "./database";

dotenv.config();

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const RootMutation: GraphQLObjectType = new GraphQLObjectType({
    name: "Mutation",
    fields: () => (merge(officesMutationFields, docControlMutationFields))
})

const RootQueries: GraphQLObjectType = new GraphQLObjectType({
    name: "Query",
    fields: () => (merge(officesQueryFields, docControlQueryFields))
})

const schema = new GraphQLSchema({
    mutation: RootMutation,
    query: RootQueries
})

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/media', express.static(path.join(__dirname, 'uploads')));

server.start().then(() => {
    app.use('/graphql', expressMiddleware(server));
}).catch(err => console.error(err));

// apis
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, callback) => {
        const currDate = new Date().toISOString();
        
        callback(null, new Date().getTime().toString() + '_' + file.originalname.replace(/ /g, ""));
    }
})

const upload = multer({ storage: storage });

app.post("/upload", upload.array("files"), (req, res) => {
    if (req.files) {
        const files: Express.Multer.File[] = req.files as unknown as Express.Multer.File[];

        return res.status(200).json({ files: files.map(file => ({
            fileName: file.originalname,
            fileUrl: `${process.env.BASE_URL}/media/${file.filename}`,
            fileType: file.mimetype
        }))});
    }
    return res.status(400).json({ message: "Failed to upload." });
});

//setting vapid keys details
webpush.setVapidDetails("mailto: <nathan.almazan1004@gmail.com>", process.env.PUBLIC_VAPID_KEY as string, process.env.PRIVATE_VAPID_KEY as string);

//subscribe route
app.post('/subscribe/:uid', async (req, res) => {
    // get push subscription object from the request
    const uid = req.params.uid;
    const subscription = req.body;

    const payload = JSON.stringify(subscription);

    const account = await dbClient.userAccounts.findUnique({
        where: {
            accountId: uid
        },
        select: {
            accountId: true,
            subscription: true
        }
    })

    if (!account) return res.status(400).json({ message: "User not found." });

    await dbClient.userAccounts.update({
        where: {
            accountId: uid
        },
        data: {
            subscription: payload
        }
    })

    // send status 201 for the request
    return res.status(201).json({
        message: 'User Subscribed.'
    })
})

const PORT = 8080;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});