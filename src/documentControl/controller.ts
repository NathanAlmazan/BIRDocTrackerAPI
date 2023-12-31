import { GraphQLError } from "graphql"
import dbClient from "../database"
import { 
    MessageCreateInput, 
    ThreadCreateInput, 
    ThreadUpdateInput 
} from "./validation"
import webpush from 'web-push';
import pubsub from "../pubsub";


// =============================================== Thread Status Controller ================================================ //

export const resolveAddThreadStatus = async (_: any, args: { label: string }) => {
    return await dbClient.documentStatus.create({
        data: {
            statusLabel: args.label
        }
    })
}

export const resolveGetAllThreadStatus = async () => {
    return await dbClient.documentStatus.findMany()
}

export const resolveDeleteThreadStatus = async (_: any, args: { id: number }) => {
    return await dbClient.documentStatus.delete({
        where: {
            statusId: args.id
        }
    })
}


// =============================================== Thread Types Controller ================================================ //

export const resolveAddThreadType = async (_: any, args: { label: string }) => {
    return await dbClient.documentTypes.create({
        data: {
            docType: args.label
        }
    })
}

export const resolveGetAllThreadTypes = async () => {
    return await dbClient.documentTypes.findMany()
}

export const resolveDeleteThreadType = async (_: any, args: { id: number }) => {
    return await dbClient.documentTypes.delete({
        where: {
            docId: args.id
        }
    })
}

// ============================================= Thread Purpose Controller ================================================ //

export const resolveAddThreadPurpose = async (_: any, args: { name: string }) => {
    return await dbClient.documentPurpose.create({
        data: {
            purposeName: args.name
        }
    })
}

export const resolveGetAllThreadPurpose = async () => {
    return await dbClient.documentPurpose.findMany({
        orderBy: {
            purposeName: 'asc'
        }
    })
}

// =============================================== Thread Tags Controller ================================================= //

export const resolveGetAllTags = async () => {
    return await dbClient.threadTags.findMany({
        orderBy: {
            tagId: 'asc'
        }
    })
}

// =========================================== Thread and Messages Controller ============================================= //

export const resolveGenerateTempRefNum = async (_: any, args: { authorId: string }) => {
    // get the author details for reference number
    const author = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.authorId
        },
        select: {
            section: {
                select: {
                    refNum: true,
                    office: {
                        select: {
                            officeId: true,
                            refNum: true
                        }
                    }
                }
            }
        }
    })

    if (!author) throw new GraphQLError('Author does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const officeRef = author.section.office.refNum;
    const sectionRef = author.section.refNum ? author.section.refNum : '';


    // get the total document this month to generate the reference number
    const current = new Date();
    const threadCount = await dbClient.thread.groupBy({
        by: ['refSlipNum'],
        where: {
            dateCreated: {
                gte: new Date(current.getFullYear(), current.getMonth(), 1)
            }
        }
    });

    return `${officeRef}-${sectionRef}${current.toISOString().split('-').slice(0, 2).join('-')}-${String((threadCount.length + 1)).padStart(5, '0')}`;
}

export const resolveCreateThread = async (_: any, args: ThreadCreateInput) => {
    // get the author details for reference number
    const author = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.data.authorId
        },
        select: {
            section: {
                select: {
                    refNum: true,
                    office: {
                        select: {
                            officeId: true,
                            refNum: true
                        }
                    }
                }
            }
        }
    })

    if (!author) throw new GraphQLError('Author does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const officeRef = author.section.office.refNum;
    const sectionRef = author.section.refNum ? author.section.refNum : '';


    // get the total document this month to generate the reference number
    const current = new Date();
    const threadCount = await dbClient.thread.groupBy({
        by: ['refSlipNum'],
        where: {
            dateCreated: {
                gte: new Date(current.getFullYear(), current.getMonth(), 1)
            }
        }
    });

    const refNum = `${officeRef}-${sectionRef}${current.toISOString().split('-').slice(0, 2).join('-')}-${String((threadCount.length + 1)).padStart(5, '0')}`; 

    // get the document purpose details to initialize status
    const purpose = await dbClient.documentPurpose.findUnique({
        where: {
            purposeId: args.data.purposeId
        }
    })

    const type = await dbClient.documentTypes.findUnique({
        where: {
            docId: args.data.docTypeId
        }
    })

    if (!purpose) throw new GraphQLError('Document purpose does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    if (!type) throw new GraphQLError('Document type does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })
    
    // get document officers
    let officers: { accountId: string, officeId: number }[] = []
    if (args.data.recipientUserId.length > 0) {
        officers = await dbClient.userAccounts.findMany({
            where: {
                accountId: {
                    in: args.data.recipientUserId
                }
            },
            select: {
                accountId: true,
                officeId: true
            }
        })
    }

    // get the recipient office section when set to broadcast
    const threads = []
    for (let i = 0; i < args.data.recipientId.length; i++) {
        // get actionable status
        const actionable = args.data.actionable || type.actionable

        // identify recipient
        let recipientId = args.data.recipientId[i];
        let broadcast = false;
        if (recipientId < 0) {
            const section = await dbClient.officeSections.findFirst({
                where: {
                    officeId: Math.abs(recipientId),
                    sectionName: 'default'
                }
            })

            if (!section) throw new GraphQLError('Thread recipient does not exist', {
                extensions: {
                    code: 'BAD_REQUEST'
                }
            })

            recipientId = section.sectionId;
            broadcast = true;
        }

        // get initial status based on purpose
        let status = 2;
        if (purpose.initStatusId) status = purpose.initStatusId;
        else if (!actionable) status = 3;

        const thread = await dbClient.thread.create({
            data: {
                subject: args.data.subject,
                authorId: args.data.authorId,
                docTypeId: args.data.docTypeId,
                purposeId: args.data.purposeId,
                attachments: args.data.attachments,
                purposeNotes: args.data.purposeNotes,
                tagId: args.data.tagId,
                dateDue: args.data.dateDue,
                refSlipNum: refNum,
                statusId: status,
                completed: !actionable,
                actionable: actionable,
                recipientId: recipientId,
                recipientUserId: officers.find(officer => officer.officeId === recipientId)?.accountId,
                broadcast: broadcast,
                history: {
                    create: {
                        historyLabel: 'Request Created',
                        statusId: status
                    }
                }
            },
            include: {
                recipient: {
                    select: {
                        officeId: true
                    }
                }
            }
        })

        // trigger subscription event
        pubsub.publish(`${thread.recipient.officeId}_OFFICE_INBOX`, { officeInbox: {
            referenceNum: refNum,
            eventType: "THREAD_CREATED",
            timestamp: new Date().toISOString()
        }})

        threads.push(thread); // collect created threads
    }

    return threads;
}

export const resolveUpdateThread = async (_: any, args: ThreadUpdateInput) => {
    await dbClient.thread.updateMany({
        where: {
            refSlipNum: args.data.refNum
        },
        data: {
            subject: args.data.subject,
            dateDue: args.data.dateDue,
            tagId: args.data.tagId,
            purposeNotes: args.data.purposeNotes,
            docTypeId: args.data.docTypeId,
            purposeId: args.data.purposeId
        }
    });

    const threads = await dbClient.thread.findMany({
        where: {
            refSlipNum: args.data.refNum
        },
        select: {
            refId: true,
            authorId: true,
            recipient: {
                select: {
                    officeId: true
                }
            }
        }
    })

    // trigger subscription event
    threads.forEach(thread => {
        pubsub.publish(`${thread.recipient.officeId}_OFFICE_INBOX`, { officeInbox: {
            referenceNum: args.data.refNum,
            eventType: "THREAD_UPDATED",
            timestamp: new Date().toISOString()
        }})

        pubsub.publish(`THREAD_${thread.refId}`, { liveThread: {
            referenceNum: thread.refId,
            eventType: "MESSAGE_SENT",
            timestamp: new Date().toISOString()
        }})
    })

    pubsub.publish(`${threads[0].authorId}_AUTHOR_INBOX`, { authorInbox: {
        referenceNum: threads[0].authorId,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }});

    return dbClient.thread.findMany({
        where: {
            refSlipNum: args.data.refNum
        }
    });
}

export const resolveArchiveThread = async (_: any, args: { threadId: string }) => {
    const thread = await dbClient.thread.update({
        where: {
            refId: args.threadId
        },
        data: {
            active: false
        },
        include: {
            recipient: {
                select: {
                    officeId: true
                }
            }
        }
    })

    // trigger subscription events
    pubsub.publish(`${thread.recipient.officeId}_OFFICE_INBOX`, { officeInbox: {
        referenceNum: thread.refSlipNum,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }})

    pubsub.publish(`THREAD_${thread.refId}`, { liveThread: {
        referenceNum: thread.refId,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }})

    pubsub.publish(`${thread.authorId}_AUTHOR_INBOX`, { authorInbox: {
        referenceNum: thread.authorId,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }});

    return thread;
}

export const resolveRestoreThread = async (_: any, args: { threadId: string }) => {
    const thread = await dbClient.thread.update({
        where: {
            refId: args.threadId
        },
        data: {
            active: true
        },
        include: {
            recipient: {
                select: {
                    officeId: true
                }
            }
        }
    })

    // trigger subscription events
    pubsub.publish(`${thread.recipient.officeId}_OFFICE_INBOX`, { officeInbox: {
        referenceNum: thread.refSlipNum,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }})

    pubsub.publish(`THREAD_${thread.refId}`, { liveThread: {
        referenceNum: thread.refId,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }})

    pubsub.publish(`${thread.authorId}_AUTHOR_INBOX`, { authorInbox: {
        referenceNum: thread.authorId,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }});

    return thread;
}

export const resolveCreateMessage = async (_: any, args: MessageCreateInput) => {
    // check if revision
    const thread = await dbClient.thread.findUnique({
        where: {
            refId: args.data.threadId
        },
        select: {
            refId: true,
            revision: true,
            authorId: true,
            subject: true,
            broadcast: true,
            recipient: {
                select: {
                    sectionId: true,
                    sectionName: true,
                    officeId: true
                }
            }
        }
    })

    if (!thread) throw new GraphQLError('Thread does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    if (thread.authorId !== args.data.senderId) await dbClient.thread.update({
        where: {
            refId: args.data.threadId
        },
        data: {
            revision: thread.revision + 1,
            dateUpdated: new Date().toISOString()
        }
    })

     // create message
     const message = await dbClient.messages.create({
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
    })

    // notify subscriptions
    pubsub.publish(`THREAD_${thread.refId}`, { liveThread: {
        referenceNum: thread.refId,
        eventType: "MESSAGE_SENT",
        timestamp: new Date().toISOString()
    }})

    // notify recipient
    const sender = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.data.senderId
        },
        select: {
            firstName: true,
            lastName: true,
            subscription: true
        }
    })

    if (!sender) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const payload = JSON.stringify({
        title: `${sender.firstName} ${sender.lastName} — ${args.data.message}`,
        body: thread.subject, 
        icon: 'https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png'
    });

    // if author send to notification to recipient
    if (thread.authorId === args.data.senderId) {
        // broadcast to all sections if set to broadcast
        if (thread.broadcast) {
            const allSections = await dbClient.officeSections.findMany({
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
            })

            allSections.forEach(section => {
                section.employees.forEach(employee => {
                    if (employee.subscription) {
                        webpush.sendNotification(JSON.parse(employee.subscription), payload).catch(err => console.error(err))
                    }
                })
            })
        } else {
            const section = await dbClient.officeSections.findUnique({
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
            })

            if (section) {
                section.employees.forEach(employee => {
                    if (employee.subscription) webpush.sendNotification(JSON.parse(employee.subscription), payload)
                        .catch(err => console.error(err));
                })
            }
        }
    } else {
        if (sender.subscription) webpush.sendNotification(JSON.parse(sender.subscription), payload)
            .catch(err => console.error(err));
    }

    
    return message;
}

export const resolveGetThreadById = async (_: any, args: { uid: string }) => {
    if (args.uid.length === 0) return null;
    return await dbClient.thread.findUnique({
        where: {
            refId: args.uid
        }
    })
}

export const resolveUpdateThreadStatus = async (_: any, args: { uid: string, statusId: number, attachments: boolean }) => {
    const completedId = [1, 3];

    const thread = await dbClient.thread.update({
        where: {
            refId: args.uid
        },
        data: {
            statusId: args.statusId,
            attachments: args.attachments,
            completed: completedId.includes(args.statusId),
            history: {
                create: {
                    historyLabel: 'Request Updated',
                    statusId: args.statusId
                }
            }
        },
        include: {
            recipient: {
                select: {
                    officeId: true
                }
            }
        }
    })

    pubsub.publish(`${thread.recipient.officeId}_OFFICE_INBOX`, { officeInbox: {
        referenceNum: thread.refSlipNum,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }})

    pubsub.publish(`THREAD_${thread.refId}`, { liveThread: {
        referenceNum: thread.refId,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }})

    pubsub.publish(`${thread.authorId}_AUTHOR_INBOX`, { authorInbox: {
        referenceNum: thread.authorId,
        eventType: "THREAD_UPDATED",
        timestamp: new Date().toISOString()
    }});

    return thread;
}


export type InboxType = "pending" | "memos" | "finished" | "search" | "archived";

export const resolveGetCreatedThread = async (_: any, args: { userId: string, type: InboxType }) => {
    const inboxes = await dbClient.thread.findMany({
        where: {
            authorId: args.userId,
            active: args.type === "archived" ? false : true
        },
        orderBy: {
            refSlipNum: 'asc'
        }
    })

    switch (args.type) {
        case 'pending':
            return inboxes.filter(thread => !thread.completed && thread.actionable);   
        case 'memos':
            return inboxes.filter(thread => !thread.actionable);
        case "finished":
            return inboxes.filter(thread => thread.completed && thread.actionable);
        default:
            return inboxes;
    }
}

export const resolveGetInboxThread = async (_: any, args: { userId: string, type: InboxType | null }) => {
    // fetch user office
    const user = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.userId
        },
        select: {
            accountId: true,
            officeId: true,
            section: {
                select: {
                    officeId: true
                }
            }
        }
    })

    if (!user) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch office default
    const defaultOffice = await dbClient.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: user.section.officeId
            }
        },
        select: {
            sectionId: true
        }
    })

    if (!defaultOffice) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch all inboxes
    const inboxes = await dbClient.thread.findMany({
        where: {
            OR: [
                {
                    recipientId: user.officeId,
                    recipientUserId: null
                },
                {
                    recipientId: defaultOffice.sectionId,
                    broadcast: true
                },
                {
                    recipientId: user.officeId,
                    recipientUserId: user.accountId
                }
            ],
            active: true
        },
        orderBy: {
            dateDue: 'desc'
        }
    })

    switch (args.type) {
        case 'pending':
            return inboxes.filter(thread => !thread.completed && thread.actionable);    
        case 'memos':
            return inboxes.filter(thread => !thread.actionable);
        case "finished":
            return inboxes.filter(thread => thread.completed && thread.actionable);
        default:
            return inboxes;
    }
}

export const resolveSearchThread = async (_: any, args: { userId: string, query: string }) => {
    // fetch user office
    const user = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.userId
        },
        select: {
            accountId: true,
            officeId: true,
            section: {
                select: {
                    officeId: true
                }
            }
        }
    })

    if (!user) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch office default
    const defaultOffice = await dbClient.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: user.section.officeId
            }
        },
        select: {
            sectionId: true
        }
    })

    if (!defaultOffice) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    return await dbClient.thread.findMany({
        where: {
            AND: [
                {
                    OR: [
                        {
                            recipientId: user.officeId,
                            recipientUserId: null
                        },
                        {
                            recipientId: defaultOffice.sectionId,
                            broadcast: true
                        },
                        {
                            recipientId: user.officeId,
                            recipientUserId: user.accountId
                        },
                        {
                            authorId: args.userId
                        }
                    ]
                },
                {
                    OR: [
                        {
                            subject: {
                                contains: args.query,
                                mode: 'insensitive'
                            }
                        },
                        {
                            refSlipNum: {
                                contains: args.query,
                                mode: 'insensitive'
                            }
                        },
                        {
                            author: {
                                firstName: {
                                    contains: args.query,
                                    mode: 'insensitive'
                                }
                            }
                        },
                        {
                            author: {
                                lastName: {
                                    contains: args.query,
                                    mode: 'insensitive'
                                }
                            }
                        },
                        {
                            messages: {
                                some: {
                                    message: {
                                        contains: args.query,
                                        mode: 'insensitive'
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    })
}

type NotificationType = "unread" | "approval" | "overdue";

export const resolveGetNotifications = async (_: any, args: { userId: string, type: NotificationType }) => {
    // fetch user office
    const user = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.userId
        },
        select: {
            accountId: true,
            officeId: true,
            section: {
                select: {
                    officeId: true
                }
            }
        }
    })

    if (!user) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch office default
    const defaultOffice = await dbClient.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: user.section.officeId
            }
        },
        select: {
            sectionId: true
        }
    })

    if (!defaultOffice) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    switch(args.type) {
        case "unread":
            return await dbClient.thread.findMany({
                where: {
                    OR: [
                        {
                            recipientId: user.officeId,
                            recipientUserId: null
                        },
                        {
                            recipientId: defaultOffice.sectionId,
                            broadcast: true
                        },
                        {
                            recipientId: user.officeId,
                            recipientUserId: user.accountId
                        },
                        {
                            authorId: user.accountId
                        }
                    ],
                    active: true,
                    messages: {
                        some: {
                            read: false,
                            NOT: {
                                senderId: args.userId
                            }
                        }
                    }
                }
            })
        case "overdue":
            return await dbClient.thread.findMany({
                where: {
                    OR: [
                        {
                            recipientId: user.officeId,
                            recipientUserId: null
                        },
                        {
                            recipientId: defaultOffice.sectionId,
                            broadcast: true
                        },
                        {
                            recipientId: user.officeId,
                            recipientUserId: user.accountId
                        }
                    ],
                    dateDue: {
                        lt: new Date().toISOString()
                    },
                    completed: false,
                    active: true
                }
            })
        default:
            return await dbClient.thread.findMany({
                where: {
                    OR: [
                        {
                            recipientId: user.officeId,
                            recipientUserId: null
                        },
                        {
                            recipientId: defaultOffice.sectionId,
                            broadcast: true
                        },
                        {
                            recipientId: user.officeId,
                            recipientUserId: user.accountId
                        }
                    ],
                    purpose: {
                        purposeName: {
                            contains: "Approval"
                        }
                    },
                    completed: false,
                    active: true
                }
            })
    }
}

export const resolveGetAllInbox = async (_: any, args: { memos?: boolean }) => {
    if (!args.memos) return await dbClient.thread.findMany({
        where: {
            actionable: true
        },
        orderBy: {
            dateCreated: 'asc'
        }
    });
    else return await dbClient.thread.findMany({
        where: {
            actionable: false
        },
        orderBy: {
            dateCreated: 'asc'
        }
    })
}

export const resolveSetMessageAsRead = async (_: any, args: { threadId: string, userId: string }) => {
    await dbClient.messages.updateMany({
        where: {
            refId: args.threadId,
            senderId: args.userId
        },
        data: {
            read: true
        }
    })

    return null;
}

export const resolveStatusAnalytics = async (_: any, args: { officeId: number, completed: boolean, superuser: boolean | null }) => {
    
    // return all when superuser 
    if (args.superuser) {
        const analytics = await dbClient.thread.groupBy({
            by: ['docTypeId'],
            where: {
                completed: args.completed
            },
            _count: {
                refId: true
            }
        })

        return analytics.map(data => ({
            statusId: null,
            docTypeId: data.docTypeId,
            count: data._count.refId
        }))
    }

    // fetch section
    const section = await dbClient.officeSections.findUnique({
        where: {
            sectionId: args.officeId
        },
        select: {
            sectionId: true,
            officeId: true
        }
    })

    if (!section) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch office default
    const defaultOffice = await dbClient.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: section.officeId
            }
        },
        select: {
            sectionId: true
        }
    })

    if (!defaultOffice) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const analytics = await dbClient.thread.groupBy({
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
            completed: args.completed,
            active: true
        },
        _count: {
            refId: true
        }
    })

    return analytics.map(data => ({
        statusId: null,
        docTypeId: data.docTypeId,
        count: data._count.refId
    }))
}

export const resolveThreadTypeAnalytics = async (_: any, args: { officeId: number, startDate: string, endDate: string, superuser: boolean | null }) => {
    
    if (args.superuser) {
        const analytics = await dbClient.thread.groupBy({
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
        })

        return analytics.map(data => ({
            statusId: data.statusId,
            docTypeId: data.docTypeId,
            count: data._count.refId
        }))
    }

    // fetch section
    const section = await dbClient.officeSections.findUnique({
        where: {
            sectionId: args.officeId
        },
        select: {
            sectionId: true,
            officeId: true
        }
    })

    if (!section) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch office default
    const defaultOffice = await dbClient.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: section.officeId
            }
        },
        select: {
            sectionId: true
        }
    })

    if (!defaultOffice) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const analytics = await dbClient.thread.groupBy({
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
            },
            active: true
        },
        _count: {
            refId: true
        }
    })

    return analytics.map(data => ({
        statusId: data.statusId,
        docTypeId: data.docTypeId,
        count: data._count.refId
    }))
}

export const resolveThreadPurposeAnalytics = async (_: any, args: { officeId: number, startDate: string, endDate: string, superuser: boolean | null }) => {
    
    if (args.superuser) {
        const analytics = await dbClient.thread.groupBy({
            by: ['statusId', 'purposeId'],
            where: {
                dateCreated: {
                    gte: new Date(args.startDate).toISOString(),
                    lte: new Date(args.endDate).toISOString()
                }
            },
            _count: {
                refId: true
            }
        })

        return analytics.map(data => ({
            statusId: data.statusId,
            purposeId: data.purposeId,
            count: data._count.refId
        }))
    }

    // fetch section
    const section = await dbClient.officeSections.findUnique({
        where: {
            sectionId: args.officeId
        },
        select: {
            sectionId: true,
            officeId: true
        }
    })

    if (!section) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch office default
    const defaultOffice = await dbClient.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: section.officeId
            }
        },
        select: {
            sectionId: true
        }
    })

    if (!defaultOffice) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const analytics = await dbClient.thread.groupBy({
        by: ['statusId', 'purposeId'],
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
            },
            active: true
        },
        _count: {
            refId: true
        }
    })

    return analytics.map(data => ({
        statusId: data.statusId,
        purposeId: data.purposeId,
        count: data._count.refId
    }))
}

export const resolveGetThreadSummary = async (_: any, args: { userId: string, dateCreated: Date }) => {
    // fetch user office
    const user = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.userId
        },
        select: {
            officeId: true,
            section: {
                select: {
                    officeId: true
                }
            },
            role: {
                select: {
                    superuser: true
                }
            }
        }
    })

    if (!user) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // setup date range
    const startDate = new Date(args.dateCreated);
    const endDate = new Date(args.dateCreated);
    endDate.setMonth(endDate.getMonth() + 1);

    // if admin return all
    if (user.role.superuser) {
        const threads = await dbClient.thread.groupBy({
            by: ['refSlipNum'],
            where: {
                dateCreated: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString()
                },
                active: true
            },
            _min: {
                dateCreated: true
            }
        })

        return await dbClient.thread.findMany({
            where: {
                refSlipNum: {
                    in: threads.map(thread => thread.refSlipNum)
                },
                dateCreated: {
                    in: threads.filter(thread => thread._min.dateCreated !== null).map(thread => thread._min.dateCreated as Date)
                }
            },
            orderBy: {
                dateCreated: 'asc'
            }
        })
    }

    // fetch office default
    const defaultOffice = await dbClient.officeSections.findFirst({
        where: {
            AND: {
                sectionName: "default",
                officeId: user.section.officeId
            }
        },
        select: {
            sectionId: true
        }
    })

    if (!defaultOffice) throw new GraphQLError('Office does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    // fetch all inboxes
    const threads = await dbClient.thread.groupBy({
        by: ['refSlipNum'],
        where: {
            OR: [
                {
                    recipientId: user.officeId
                },
                {
                    recipientId: defaultOffice.sectionId,
                    broadcast: true
                }
            ],
            dateCreated: {
                gte: startDate.toISOString(),
                lte: endDate.toISOString()
            },
            active: true
        },
        _min: {
            dateCreated: true
        }
    })

    return await dbClient.thread.findMany({
        where: {
            refSlipNum: {
                in: threads.map(thread => thread.refSlipNum)
            },
            dateCreated: {
                in: threads.filter(thread => thread._min.dateCreated !== null).map(thread => thread._min.dateCreated as Date)
            }
        },
        orderBy: {
            dateCreated: 'asc'
        }
    })
}

// ============================ SUBSCRIPTIONS ============================== //
export const resolveSubscribeOfficeInbox = (_: any, args: { officeId: number }) => {
    return pubsub.asyncIterator([`${args.officeId}_OFFICE_INBOX`]);
}

export const resolveSubscribeThreadMsg = (_: any, args: { threadId: string }) => {
    return pubsub.asyncIterator([`THREAD_${args.threadId}`]);
}

export const resolveSubscribeAuthorInbox = (_: any, args: { authorId: string }) => {
    return pubsub.asyncIterator([`${args.authorId}_AUTHOR_INBOX`]);
}