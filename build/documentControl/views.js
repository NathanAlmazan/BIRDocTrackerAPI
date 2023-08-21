"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryFields = exports.mutationFields = void 0;
const graphql_1 = require("graphql");
const model_1 = require("./model");
const controller_1 = require("./controller");
const validation_1 = require("./validation");
exports.mutationFields = {
    // ========================= Fields for Thread Status ============================ //
    addThreadStatus: {
        type: model_1.DocumentStatusObject,
        args: {
            label: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveAddThreadStatus
    },
    deleteThreadStatus: {
        type: model_1.DocumentStatusObject,
        args: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            }
        },
        resolve: controller_1.resolveDeleteThreadStatus
    },
    // ========================= Fields for Thread Types ============================ //
    addThreadType: {
        type: model_1.DocumentTypeObject,
        args: {
            label: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveAddThreadType
    },
    deleteThreadType: {
        type: model_1.DocumentTypeObject,
        args: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            }
        },
        resolve: controller_1.resolveDeleteThreadType
    },
    // ====================== Fields for Thread and Messages ======================== //
    createThread: {
        type: model_1.ThreadObject,
        args: {
            data: {
                type: new graphql_1.GraphQLNonNull(validation_1.ThreadCreateInput)
            }
        },
        resolve: controller_1.resolveCreateThread
    },
    sendMessage: {
        type: model_1.MessagesObject,
        args: {
            data: {
                type: new graphql_1.GraphQLNonNull(validation_1.MessageCreateInput)
            }
        },
        resolve: controller_1.resolveCreateMessage
    },
    updateThreadStatus: {
        type: model_1.ThreadObject,
        args: {
            uid: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            statusId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            },
            attachments: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
            }
        },
        resolve: controller_1.resolveUpdateThreadStatus
    },
    setMessageAsRead: {
        type: model_1.MessagesObject,
        args: {
            threadId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            userId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveSetMessageAsRead
    }
};
exports.queryFields = {
    // ========================= Fields for Thread Status ============================ //
    getAllThreadStatus: {
        type: new graphql_1.GraphQLList(model_1.DocumentStatusObject),
        resolve: controller_1.resolveGetAllThreadStatus
    },
    // ========================= Fields for Thread Types ============================ //
    getAllThreadTypes: {
        type: new graphql_1.GraphQLList(model_1.DocumentTypeObject),
        resolve: controller_1.resolveGetAllThreadTypes
    },
    // ===================== Fields for Thread and Messages ======================== //
    getThreadById: {
        type: model_1.ThreadObject,
        args: {
            uid: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveGetThreadById
    },
    getThreadInbox: {
        type: new graphql_1.GraphQLList(model_1.ThreadObject),
        args: {
            userId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            completed: {
                type: graphql_1.GraphQLBoolean
            }
        },
        resolve: controller_1.resolveGetInboxThread
    },
    getSentThread: {
        type: new graphql_1.GraphQLList(model_1.ThreadObject),
        args: {
            userId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveGetCreatedThread
    },
    getUserNotifications: {
        type: new graphql_1.GraphQLList(model_1.MessagesObject),
        args: {
            userId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveGetNotifications
    },
    // ============================== Analytics =================================== //
    getStatusAnalytics: {
        type: new graphql_1.GraphQLList(model_1.AnalyticsObject),
        args: {
            officeId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
            },
            completed: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
            },
            superuser: {
                type: graphql_1.GraphQLBoolean
            }
        },
        resolve: controller_1.resolveStatusAnalytics
    },
    getThreadTypeAnalytics: {
        type: new graphql_1.GraphQLList(model_1.AnalyticsObject),
        args: {
            officeId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            },
            superuser: {
                type: graphql_1.GraphQLBoolean
            },
            startDate: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            endDate: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveThreadTypeAnalytics
    }
};
//# sourceMappingURL=views.js.map