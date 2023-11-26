import { 
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from "graphql";
import { ReportObject, ScheduleObject } from "./model";
import { ReportCreateInput, ScheduleInput } from "./validation";
import { 
    resolveCreateSchedule, resolveDeleteSchedule, resolveGetAllSchedules, resolveGetReports, resolveSendReport, resolveUpdateSchedule 
} from "./controllers";



export const mutationFields = {
    // =================================== SCHEDULES ================================= //
    addSchedule: {
        type: ScheduleObject,
        args: {
            data: {
                type: new GraphQLNonNull(ScheduleInput)
            }
        },
        resolve: resolveCreateSchedule
    },
    updateSchedule: {
        type: ScheduleObject,
        args: {
            scheduleId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            data: {
                type: new GraphQLNonNull(ScheduleInput)
            }
        },
        resolve: resolveUpdateSchedule
    },
    deleteSchedule: {
        type: ScheduleObject,
        args: {
            scheduleId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveDeleteSchedule
    },
    sendReport: {
        type: ReportObject,
        args: {
            data: {
                type: new GraphQLNonNull(ReportCreateInput)
            }
        },
        resolve: resolveSendReport
    }
}


export const queryFields = {
    getAllSchedules: {
        type: new GraphQLList(ScheduleObject),
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetAllSchedules
    },
    getAllReports: {
        type: new GraphQLList(ReportObject),
        args: {
            schedId: {
                type: new GraphQLNonNull(GraphQLString)
            },
            reportDate: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetReports
    }
}