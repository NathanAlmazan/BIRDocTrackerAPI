import { 
    GraphQLBoolean,
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLString
} from "graphql";
import { 
    AnalyticsObject,
    DocumentPurposeObject,
    DocumentStatusObject, 
    DocumentTypeObject, 
    MessagesObject, 
    ThreadObject,
    ThreadTagObject
} from "./model";
import { 
    resolveAddThreadPurpose,
    resolveAddThreadStatus, 
    resolveAddThreadType, 
    resolveArchiveThread, 
    resolveCreateMessage, 
    resolveCreateThread, 
    resolveDeleteThreadStatus, 
    resolveDeleteThreadType, 
    resolveGenerateTempRefNum, 
    resolveGetAllInbox, 
    resolveGetAllTags, 
    resolveGetAllThreadPurpose, 
    resolveGetAllThreadStatus, 
    resolveGetAllThreadTypes, 
    resolveGetCreatedThread, 
    resolveGetInboxThread, 
    resolveGetNotifications, 
    resolveGetThreadById, 
    resolveGetThreadSummary, 
    resolveRestoreThread, 
    resolveSetMessageAsRead, 
    resolveStatusAnalytics, 
    resolveSubscribeOfficeInbox, 
    resolveSubscribeSectionInbox, 
    resolveSubscribeThreadMsg, 
    resolveThreadPurposeAnalytics, 
    resolveThreadTypeAnalytics, 
    resolveUpdateThread, 
    resolveUpdateThreadStatus 
} from "./controller";
import { 
    MessageCreateInput, 
    ThreadCreateInput, 
    ThreadUpdateInput
} from "./validation";
import dbClient from "../database";
import pubsub from "../pubsub";


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

    // ======================== Fields for Thread Purposes ========================== //
    addThreadPurpose: {
        type: DocumentPurposeObject,
        args: {
            name: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveAddThreadPurpose
    },


    // ====================== Fields for Thread and Messages ======================== //
    createThread: {
        type: new GraphQLList(ThreadObject),
        args: {
            data: {
                type: new GraphQLNonNull(ThreadCreateInput)
            }
        },
        resolve: resolveCreateThread
    },
    updateThread: {
        type: new GraphQLList(ThreadObject),
        args: {
            data: {
                type: ThreadUpdateInput
            }
        },
        resolve: resolveUpdateThread
    },
    archiveThread: {
        type: ThreadObject,
        args: {
            threadId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveArchiveThread
    },
    restoreThread: {
        type: ThreadObject,
        args: {
            threadId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveRestoreThread
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
    // ========================= Fields for Thread Types ============================ //
    getAllThreadPurpose: {
        type: new GraphQLList(DocumentPurposeObject),
        resolve: resolveGetAllThreadPurpose
    },
    getAllThreadTags: {
        type: new GraphQLList(ThreadTagObject),
        resolve: resolveGetAllTags
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
    getThreadRefNum: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
            authorId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGenerateTempRefNum
    },
    getThreadInbox: {
        type: new GraphQLList(ThreadObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            type: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetInboxThread
    },
    getSentThread: {
        type: new GraphQLList(ThreadObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            type: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetCreatedThread
    },
    getAllThread: {
        type: new GraphQLList(ThreadObject),
        args: {
            memos: {
                type: GraphQLBoolean
            }
        },
        resolve: resolveGetAllInbox
    },
    getUserNotifications: {
        type: new GraphQLList(ThreadObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            type: {
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
    },
    getThreadPurposeAnalytics: {
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
        resolve: resolveThreadPurposeAnalytics
    },
    getThreadSummary: {
        type: new GraphQLList(ThreadObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            dateCreated: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetThreadSummary
    },
    testSubscriptions: {
        type: ThreadObject,
        resolve: async () => {
            const threads = await dbClient.thread.findMany({
                take: 2
            });

            pubsub.publish('6_OFFICE_INBOX', { officeInbox: threads })

            return null;
        }
    }
}

export const subscriptionFields = {
    officeInbox: {
        type: new GraphQLList(ThreadObject),
        args: {
            officeId: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        subscribe: resolveSubscribeOfficeInbox
    },
    sectionInbox: {
        type: new GraphQLList(ThreadObject),
        args: {
            sectionId: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        subscribe: resolveSubscribeSectionInbox
    },
    userInbox: {
        type: new GraphQLList(ThreadObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        subscribe: resolveSubscribeSectionInbox
    },
    threadMessage: {
        type: MessagesObject,
        args: {
            threadId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        subscribe: resolveSubscribeThreadMsg
    }
}