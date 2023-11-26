import { 
    GraphQLList,
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLString 
} from "graphql";
import { RoleObject, UserAccountObject } from "../offices/model";
import { ReportFiles, Reports, Schedules } from "@prisma/client";
import dbClient from "../database";


export const ScheduleObject: GraphQLObjectType = new GraphQLObjectType<Schedules>({
    name: "Schedules",
    description: "Scheduled Events or Reports",
    fields: () => ({
        schedId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        subject: {
            type: new GraphQLNonNull(GraphQLString)
        },
        description: {
            type: new GraphQLNonNull(GraphQLString)
        },
        type: {
            type: new GraphQLNonNull(GraphQLString)
        },
        repeat: {
            type: new GraphQLNonNull(GraphQLString)
        },
        recipients: {
            type: new GraphQLList(RoleObject),
            resolve: async (parent) => {
                const ids = parent.recipientIds.split('.').map(id => parseInt(id))

                return await dbClient.roles.findMany({
                    where: {
                        roleId: {
                            in: ids
                        }
                    }
                })
            }
        },
        dateStart: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return parent.dateStart.toISOString()
            }
        },
        dateDue: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => {
                return parent.dateDue.toISOString()
            }
        },
        reports: {
            type: new GraphQLList(ReportObject),
            resolve: async (parent) => {
                return await dbClient.reports.findMany({
                    where: {
                        schedId: parent.schedId
                    }
                })
            }
        }
    })
})


export const ReportObject: GraphQLObjectType = new GraphQLObjectType<Reports>({
    name: "ReportObject",
    fields: () => ({
        reportId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => parent.reportId.toString()
        },
        message: {
            type: GraphQLString
        },
        reportDate: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => new Date(parent.reportDate).toISOString()
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
        schedule: {
            type: ScheduleObject,
            resolve: async (parent) => {
                return await dbClient.schedules.findUnique({
                    where: {
                        schedId: parent.schedId
                    }
                })
            }
        },
        files: {
            type: new GraphQLList(ReportFilesObject),
            resolve: async (parent) => {
                return await dbClient.reportFiles.findMany({
                    where: {
                        reportId: parent.reportId
                    }
                })
            }
        }
    })
})

export const ReportFilesObject: GraphQLObjectType = new GraphQLObjectType<ReportFiles>({
    name: "ReportFiles",
    fields: () => ({
        fileId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parent) => parent.fileId.toString()
        },
        fileUrl: {
            type: GraphQLString
        },
        fileName: {
            type: GraphQLString
        },
        fileType: {
            type: GraphQLString
        },
        report: {
            type: ReportObject,
            resolve: async (parent) => {
                return await dbClient.reports.findUnique({
                    where: {
                        reportId: parent.reportId
                    }
                })
            }
        }
    })
})