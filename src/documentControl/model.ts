import { 
    DocumentStatus, 
    DocumentTypes, 
    MessageFiles, 
    Messages, 
    Thread 
} from "@prisma/client"
import { 
    GraphQLBoolean, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLString 
} from "graphql"
import dbClient from "../database"
import { 
    OfficeSectionObject, 
    UserAccountObject 
} from "../offices/model"


export const DocumentStatusObject: GraphQLObjectType = new GraphQLObjectType<DocumentStatus>({
    name: "DocumentStatus",
    description: "Document Log Status",
    fields: () => ({
        statusId: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        statusLabel: {
            type: new GraphQLNonNull(GraphQLString)
        },
        threads: {
            type: new GraphQLList(ThreadObject),
            resolve: async (parent) => {
                return await dbClient.thread.findMany({
                    where: {
                        statusId: parent.statusId
                    }
                })
            }
        }
    })
})

export const DocumentTypeObject: GraphQLObjectType = new GraphQLObjectType<DocumentTypes>({
    name: "DocumentType",
    description: "Document Log Types",
    fields: () => ({
        docId: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        docType: {
            type: new GraphQLNonNull(GraphQLString)
        },
        threads: {
            type: new GraphQLList(ThreadObject),
            resolve: async (parent) => {
                return await dbClient.thread.findMany({
                    where: {
                        docTypeId: parent.docId
                    }
                })
            }
        }
    })
})

export const ThreadObject: GraphQLObjectType = new GraphQLObjectType<Thread>({
    name: "DocumentControl",
    description: "Document Control Logs",
    fields: () => ({
        refId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        subject: {
            type: new GraphQLNonNull(GraphQLString)
        },
        revision: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        attachments: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        completed: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        dateCreated: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateCreated).toISOString()
            }
        },
        dateUpdated: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateUpdated).toISOString()
            }
        },
        dateDue: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateDue).toISOString()
            }
        },
        author: {
            type: UserAccountObject,
            resolve: async (parent) => {
                return await dbClient.userAccounts.findUnique({
                    where: {
                        accountId: parent.authorId
                    }
                })
            }
        },
        status: {
            type: DocumentStatusObject,
            resolve: async (parent) => {
                return await dbClient.documentStatus.findUnique({
                    where: {
                        statusId: parent.statusId
                    }
                })
            }
        },
        recipient: {
            type: OfficeSectionObject,
            resolve: async (parent) => {
                return await dbClient.officeSections.findUnique({
                    where: {
                        sectionId: parent.recipientId
                    }
                })
            }
        },
        docType: {
            type: DocumentTypeObject,
            resolve: async (parent) => {
                return await dbClient.documentTypes.findUnique({
                    where: {
                        docId: parent.docTypeId
                    }
                })
            }
        },
        messages: {
            type: new GraphQLList(MessagesObject),
            resolve: async (parent) => {
                return await dbClient.messages.findMany({
                    where: {
                        refId: parent.refId
                    },
                    orderBy: {
                        dateSent: 'asc'
                    }
                })
            }
        }
    })
})


export const MessagesObject: GraphQLObjectType = new GraphQLObjectType<Messages>({
    name: "DocumentRevision",
    description: "Document revision logs",
    fields: () => ({
        msgId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return parent.msgId.toString()
            }
        },
        message: {
            type: new GraphQLNonNull(GraphQLString)
        },
        dateSent: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateSent).toISOString()
            }
        },
        sender: {
            type: UserAccountObject,
            resolve: async (parent) => {
                return await dbClient.userAccounts.findUnique({
                    where: {
                        accountId: parent.senderId
                    }
                }) 
            }
        },
        thread: {
            type: ThreadObject,
            resolve: async (parent) => {
                return await dbClient.thread.findUnique({
                    where: {
                        refId: parent.refId
                    }
                }) 
            }
        },
        files: {
            type: new GraphQLList(DocumentFilesObject),
            resolve: async (parent) => {
                return await dbClient.messageFiles.findMany({
                    where: {
                        msgId: parent.msgId
                    }
                })
            }
        }
    })
})


export const DocumentFilesObject: GraphQLObjectType = new GraphQLObjectType<MessageFiles>({
    name: "DocumentFIles",
    description: "Uploaded document files",
    fields: () => ({
        fileId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return parent.msgId.toString()
            }
        },
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
