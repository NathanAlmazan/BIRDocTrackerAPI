import { UserAccounts } from "@prisma/client";
import { 
    GraphQLInputObjectType, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLString 
} from "graphql";


export interface BirOfficeInput {
    data: {
        officeName: string;
        officeSections?: string[];
    }
}

export const BirOfficeInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "OfficeInput",
    fields: () => ({
        officeName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        officeSections: {
            type: new GraphQLList(GraphQLString)
        }
    })
})


export const BirOfficeSectionInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "OfficeSectionInput",
    fields: () => ({
        sectionName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        officeId: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
})


export interface AccountRegisterInput {
    data: Omit<UserAccounts, "accountId" | "password">
}

export const AccountRegisterInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "AccountRegisterInput",
    fields: () => ({
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        position: {
            type: new GraphQLNonNull(GraphQLString)
        },
        officeId: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
})

export interface AccountUpdateInput {
    data: Pick<UserAccounts, "accountId" | "firstName" | "lastName" | "position">
}

export const AccountUpdateInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "AccountUpdateInput",
    fields: () => ({
        accountId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        position: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})


export const AccountLoginInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        officeId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})


export const AccountChangePasswordInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        accountId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        resetCode: {
            type: GraphQLString
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        },
    })
})


export const AccountRequestResetCodeInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        accountId: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})


export const AccountUpdateProfileInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        accountId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        position: {
            type: new GraphQLNonNull(GraphQLString)
        },
        officeId: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
})
