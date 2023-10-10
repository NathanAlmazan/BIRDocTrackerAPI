import { 
    DocumentPurpose,
    DocumentStatus, 
    DocumentTypes, 
    MessageFiles, 
    Messages, 
    Thread, 
    ThreadHistory,
    ThreadTags
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
    BirOfficeObject,
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
        },
        threadCount: {
            type: GraphQLInt,
            resolve: async (parent) => {
                const threads = await dbClient.thread.aggregate({
                    where: {
                        statusId: parent.statusId
                    },
                    _count: true
                })

                return threads._count;
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
        },
        actionable: {
            type: GraphQLBoolean
        },
        threadCount: {
            type: GraphQLInt,
            resolve: async (parent) => {
                const threads = await dbClient.thread.aggregate({
                    where: {
                        docTypeId: parent.docId
                    },
                    _count: true
                })

                return threads._count;
            }
        }
    })
})

export const DocumentPurposeObject: GraphQLObjectType = new GraphQLObjectType<DocumentPurpose>({
    name: "DocumentPurpose",
    description: "Defines if thread is actionable or not",
    fields: () => ({
        purposeId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        purposeName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        threads: {
            type: new GraphQLList(ThreadObject),
            resolve: async (parent) => {
                return await dbClient.thread.findMany({
                    where: {
                        purposeId: parent.purposeId
                    }
                })
            }
        }
    })
})

export const ThreadHistoryObject: GraphQLObjectType = new GraphQLObjectType<ThreadHistory>({
    name: "DocumentHistory",
    fields: () => ({
        historyId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => parent.historyId.toString()
        },
        historyLabel: {
            type: new GraphQLNonNull(GraphQLString)
        },
        dateCreated: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => new Date(parent.dateCreated).toISOString()
        },
        status: {
            type: DocumentStatusObject,
            resolve: async (parent) => {
                if (parent.statusId) return await dbClient.documentStatus.findUnique({
                    where: {
                        statusId: parent.statusId
                    }
                })

                return null;
            }
        }
    })
})


export const ThreadTagObject: GraphQLObjectType = new GraphQLObjectType<ThreadTags>({
    name: "ThreadTags",
    fields: () => ({
        tagId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        tagName: {
            type: new GraphQLNonNull(GraphQLString)
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
        refSlipNum: {
            type: new GraphQLNonNull(GraphQLString)
        },
        reqForm: {
            type: GraphQLString
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
        active: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        purposeNotes: {
            type: GraphQLString
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
        recipientList: {
            type: new GraphQLList(OfficeSectionObject),
            resolve: async (parent) => {
                const related = await dbClient.thread.findMany({
                    where: {
                        refSlipNum: parent.refSlipNum
                    },
                    select: {
                        recipient: true
                    },
                    orderBy: {
                        recipientId: 'asc'
                    }
                })

                return related.map(thread => thread.recipient);
            }
        },
        statusList: {
            type: new GraphQLList(DocumentStatusObject),
            resolve: async (parent) => {
                const related = await dbClient.thread.findMany({
                    where: {
                        refSlipNum: parent.refSlipNum
                    },
                    select: {
                        status: true
                    },
                    orderBy: {
                        recipientId: 'asc'
                    }
                })

                return related.map(thread => thread.status);
            }
        },
        recipientUser: {
            type: UserAccountObject,
            resolve: async (parent) => {
                if (parent.recipientUserId) return await dbClient.userAccounts.findUnique({
                    where: {
                        accountId: parent.recipientUserId
                    }
                })

                return null;
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
        purpose: {
            type: DocumentPurposeObject,
            resolve: async (parent) => {
                return await dbClient.documentPurpose.findUnique({
                    where: {
                        purposeId: parent.purposeId
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
        },
        history: {
            type: new GraphQLList(ThreadHistoryObject),
            resolve: async (parent) => {
                return await dbClient.threadHistory.findMany({
                    where: {
                        threadId: parent.refId
                    },
                    orderBy: {
                        dateCreated: 'asc'
                    }
                })
            }
        },
        threadTag: {
            type: ThreadTagObject,
            resolve: async (parent) => {
                if (parent.tagId) return await dbClient.threadTags.findUnique({
                    where: {
                        tagId: parent.tagId
                    }
                })

                return null;
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

export const AnalyticsObject: GraphQLObjectType = new GraphQLObjectType<Thread>({
    name: 'Analytics',
    fields: () => ({
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
        docType: {
            type: DocumentTypeObject,
            resolve: async (parent) => {
                if (parent.docTypeId) return await dbClient.documentTypes.findUnique({
                    where: {
                        docId: parent.docTypeId
                    }
                })
                
                return null;
            }
        },
        purpose: {
            type: DocumentPurposeObject,
            resolve: async (parent) => {
                if (parent.purposeId) return await dbClient.documentPurpose.findUnique({
                    where: {
                        purposeId: parent.purposeId
                    }
                })

                return null;
            }
        },
        count: {
            type: GraphQLInt
        }
    })
})

export const SubscriptionMessageObject: GraphQLObjectType = new GraphQLObjectType({
    name: "SubscriptionMessage",
    fields: () => ({
        referenceNum: {
            type: new GraphQLNonNull(GraphQLString)
        },
        eventType: {
            type: new GraphQLNonNull(GraphQLString)
        },
        timestamp: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})
