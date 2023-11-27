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
import schedule from 'node-schedule';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
    GraphQLObjectType, 
    GraphQLSchema 
} from "graphql";
// project imports
import { 
    officesQueries, 
    officesMutations 
} from "./offices";
import { 
    docControlMutations, 
    docControlQueries,
    docControlSubscriptions
} from "./documentControl";
import {
    scheduleMutations,
    scheduleQueries
} from './schedules';
import dbClient from "./database";
import { Schedules, Thread } from "@prisma/client";

dotenv.config();

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const RootMutation: GraphQLObjectType = new GraphQLObjectType({
    name: "Mutation",
    fields: () => (merge(officesMutations, docControlMutations, scheduleMutations))
})

const RootQueries: GraphQLObjectType = new GraphQLObjectType({
    name: "Query",
    fields: () => (merge(officesQueries, docControlQueries, scheduleQueries))
})

const RootSubscriptions: GraphQLObjectType = new GraphQLObjectType({
    name: "Subscription",
    fields: () => (merge(docControlSubscriptions))
})

const schema = new GraphQLSchema({
    mutation: RootMutation,
    query: RootQueries,
    subscription: RootSubscriptions
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


// ========================================== FILE UPLOADS ======================================== //

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

app.post("/requestForm", upload.single("form"), async (req, res) => {
    if (req.file) {
        const file: Express.Multer.File = req.file as unknown as Express.Multer.File;

        await dbClient.thread.update({
            where: {
                refId: req.body.requestId
            },
            data: {
                reqForm: `${process.env.BASE_URL}/media/${file.filename}`
            }
        })

        return res.status(200).json({
            fileName: req.body.requestId,
            fileUrl: `${process.env.BASE_URL}/media/${file.filename}`,
            fileType: file.mimetype
        });
    }
    return res.status(400).json({ message: "Failed to upload." });
});

// ======================================= NOTIFICATION FEATURES ========================================== //

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

const PORT = process.env.PORT || 8080;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});

// ============================= SCHEDULED JOBS ======================================= //

interface DueThreadQuery {
    refId: string;
    subject: string;
    broadcast: boolean;
    sectionId: number;
    officeId: number;
    refSlipNum: string;
}

// job to push notifications on thread nearing their due dates
const dueRequests = schedule.scheduleJob('0 8 * * *', function() {

    dbClient.$queryRaw`SELECT thr."refId", thr."subject", thr."broadcast", thr."refSlipNum", sec."sectionId", sec."officeId"
        FROM public."Thread" thr
        LEFT JOIN public."OfficeSections" sec ON thr."recipientId" = sec."sectionId"
        WHERE "dateDue" > NOW() AND EXTRACT(DAY FROM "dateDue" - NOW()) < 8;`

        .then((data) => {
            const result = data as DueThreadQuery[];

            result.forEach(thread => {
                const payload = JSON.stringify({
                    title: `Notice of Deadline of Request # ${thread.refSlipNum}!`,
                    body: thread.subject, 
                    icon: 'https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png'
                });

                // broadcast to all sections if set to broadcast
                if (thread.broadcast) {
                    dbClient.officeSections.findMany({
                        where: {
                            officeId: thread.officeId
                        },
                        select: {
                            employees: {
                                select: {
                                    accountId: true,
                                    subscription: true
                                }
                            }
                        }
                    })
                    .then(allSections => {
                        allSections.forEach(section => {
                            section.employees.forEach(employee => {
                                if (employee.subscription) {
                                    webpush.sendNotification(JSON.parse(employee.subscription), payload).catch(err => console.error(err))
                                }
                            })
                        })
                    })
                    .catch(err => console.log(err));

                } else {
                    dbClient.officeSections.findUnique({
                        where: {
                            sectionId: thread.sectionId
                        },
                        select: {
                            employees: {
                                select: {
                                    accountId: true,
                                    subscription: true
                                }
                            }
                        }
                    })
                    .then(section => {
                        if (section) {
                            section.employees.forEach(employee => {
                                if (employee.subscription) webpush.sendNotification(JSON.parse(employee.subscription), payload)
                                    .catch(err => console.error(err));
                            })
                        }
                    })
                    .catch(err => console.log(err));
                }
            })
        })
        .catch(err => console.log(err));
});


const dueReports = schedule.scheduleJob('0 8 * * *', function() {

    // notifications for monthly report
    dbClient.$queryRaw`SELECT * FROM public."Schedules" WHERE "repeat" = 'Monthly' AND (EXTRACT(DAY FROM "dateDue") - EXTRACT(DAY FROM NOW())) BETWEEN 0 AND 8;`
        .then(data => {
            const result = data as Schedules[];
            
            result.forEach(res => {
                const payload = JSON.stringify({
                    title: `Notice of Report Deadline for ${res.subject}!`,
                    body: res.description, 
                    icon: 'https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png'
                });
    
                dbClient.userAccounts.findMany({
                    where: {
                        roleId: {
                            in: res.recipientIds.split('.').map(id => parseInt(id))
                        }
                    }
                })
                .then(data => {
                    data.forEach(employee => {
                        if (employee.subscription) webpush.sendNotification(JSON.parse(employee.subscription), payload)
                            .catch(err => console.error(err));
                    })
                })
                .catch(err => console.error(err));
            })
        })
        .catch(err => console.log(err))

    // notifications for yearly report
    dbClient.$queryRaw`SELECT * FROM public."Schedules" WHERE "repeat" = 'Yearly' AND EXTRACT(DAY FROM ("dateDue" - NOW())) BETWEEN 0 AND 8;`
        .then(data => {
            const result = data as Schedules[];
            
            result.forEach(res => {
                const payload = JSON.stringify({
                    title: `Notice of Report Deadline for ${res.subject}!`,
                    body: res.description, 
                    icon: 'https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png'
                });
    
                dbClient.userAccounts.findMany({
                    where: {
                        roleId: {
                            in: res.recipientIds.split('.').map(id => parseInt(id))
                        }
                    }
                })
                .then(data => {
                    data.forEach(employee => {
                        if (employee.subscription) webpush.sendNotification(JSON.parse(employee.subscription), payload)
                            .catch(err => console.error(err));
                    })
                })
                .catch(err => console.error(err));
            })
        })
        .catch(err => console.log(err))
})