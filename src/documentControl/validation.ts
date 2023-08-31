import { MessageFiles, Thread } from "@prisma/client";
import { 
    GraphQLBoolean,
    GraphQLInputObjectType, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLString 
} from "graphql";


// =============================================== Thread and Messages Validation ================================================ //

export interface ThreadCreateInput {
    data: Pick<Thread, "subject" | "authorId" | "statusId" | "recipientId" | "docTypeId" | "attachments" | "completed" | "dateDue" | "purposeId">
}

export const ThreadCreateInput: GraphQLInputObjectType  = new GraphQLInputObjectType({
    name: "ThreadInput",
    fields: () => ({
        subject: {
            type: new GraphQLNonNull(GraphQLString)
        },
        authorId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        statusId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        recipientId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        docTypeId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        purposeId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        attachments: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        completed: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        dateDue: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export interface MessageCreateInput {
    data: {
        message: string;
        senderId: string;
        threadId: string;
        files: Pick<MessageFiles, "fileName" | "fileUrl" | "fileType">[]
    }
}

export const MessageCreateInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "MessageInput",
    fields: () => ({
        message: {
            type: new GraphQLNonNull(GraphQLString)
        },
        senderId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        threadId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        files: {
            type: new GraphQLList(MessageFileInput)
        }
    })
})

export const MessageFileInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "MessageFileInput",
    fields: () => ({
        fileUrl: {
            type: new GraphQLNonNull(GraphQLString)
        },
        fileName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        fileType: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})