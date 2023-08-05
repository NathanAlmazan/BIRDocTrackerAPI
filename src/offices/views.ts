import { 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLString
} from "graphql";
import { 
    resolveAddOffice, 
    resolveDeleteOffice, 
    resolveGetAccountByUid, 
    resolveGetAllOfficeSections, 
    resolveGetAllOffices, 
    resolveGetOfficeById,
    resolveRegisterAccount,
    resolveSetAccountInactive,
    resolveUpdateAccount
} from "./controller";
import { 
    BirOfficeObject, 
    OfficeSectionObject, 
    UserAccountObject 
} from "./model";
import { 
    AccountRegisterInput, 
    AccountUpdateInput, 
    BirOfficeInput 
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
    }
}