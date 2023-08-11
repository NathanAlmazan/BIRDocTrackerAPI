import { merge } from "lodash";
import express from "express";
import multer from "multer";
import path from "path";
import cors from 'cors';
import webpush from 'web-push';
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { 
    GraphQLObjectType, 
    GraphQLSchema 
} from "graphql";
import { 
    officesMutationFields, 
    officesQueryFields 
} from "./offices";
import { 
    docControlMutationFields, 
    docControlQueryFields 
} from "./documentControl";
import dbClient from "./database";
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import fs from 'fs';


dotenv.config();

// ====================== Apollo Server ======================= //

const RootMutation: GraphQLObjectType = new GraphQLObjectType({
    name: "RootMutation",
    fields: () => (merge(officesMutationFields, docControlMutationFields))
})

const RootQueries: GraphQLObjectType = new GraphQLObjectType({
    name: "RootQuery",
    fields: () => (merge(officesQueryFields, docControlQueryFields))
})

const schema = new GraphQLSchema({
    mutation: RootMutation,
    query: RootQueries
})

const server = new ApolloServer({
    schema
});

// ====================== Express Server ======================= //
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/media', express.static(path.join(__dirname, 'uploads')));

server.start().then(() => {
    app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));
}).catch(err => console.error(err));

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
            fileUrl: `http://birtracker.nat911.com/assets/media/${file.filename}`,
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

// Create the HTTPS or HTTP server, per configuration
let httpServer: https.Server | http.Server;
try {
    httpServer = https.createServer(
        {
        key: fs.readFileSync(`/etc/ssl/private.key`),
        cert: fs.readFileSync(`/etc/ssl/certificate.crt`),
        }, app);
    console.log('Server is HTTPS');
} catch(err) {
    console.log('Server is HTTP');
    console.log(err);
    httpServer = http.createServer(app);
}

const startServer = async () => {
    await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
}

startServer().then(() => {
    console.log('Server ready on port', port);
}).catch(err => {
    console.log(err);
})