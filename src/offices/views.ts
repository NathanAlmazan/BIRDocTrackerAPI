import { 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLString
} from "graphql";
import { 
    resolveAddOffice, 
    resolveAddRole, 
    resolveChangePassword, 
    resolveDeleteOffice, 
    resolveGetAccountByUid, 
    resolveGetAllOfficeSections, 
    resolveGetAllOffices, 
    resolveGetAllRoles, 
    resolveGetOfficeById,
    resolveRegisterAccount,
    resolveSetAccountInactive,
    resolveUpdateAccount,
    resolveUserLogin
} from "./controller";
import { 
    BirOfficeObject, 
    OfficeSectionObject, 
    RoleObject, 
    UserAccountObject 
} from "./model";
import { 
    AccountRegisterInput, 
    AccountUpdateInput, 
    BirOfficeInput, 
    UserChangePasswordInput,
    UserLoginInputInput
} from "./validation";


export const mutationFields = {
    // ================================ BIR Offices Mutations ======================================== //
    addBirOffice: {
        type: BirOfficeObject,
        args: {
            data: {
                type: new GraphQLNonNull(BirOfficeInput)
            }
        },
        resolve: resolveAddOffice
    },
    deleteBirOffice: {
        type: BirOfficeObject,
        args: {
            id: {   
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolveDeleteOffice
    },

    // =============================== User Account Mutations ======================================= //
    registerAccount: {
        type: UserAccountObject,
        args: {
            data: {
                type: new GraphQLNonNull(AccountRegisterInput)
            }
        },
        resolve: resolveRegisterAccount
    },
    updateAccount: {
        type: UserAccountObject,
        args: {
            data: {
                type: new GraphQLNonNull(AccountUpdateInput)
            }
        },
        resolve: resolveUpdateAccount
    },
    setAccountInactive: {
        type: UserAccountObject,
        args: {
            accountId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveSetAccountInactive
    },
    changePassword: {
        type: UserAccountObject,
        args: {
            data: {
                type: new GraphQLNonNull(UserChangePasswordInput)
            }
        },
        resolve: resolveChangePassword
    },
    userLogin: {
        type: UserAccountObject,
        args: {
            data: {
                type: new GraphQLNonNull(UserLoginInputInput)
            }
        },
        resolve: resolveUserLogin
    },

    addRole: {
        type: RoleObject,
        args: {
            name: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveAddRole
    }
}

export const queryFields = {
    // ============================== BIR Offices Queries ====================================== //
    getAllBirOffices: {
        type: new GraphQLList(BirOfficeObject),
        resolve: resolveGetAllOffices
    },
    getBirOfficeById: {
        type: BirOfficeObject,
        args: {
            id: {   
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolveGetOfficeById
    },
    getAllOfficeSections: {
        type: new GraphQLList(OfficeSectionObject),
        resolve: resolveGetAllOfficeSections
    },

    // ============================== User Account Queries ====================================== //
    getAccountByUid: {
        type: UserAccountObject,
        args: {
            uid: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolveGetAccountByUid
    },

     // =============================== User Role Queries ======================================= //
     getAllRoles: {
        type: new GraphQLList(RoleObject),
        resolve: resolveGetAllRoles
     }
}