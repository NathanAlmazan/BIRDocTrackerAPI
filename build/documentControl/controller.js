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
exports.resolveThreadTypeAnalytics = exports.resolveStatusAnalytics = exports.resolveSetMessageAsRead = exports.resolveGetAllInbox = exports.resolveGetNotifications = exports.resolveGetInboxThread = exports.resolveGetCreatedThread = exports.resolveUpdateThreadStatus = exports.resolveGetThreadById = exports.resolveCreateMessage = exports.resolveCreateThread = exports.resolveGetAllThreadPurpose = exports.resolveAddThreadPurpose = exports.resolveDeleteThreadType = exports.resolveGetAllThreadTypes = exports.resolveAddThreadType = exports.resolveDeleteThreadStatus = exports.resolveGetAllThreadStatus = exports.resolveAddThreadStatus = void 0;
const graphql_1 = require("graphql");
const database_1 = __importDefault(require("../database"));
const web_push_1 = __importDefault(require("web-push"));
// =============================================== Thread Status Controller ================================================ //
const resolveAddThreadStatus = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentStatus.create({
        data: {
            statusLabel: args.label
        }
    });
});
exports.resolveAddThreadStatus = resolveAddThreadStatus;
const resolveGetAllThreadStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentStatus.findMany();
});
exports.resolveGetAllThreadStatus = resolveGetAllThreadStatus;
const resolveDeleteThreadStatus = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentStatus.delete({
        where: {
            statusId: args.id
        }
    });
});
exports.resolveDeleteThreadStatus = resolveDeleteThreadStatus;
// =============================================== Thread Types Controller ================================================ //
const resolveAddThreadType = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentTypes.create({
        data: {
            docType: args.label
        }
    });
});
exports.resolveAddThreadType = resolveAddThreadType;
const resolveGetAllThreadTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentTypes.findMany();
});
exports.resolveGetAllThreadTypes = resolveGetAllThreadTypes;
const resolveDeleteThreadType = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentTypes.delete({
        where: {
            docId: args.id
        }
    });
});
exports.resolveDeleteThreadType = resolveDeleteThreadType;
// ============================================= Thread Purpose Controller ================================================ //
const resolveAddThreadPurpose = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentPurpose.create({
        data: {
            purposeName: args.name,
            actionable: args.actionable
        }
    });
});
exports.resolveAddThreadPurpose = resolveAddThreadPurpose;
const resolveGetAllThreadPurpose = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.documentPurpose.findMany({
        orderBy: {
            purposeName: 'asc'
        }
    });
});
exports.resolveGetAllThreadPurpose = resolveGetAllThreadPurpose;
// =========================================== Thread and Messages Controller ============================================= //
const resolveCreateThread = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.thread.create({
        data: args.data
    });
});
exports.resolveCreateThread = resolveCreateThread;
const resolveCreateMessage = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    // check if revision
    const thread = yield database_1.default.thread.findUnique({
        where: {
            refId: args.data.threadId
        },
        select: {
            revision: true,
            authorId: true,
            subject: true,
            recipient: {
                select: {
                    sectionId: true,
                    sectionName: true,
                    officeId: true
                }
            }
        }
    });
    if (!thread)
        throw new graphql_1.GraphQLError('Thread does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    if (thread.authorId !== args.data.senderId)
        yield database_1.default.thread.update({
            where: {
                refId: args.data.threadId
            },
            data: {
                revision: thread.revision + 1,
                dateUpdated: new Date().toISOString()
            }
        });
    // create message
    const message = yield database_1.default.messages.create({
        data: {
            message: args.data.message,
            senderId: args.data.senderId,
            refId: args.data.threadId,
            files: {
                createMany: {
                    data: args.data.files
                }
            }
        }
    });
    // notify recipient
    const sender = yield database_1.default.userAccounts.findUnique({
        where: {
            accountId: args.data.senderId
        },
        select: {
            firstName: true,
            lastName: true,
            subscription: true
        }
    });
    if (!sender)
        throw new graphql_1.GraphQLError('User does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    const payload = JSON.stringify({
        title: `${sender.firstName} ${sender.lastName} — ${args.data.message}`,
        body: thread.subject,
        icon: 'https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png'
    });
    // if author send to notification to recipient
    if (thread.authorId === args.data.senderId) {
        // broadcast to all sections if default
        if (thread.recipient.sectionName === 'default') {
            const allSections = yield database_1.default.officeSections.findMany({
                where: {
                    officeId: thread.recipient.officeId
                },
                select: {
                    employees: {
                        select: {
                            accountId: true,
                            subscription: true
                        }
                    }
                }
            });
            allSections.forEach(section => {
                section.employees.forEach(employee => {
                    if (employee.subscription) {
                        web_push_1.default.sendNotification(JSON.parse(employee.subscription), payload).catch(err => console.error(err));
                    }
                });
            });
        }
        else {
            const section = yield database_1.default.officeSections.findUnique({
                where: {
                    sectionId: thread.recipient.sectionId
                },
                select: {
                    employees: {
                        select: {
                            accountId: true,
                            subscription: true
                        }
                    }
                }
            });
            if (section) {
                section.employees.forEach(employee => {
                    if (employee.subscription)
                        web_push_1.default.sendNotification(JSON.parse(employee.subscription), payload)
                            .catch(err => console.error(err));
                });
            }
        }
    }
    else {
        if (sender.subscription)
            web_push_1.default.sendNotification(JSON.parse(sender.subscription), payload)
                .catch(err => console.error(err));
    }
    return message;
});
exports.resolveCreateMessage = resolveCreateMessage;
const resolveGetThreadById = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    if (args.uid.length === 0)
        return null;
    return yield database_1.default.thread.findUnique({
        where: {
            refId: args.uid
        }
    });
});
exports.resolveGetThreadById = resolveGetThreadById;
const resolveUpdateThreadStatus = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const completedId = [1, 3];
    return yield database_1.default.thread.update({
        where: {
            refId: args.uid
        },
        data: {
            statusId: args.statusId,
            attachments: args.attachments,
            completed: completedId.includes(args.statusId)
        }
    });
});
exports.resolveUpdateThreadStatus = resolveUpdateThreadStatus;
// should change if we already have authentication
const resolveGetCreatedThread = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.thread.findMany({
        where: {
            authorId: args.userId
        },
        orderBy: {
            dateDue: 'desc'
        }
    });
});
exports.resolveGetCreatedThread = resolveGetCreatedThread;
const resolveGetInboxThread = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    // fetch user office
    const user = yield database_1.default.userAccounts.findUnique({
        where: {
            accountId: args.userId
        },
        select: {
            officeId: true,
            office: {
                select: {
                    officeId: true
                }
            }
        }
    });
    if (!user)
        throw new graphql_1.GraphQLError('User does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    // fetch office default
    const defaultOffice = yield database_1.default.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: user.office.officeId
            }
        },
        select: {
            sectionId: true
        }
    });
    if (!defaultOffice)
        throw new graphql_1.GraphQLError('Office does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    return yield database_1.default.thread.findMany({
        where: {
            OR: [
                {
                    recipientId: user.officeId
                },
                {
                    recipientId: defaultOffice.sectionId
                }
            ],
            completed: args.completed ? true : false
        },
        orderBy: {
            dateDue: 'desc'
        }
    });
});
exports.resolveGetInboxThread = resolveGetInboxThread;
const resolveGetNotifications = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    // fetch user office
    const user = yield database_1.default.userAccounts.findUnique({
        where: {
            accountId: args.userId
        },
        select: {
            accountId: true,
            officeId: true,
            office: {
                select: {
                    officeId: true
                }
            }
        }
    });
    if (!user)
        throw new graphql_1.GraphQLError('User does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    // fetch office default
    const defaultOffice = yield database_1.default.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: user.office.officeId
            }
        },
        select: {
            sectionId: true
        }
    });
    if (!defaultOffice)
        throw new graphql_1.GraphQLError('Office does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    return yield database_1.default.messages.findMany({
        where: {
            thread: {
                OR: [
                    {
                        recipientId: user.officeId
                    },
                    {
                        recipientId: defaultOffice.sectionId
                    },
                    {
                        authorId: user.accountId
                    }
                ]
            },
            NOT: {
                senderId: user.accountId
            },
            read: false
        },
        orderBy: {
            dateSent: 'desc'
        }
    });
});
exports.resolveGetNotifications = resolveGetNotifications;
const resolveGetAllInbox = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.thread.findMany({
        where: {
            completed: false
        },
        orderBy: {
            dateDue: 'desc'
        }
    });
});
exports.resolveGetAllInbox = resolveGetAllInbox;
const resolveSetMessageAsRead = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.messages.updateMany({
        where: {
            refId: args.threadId,
            senderId: args.userId
        },
        data: {
            read: true
        }
    });
    return null;
});
exports.resolveSetMessageAsRead = resolveSetMessageAsRead;
const resolveStatusAnalytics = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    // return all when superuser 
    if (args.superuser) {
        const analytics = yield database_1.default.thread.groupBy({
            by: ['docTypeId'],
            where: {
                completed: args.completed
            },
            _count: {
                refId: true
            }
        });
        return analytics.map(data => ({
            statusId: null,
            docTypeId: data.docTypeId,
            count: data._count.refId
        }));
    }
    // fetch section
    const section = yield database_1.default.officeSections.findUnique({
        where: {
            sectionId: args.officeId
        },
        select: {
            sectionId: true,
            officeId: true
        }
    });
    if (!section)
        throw new graphql_1.GraphQLError('Office does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    // fetch office default
    const defaultOffice = yield database_1.default.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: section.officeId
            }
        },
        select: {
            sectionId: true
        }
    });
    if (!defaultOffice)
        throw new graphql_1.GraphQLError('Office does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    const analytics = yield database_1.default.thread.groupBy({
        by: ['docTypeId'],
        where: {
            OR: [
                {
                    recipientId: section.sectionId
                },
                {
                    recipientId: defaultOffice.sectionId
                }
            ],
            completed: args.completed
        },
        _count: {
            refId: true
        }
    });
    return analytics.map(data => ({
        statusId: null,
        docTypeId: data.docTypeId,
        count: data._count.refId
    }));
});
exports.resolveStatusAnalytics = resolveStatusAnalytics;
const resolveThreadTypeAnalytics = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    if (args.superuser) {
        const analytics = yield database_1.default.thread.groupBy({
            by: ['statusId', 'docTypeId'],
            where: {
                dateCreated: {
                    gte: new Date(args.startDate).toISOString(),
                    lte: new Date(args.endDate).toISOString()
                }
            },
            _count: {
                refId: true
            }
        });
        return analytics.map(data => ({
            statusId: data.statusId,
            docTypeId: data.docTypeId,
            count: data._count.refId
        }));
    }
    // fetch section
    const section = yield database_1.default.officeSections.findUnique({
        where: {
            sectionId: args.officeId
        },
        select: {
            sectionId: true,
            officeId: true
        }
    });
    if (!section)
        throw new graphql_1.GraphQLError('Office does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    // fetch office default
    const defaultOffice = yield database_1.default.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: section.officeId
            }
        },
        select: {
            sectionId: true
        }
    });
    if (!defaultOffice)
        throw new graphql_1.GraphQLError('Office does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    const analytics = yield database_1.default.thread.groupBy({
        by: ['statusId', 'docTypeId'],
        where: {
            OR: [
                {
                    recipientId: section.sectionId
                },
                {
                    recipientId: defaultOffice.sectionId
                }
            ],
            dateCreated: {
                gte: new Date(args.startDate).toISOString(),
                lte: new Date(args.endDate).toISOString()
            }
        },
        _count: {
            refId: true
        }
    });
    return analytics.map(data => ({
        statusId: data.statusId,
        docTypeId: data.docTypeId,
        count: data._count.refId
    }));
});
exports.resolveThreadTypeAnalytics = resolveThreadTypeAnalytics;
//# sourceMappingURL=controller.js.map