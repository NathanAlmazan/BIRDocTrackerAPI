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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const web_push_1 = __importDefault(require("web-push"));
const body_parser_1 = __importDefault(require("body-parser"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const graphql_1 = require("graphql");
const offices_1 = require("./offices");
const documentControl_1 = require("./documentControl");
const database_1 = __importDefault(require("./database"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
// ====================== Apollo Server ======================= //
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "RootMutation",
    fields: () => ((0, lodash_1.merge)(offices_1.officesMutationFields, documentControl_1.docControlMutationFields))
});
const RootQueries = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: () => ((0, lodash_1.merge)(offices_1.officesQueryFields, documentControl_1.docControlQueryFields))
});
const schema = new graphql_1.GraphQLSchema({
    mutation: RootMutation,
    query: RootQueries
});
const server = new server_1.ApolloServer({
    schema
});
// ====================== Express Server ======================= //
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/media', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
server.start().then(() => {
    app.use('/graphql', (0, cors_1.default)(), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server));
}).catch(err => console.error(err));
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
                fileUrl: `http://birtracker.nat911.com/assets/media/${file.filename}`,
                fileType: file.mimetype
            })) });
    }
    return res.status(400).json({ message: "Failed to upload." });
});
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
// Create the HTTPS or HTTP server, per configuration
let httpServer;
try {
    httpServer = https_1.default.createServer({
        key: fs_1.default.readFileSync(`/etc/ssl/certificate.crt`),
        cert: fs_1.default.readFileSync(`/etc/ssl/private.key`),
    }, app);
    console.log('Server is HTTPS');
}
catch (err) {
    console.log('Server is HTTP');
    console.log(err);
    httpServer = http_1.default.createServer(app);
}
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => httpServer.listen({ port: port }, resolve));
});
startServer().then(() => {
    console.log('Server ready on port', port);
}).catch(err => {
    console.log(err);
});
//# sourceMappingURL=index.js.map