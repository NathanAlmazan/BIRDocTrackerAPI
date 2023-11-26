import { ReportFiles } from "@prisma/client";
import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { MessageFileInput } from "../documentControl/validation";


export interface ScheduleInput {
    subject: string;
    description: string;
    type: string;
    repeat: string;
    recipientIds: number[],
    dateStart: string;
    dateDue: string;
}

export const ScheduleInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "CreateScheduleInput",
    fields: () => ({
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
        recipientIds: {
            type: new GraphQLList(GraphQLInt)
        },
        dateStart: {
            type: new GraphQLNonNull(GraphQLString)
        },
        dateDue: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export interface ReportCreateInput {
    data: {
        message: string;
        schedId: string;
        authorId: string;
        reportDate: string;
        files: Pick<ReportFiles, "fileName" | "fileUrl" | "fileType">[]
    }
}

export const ReportCreateInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "ReportInput",
    fields: () => ({
        message: {
            type: new GraphQLNonNull(GraphQLString)
        },
        schedId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        authorId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        reportDate: {
            type: new GraphQLNonNull(GraphQLString)
        },
        files: {
            type: new GraphQLList(MessageFileInput)
        }
    })
})
