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
    data: {
        subject: string;
        authorId: string;
        statusId: number;
        recipientId: number[];
        docTypeId: number;
        attachments: boolean;
        completed: boolean;
        dateDue: Date;
        purposeId: number;
        recipientUserId: string[];
        tagId: number | null;
        purposeNotes: string | null;
    }
}

export const ThreadCreateInput: GraphQLInputObjectType  = new GraphQLInputObjectType({
    name: "ThreadCreateInput",
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
            type: new GraphQLList(GraphQLInt)
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
        },
        tagId: {
            type: GraphQLInt
        },
        recipientUserId: {
            type: new GraphQLList(GraphQLString)
        },
        purposeNotes: {
            type: GraphQLString
        }
    })
})

export interface ThreadUpdateInput {
    data: {
        threadId: string;
        subject: string;
        docTypeId: number;
        dateDue: Date;
        purposeId: number;
        tagId: number | null;
        purposeNotes: string | null;
    }
}

export const ThreadUpdateInput: GraphQLInputObjectType  = new GraphQLInputObjectType({
    name: "ThreadUpdateInput",
    fields: () => ({
        subject: {
            type: new GraphQLNonNull(GraphQLString)
        },
        docTypeId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        purposeId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        dateDue: {
            type: new GraphQLNonNull(GraphQLString)
        },
        tagId: {
            type: GraphQLInt
        },
        purposeNotes: {
            type: GraphQLString
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