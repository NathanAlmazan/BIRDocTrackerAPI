import { GraphQLError } from "graphql"
import dbClient from "../database"
import { MessageCreateInput, ThreadCreateInput } from "./validation"



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


// =========================================== Thread and Messages Controller ============================================= //

export const resolveCreateThread = async (_: any, args: ThreadCreateInput) => {
    return await dbClient.thread.create({
        data: args.data
    })
}

export const resolveCreateMessage = async (_: any, args: MessageCreateInput) => {
    // check if revision
    const thread = await dbClient.thread.findUnique({
        where: {
            refId: args.data.threadId
        },
        select: {
            revision: true,
            authorId: true
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
            revision: thread.revision + 1
        }
    })

    // create and return message
    return await dbClient.messages.create({
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
    return await dbClient.thread.update({
        where: {
            refId: args.uid
        },
        data: {
            statusId: args.statusId,
            attachments: args.attachments,
            completed: completedId.includes(args.statusId)
        }
    })
}

// should change if we already have authentication
export const resolveGetCreatedThread = async (_: any, args: { userId: string }) => {
    return await dbClient.thread.findMany({
        where: {
            authorId: args.userId
        },
        orderBy: {
            dateDue: 'asc'
        }  
    })
}

export const resolveGetInboxThread = async (_: any, args: { userId: string, completed?: boolean }) => {
    // fetch user office
    const user = await dbClient.userAccounts.findUnique({
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
                officeId: user.office.officeId
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
            dateDue: 'asc'
        }
    })
}