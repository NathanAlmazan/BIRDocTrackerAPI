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
exports.AnalyticsObject = exports.DocumentFilesObject = exports.MessagesObject = exports.ThreadObject = exports.ThreadHistoryObject = exports.DocumentPurposeObject = exports.DocumentTypeObject = exports.DocumentStatusObject = void 0;
const graphql_1 = require("graphql");
const database_1 = __importDefault(require("../database"));
const model_1 = require("../offices/model");
exports.DocumentStatusObject = new graphql_1.GraphQLObjectType({
    name: "DocumentStatus",
    description: "Document Log Status",
    fields: () => ({
        statusId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
        },
        statusLabel: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        threads: {
            type: new graphql_1.GraphQLList(exports.ThreadObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.thread.findMany({
                    where: {
                        statusId: parent.statusId
                    }
                });
            })
        },
        threadCount: {
            type: graphql_1.GraphQLInt,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                const threads = yield database_1.default.thread.aggregate({
                    where: {
                        statusId: parent.statusId
                    },
                    _count: true
                });
                return threads._count;
            })
        }
    })
});
exports.DocumentTypeObject = new graphql_1.GraphQLObjectType({
    name: "DocumentType",
    description: "Document Log Types",
    fields: () => ({
        docId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
        },
        docType: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        threads: {
            type: new graphql_1.GraphQLList(exports.ThreadObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.thread.findMany({
                    where: {
                        docTypeId: parent.docId
                    }
                });
            })
        },
        threadCount: {
            type: graphql_1.GraphQLInt,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                const threads = yield database_1.default.thread.aggregate({
                    where: {
                        docTypeId: parent.docId
                    },
                    _count: true
                });
                return threads._count;
            })
        }
    })
});
exports.DocumentPurposeObject = new graphql_1.GraphQLObjectType({
    name: "DocumentPurpose",
    description: "Defines if thread is actionable or not",
    fields: () => ({
        purposeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        purposeName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        actionable: {
            type: graphql_1.GraphQLBoolean
        },
        threads: {
            type: new graphql_1.GraphQLList(exports.ThreadObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.thread.findMany({
                    where: {
                        purposeId: parent.purposeId
                    }
                });
            })
        }
    })
});
exports.ThreadHistoryObject = new graphql_1.GraphQLObjectType({
    name: "DocumentHistory",
    fields: () => ({
        historyId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => parent.historyId.toString()
        },
        historyLabel: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        dateCreated: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => new Date(parent.dateCreated).toISOString()
        },
        status: {
            type: exports.DocumentStatusObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                if (parent.statusId)
                    return yield database_1.default.documentStatus.findUnique({
                        where: {
                            statusId: parent.statusId
                        }
                    });
                return null;
            })
        }
    })
});
exports.ThreadObject = new graphql_1.GraphQLObjectType({
    name: "DocumentControl",
    description: "Document Control Logs",
    fields: () => ({
        refId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        refSlipNum: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        reqForm: {
            type: graphql_1.GraphQLString
        },
        subject: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        revision: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
        },
        attachments: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
        },
        completed: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
        },
        dateCreated: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateCreated).toISOString();
            }
        },
        dateUpdated: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateUpdated).toISOString();
            }
        },
        dateDue: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateDue).toISOString();
            }
        },
        author: {
            type: model_1.UserAccountObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.userAccounts.findUnique({
                    where: {
                        accountId: parent.authorId
                    }
                });
            })
        },
        status: {
            type: exports.DocumentStatusObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.documentStatus.findUnique({
                    where: {
                        statusId: parent.statusId
                    }
                });
            })
        },
        recipient: {
            type: model_1.OfficeSectionObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.officeSections.findUnique({
                    where: {
                        sectionId: parent.recipientId
                    }
                });
            })
        },
        docType: {
            type: exports.DocumentTypeObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.documentTypes.findUnique({
                    where: {
                        docId: parent.docTypeId
                    }
                });
            })
        },
        purpose: {
            type: exports.DocumentPurposeObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.documentPurpose.findUnique({
                    where: {
                        purposeId: parent.purposeId
                    }
                });
            })
        },
        messages: {
            type: new graphql_1.GraphQLList(exports.MessagesObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.messages.findMany({
                    where: {
                        refId: parent.refId
                    },
                    orderBy: {
                        dateSent: 'asc'
                    }
                });
            })
        },
        history: {
            type: new graphql_1.GraphQLList(exports.ThreadHistoryObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.threadHistory.findMany({
                    where: {
                        threadId: parent.refId
                    },
                    orderBy: {
                        dateCreated: 'asc'
                    }
                });
            })
        }
    })
});
exports.MessagesObject = new graphql_1.GraphQLObjectType({
    name: "DocumentRevision",
    description: "Document revision logs",
    fields: () => ({
        msgId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => {
                return parent.msgId.toString();
            }
        },
        message: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        dateSent: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => {
                return new Date(parent.dateSent).toISOString();
            }
        },
        sender: {
            type: model_1.UserAccountObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.userAccounts.findUnique({
                    where: {
                        accountId: parent.senderId
                    }
                });
            })
        },
        thread: {
            type: exports.ThreadObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.thread.findUnique({
                    where: {
                        refId: parent.refId
                    }
                });
            })
        },
        files: {
            type: new graphql_1.GraphQLList(exports.DocumentFilesObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.messageFiles.findMany({
                    where: {
                        msgId: parent.msgId
                    }
                });
            })
        }
    })
});
exports.DocumentFilesObject = new graphql_1.GraphQLObjectType({
    name: "DocumentFIles",
    description: "Uploaded document files",
    fields: () => ({
        fileId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => {
                return parent.msgId.toString();
            }
        },
        fileUrl: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        fileName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        fileType: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        }
    })
});
exports.AnalyticsObject = new graphql_1.GraphQLObjectType({
    name: 'Analytics',
    fields: () => ({
        status: {
            type: exports.DocumentStatusObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.documentStatus.findUnique({
                    where: {
                        statusId: parent.statusId
                    }
                });
            })
        },
        docType: {
            type: exports.DocumentTypeObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                if (parent.docTypeId)
                    return yield database_1.default.documentTypes.findUnique({
                        where: {
                            docId: parent.docTypeId
                        }
                    });
                return null;
            })
        },
        purpose: {
            type: exports.DocumentPurposeObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                if (parent.purposeId)
                    return yield database_1.default.documentPurpose.findUnique({
                        where: {
                            purposeId: parent.purposeId
                        }
                    });
                return null;
            })
        },
        count: {
            type: graphql_1.GraphQLInt
        }
    })
});
//# sourceMappingURL=model.js.map