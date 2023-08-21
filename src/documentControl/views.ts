import { 
    GraphQLBoolean,
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLString
} from "graphql";
import { 
    AnalyticsObject,
    DocumentStatusObject, 
    DocumentTypeObject, 
    MessagesObject, 
    ThreadObject
} from "./model";
import { 
    resolveAddThreadStatus, 
    resolveAddThreadType, 
    resolveCreateMessage, 
    resolveCreateThread, 
    resolveDeleteThreadStatus, 
    resolveDeleteThreadType, 
    resolveGetAllThreadStatus, 
    resolveGetAllThreadTypes, 
    resolveGetCreatedThread, 
    resolveGetInboxThread, 
    resolveGetNotifications, 
    resolveGetThreadById, 
    resolveSetMessageAsRead, 
    resolveStatusAnalytics, 
    resolveThreadTypeAnalytics, 
    resolveUpdateThreadStatus 
} from "./controller";
import { 
    MessageCreateInput, 
    ThreadCreateInput 
} from "./validation";


export const mutationFields = {
    // ========================= Fields for Thread Status ============================ //
    addThreadStatus: {
        type: DocumentStatusObject,
        args: {
            label: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveAddThreadStatus
    },
    deleteThreadStatus: {
        type: DocumentStatusObject,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolveDeleteThreadStatus
    },

    // ========================= Fields for Thread Types ============================ //
    addThreadType: {
        type: DocumentTypeObject,
        args: {
            label: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveAddThreadType
    },
    deleteThreadType: {
        type: DocumentTypeObject,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolveDeleteThreadType
    },

    // ====================== Fields for Thread and Messages ======================== //
    createThread: {
        type: ThreadObject,
        args: {
            data: {
                type: new GraphQLNonNull(ThreadCreateInput)
            }
        },
        resolve: resolveCreateThread
    },
    sendMessage: {
        type: MessagesObject,
        args: {
            data: {
                type: new GraphQLNonNull(MessageCreateInput)
            }
        },
        resolve: resolveCreateMessage
    },
    updateThreadStatus: {
        type: ThreadObject,
        args: {
            uid: {
                type: new GraphQLNonNull(GraphQLString)
            },
            statusId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            attachments: {
                type: new GraphQLNonNull(GraphQLBoolean)
            }
        },
        resolve: resolveUpdateThreadStatus
    },
    setMessageAsRead: {
        type: MessagesObject,
        args: {
            threadId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        }, 
        resolve: resolveSetMessageAsRead
    }
}

export const queryFields = {
    // ========================= Fields for Thread Status ============================ //
    getAllThreadStatus: {
        type: new GraphQLList(DocumentStatusObject),
        resolve: resolveGetAllThreadStatus
    },

    // ========================= Fields for Thread Types ============================ //
    getAllThreadTypes: {
        type: new GraphQLList(DocumentTypeObject),
        resolve: resolveGetAllThreadTypes
    },

     // ===================== Fields for Thread and Messages ======================== //
    getThreadById: {
        type: ThreadObject,
        args: {
            uid: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetThreadById
    },
    getThreadInbox: {
        type: new GraphQLList(ThreadObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            completed: {
                type: GraphQLBoolean
            }
        },
        resolve: resolveGetInboxThread
    },
    getSentThread: {
        type: new GraphQLList(ThreadObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetCreatedThread
    },
    getUserNotifications: {
        type: new GraphQLList(MessagesObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetNotifications
    },

    // ============================== Analytics =================================== //
    getStatusAnalytics: {
        type: new GraphQLList(AnalyticsObject),
        args: {
            officeId: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            completed: {
                type: new GraphQLNonNull(GraphQLBoolean),
            },
            superuser: {
                type: GraphQLBoolean
            }
        },
        resolve: resolveStatusAnalytics
    },
    getThreadTypeAnalytics: {
        type: new GraphQLList(AnalyticsObject),
        args: {
            officeId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            superuser: {
                type: GraphQLBoolean
            },
            startDate: {
                type: new GraphQLNonNull(GraphQLString)
            },
            endDate: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveThreadTypeAnalytics
    }
}