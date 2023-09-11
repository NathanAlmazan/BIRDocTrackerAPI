import jwt from "jsonwebtoken";
import dbClient from "../database";
import { 
    GraphQLInt, 
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
} from "graphql";
import { 
    BirOffices, 
    OfficeSections, 
    Roles, 
    UserAccounts 
} from "@prisma/client";



export const BirOfficeObject: GraphQLObjectType = new GraphQLObjectType<BirOffices>({
    name: "BirOffice",
    description: "BIR Offices",
    fields: () => ({
        officeId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        officeName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        refNum: {
            type: GraphQLString
        },
        officeSections: {
            type: new GraphQLList(OfficeSectionObject),
            resolve: async (parent: BirOffices) => {
                return await dbClient.officeSections.findMany({
                    where: {
                        officeId: parent.officeId
                    },
                    orderBy: {
                        sectionId: 'asc'
                    }
                })
            }
        }
    })
})


export const OfficeSectionObject: GraphQLObjectType = new GraphQLObjectType<OfficeSections>({
    name: "OfficeSection",
    description: "BIR Offices Sections",
    fields: () => ({
        sectionId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        sectionName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        refNum: {
            type: GraphQLString
        },
        admin: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        sectionOffice: {
            type: BirOfficeObject,
            resolve: async (parent) => {
                return await dbClient.birOffices.findUnique({
                    where: {
                        officeId: parent.officeId
                    }
                })
            }
        },
        officers: {
            type: new GraphQLList(UserAccountObject),
            resolve: async (parent) => {
                return await dbClient.userAccounts.findMany({
                    where: {
                        officeId: parent.sectionId,
                        active: true
                    }
                })
            }
        }
    })
})

export const RoleObject: GraphQLObjectType = new GraphQLObjectType<Roles>({
    name: "UserRoles",
    description: "BIR User Roles",
    fields: () => ({
        roleId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        roleName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        superuser: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    })
})

export const UserAccountObject: GraphQLObjectType = new GraphQLObjectType<UserAccounts>({
    name: "UserAccount",
    description: "BIR Employees accounts",
    fields: () => ({
        accountId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        signImage: {
            type: GraphQLString
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        role: {
            type: new GraphQLNonNull(RoleObject),
            resolve: async (parent) => {
                return await dbClient.roles.findUnique({
                    where: {
                        roleId: parent.roleId
                    }
                })
            }
        },
        resetCode: {
            type: GraphQLString
        },
        registered: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: async (parent) => {
                const account = await dbClient.userAccounts.findUnique({
                    where: {
                        accountId: parent.accountId
                    },
                    select: {
                        password: true
                    }
                })

                return (account && account.password.length > 0)
            }
        },
        officeSection: {
            type: OfficeSectionObject,
            resolve: async (parent) => {
                return await dbClient.officeSections.findUnique({
                    where: {
                        sectionId: parent.officeId
                    }
                })
            }
        }
    })
})


export const JWTAuthenticationObject: GraphQLObjectType = new GraphQLObjectType<UserAccounts>({
    name: "JSONWebTokens",
    description: "JSON Web Token Object",
    fields: {
        accessToken: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: async (parent) => {
                return jwt.sign({
                    accountId: parent.accountId
                }, process.env.SECRET_KEY as string, {
                    expiresIn: '1h'
                })
            }
        },
        refreshToken: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: async (parent) => {
                return jwt.sign({
                    accountId: parent.accountId
                }, process.env.SECRET_KEY as string, {
                    expiresIn: '6h'
                })
            }
        }
    }
})
