"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const web_push_1 = __importDefault(require("web-push"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const graphql_1 = require("graphql");
// project imports
const offices_1 = require("./offices");
const documentControl_1 = require("./documentControl");
const database_1 = __importDefault(require("./database"));
dotenv_1.default.config();
// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: () => ((0, lodash_1.merge)(offices_1.officesMutationFields, documentControl_1.docControlMutationFields))
});
const RootQueries = new graphql_1.GraphQLObjectType({
    name: "Query",
    fields: () => ((0, lodash_1.merge)(offices_1.officesQueryFields, documentControl_1.docControlQueryFields))
});
const schema = new graphql_1.GraphQLSchema({
    mutation: RootMutation,
    query: RootQueries
});
// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
// Set up ApolloServer.
const server = new server_1.ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
        // Proper shutdown for the WebSocket server.
        {
            serverWillStart() {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        drainServer() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield serverCleanup.dispose();
                            });
                        },
                    };
                });
            },
        },
    ],
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/media', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
server.start().then(() => {
    app.use('/graphql', (0, express4_1.expressMiddleware)(server));
}).catch(err => console.error(err));
// ========================================== FILE UPLOADS ======================================== //
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path_1.default.join(__dirname, 'uploads'));
    },
    filename: (req, file, callback) => {
        const currDate = new Date().toISOString();
        callback(null, new Date().getTime().toString() + '_' + file.originalname.replace(/ /g, ""));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.post("/upload", upload.array("files"), (req, res) => {
    if (req.files) {
        const files = req.files;
        return res.status(200).json({ files: files.map(file => ({
                fileName: file.originalname,
                fileUrl: `${process.env.BASE_URL}/media/${file.filename}`,
                fileType: file.mimetype
            })) });
    }
    return res.status(400).json({ message: "Failed to upload." });
});
app.post("/requestForm", upload.single("form"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const file = req.file;
        yield database_1.default.thread.update({
            where: {
                refId: req.body.requestId
            },
            data: {
                reqForm: `${process.env.BASE_URL}/media/${file.filename}`
            }
        });
        return res.status(200).json({
            fileName: req.body.requestId,
            fileUrl: `${process.env.BASE_URL}/media/${file.filename}`,
            fileType: file.mimetype
        });
    }
    return res.status(400).json({ message: "Failed to upload." });
}));
// ======================================= NOTIFICATION FEATURES ========================================== //
//setting vapid keys details
web_push_1.default.setVapidDetails("mailto: <nathan.almazan1004@gmail.com>", process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);
//subscribe route
app.post('/subscribe/:uid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get push subscription object from the request
    const uid = req.params.uid;
    const subscription = req.body;
    const payload = JSON.stringify(subscription);
    const account = yield database_1.default.userAccounts.findUnique({
        where: {
            accountId: uid
        },
        select: {
            accountId: true,
            subscription: true
        }
    });
    if (!account)
        return res.status(400).json({ message: "User not found." });
    yield database_1.default.userAccounts.update({
        where: {
            accountId: uid
        },
        data: {
            subscription: payload
        }
    });
    // send status 201 for the request
    return res.status(201).json({
        message: 'User Subscribed.'
    });
}));
const PORT = process.env.PORT || 8080;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
//# sourceMappingURL=index.js.map