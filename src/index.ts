import { merge } from "lodash";
import express from "express";
import multer from "multer";
import path from "path";
import cors from 'cors';
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
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

startStandaloneServer(server, {
    listen: { port: 8080 },
}).then(({ url }) => {
    console.log("Apollo Server running at", url)   
})

// ====================== Express Server ======================= //
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/media', express.static(path.join(__dirname, 'uploads')));

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
            fileUrl: `http://localhost:${port}/media/${file.filename}`,
            fileType: file.mimetype
        }))});
    }
    return res.status(400).json({ message: "Failed to upload." });
});

app.listen(port, () => {
    console.log("Media Server running at",  `http://localhost:${port}`);
}).on("error", (err: Error) => {
    console.log("Error", err.message);
});
