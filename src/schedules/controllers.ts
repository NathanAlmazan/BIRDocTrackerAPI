import { GraphQLError } from "graphql";
import dbClient from "../database";
import { ReportCreateInput, ScheduleInput } from "./validation";


// ====================================== SCHEDULES ========================================= //

export const resolveCreateSchedule = async (_: any, args: { data: ScheduleInput }) => {
    return await dbClient.schedules.create({
        data: {
            subject: args.data.subject,
            description: args.data.description,
            recipientIds: args.data.recipientIds.map(id => id.toString()).join('.'),
            dateStart: new Date(args.data.dateStart),
            dateDue: new Date(args.data.dateDue),
            repeat: args.data.repeat,
            type: args.data.type
        }
    })
}

export const resolveUpdateSchedule = async (_: any, args: { scheduleId: string, data: ScheduleInput }) => {
    return await dbClient.schedules.update({
        where: {
            schedId: args.scheduleId
        },
        data: {
            subject: args.data.subject,
            description: args.data.description,
            recipientIds: args.data.recipientIds.map(id => id.toString()).join('.'),
            dateStart: new Date(args.data.dateStart),
            dateDue: new Date(args.data.dateDue),
            repeat: args.data.repeat,
            type: args.data.type
        }
    })
}

export const resolveDeleteSchedule = async (_: any, args: { scheduleId: string }) => {
    return await dbClient.schedules.delete({
        where: {
            schedId: args.scheduleId
        }
    })
}

export const resolveGetAllSchedules = async (_: any, args: { userId: string }) => {
    const user = await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.userId
        },
        include: {
            role: true
        }
    })

    if (!user) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    if (user.role.superuser) return await dbClient.schedules.findMany({
        orderBy: {
            dateStart: 'asc'
        }
    })

    return await dbClient.schedules.findMany({
        where: {
            recipientIds: {
                contains: `${user.roleId}.`
            }
        },
        orderBy: {
            dateStart: 'asc'
        }
    })
}

// ==================================== REPORTS ================================== //

export const resolveSendReport = async (_: any, args: ReportCreateInput) => {
    return await dbClient.reports.create({
        data: {
            schedId: args.data.schedId,
            authorId: args.data.authorId,
            reportDate: args.data.reportDate,
            message: args.data.message,
            files: {
                createMany: {
                    data: args.data.files
                }
            }
        }
    })
}

export const resolveGetReports = async (_: any, args: { schedId: string, reportDate: string }) => {
    // set start date first date of report month
    const startDate = new Date(args.reportDate);
    startDate.setDate(1);

    // set end date first day of next month
    const endDate = new Date(args.reportDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(1);

    return await dbClient.reports.findMany({
        where: {
            schedId: args.schedId,
            reportDate: {
                gte: startDate,
                lt: endDate
            }
        }
    })
}