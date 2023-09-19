"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryFields = exports.mutationFields = void 0;
const graphql_1 = require("graphql");
const controller_1 = require("./controller");
const model_1 = require("./model");
const validation_1 = require("./validation");
exports.mutationFields = {
    // ================================ BIR Offices Mutations ======================================== //
    addBirOffice: {
        type: model_1.BirOfficeObject,
        args: {
            data: {
                type: new graphql_1.GraphQLNonNull(validation_1.BirOfficeInput)
            }
        },
        resolve: controller_1.resolveAddOffice
    },
    updateBirOffice: {
        type: model_1.BirOfficeObject,
        args: {
            officeId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            },
            officeName: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveUpdateOffice
    },
    deleteBirOffice: {
        type: model_1.BirOfficeObject,
        args: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            }
        },
        resolve: controller_1.resolveDeleteOffice
    },
    addOfficeSection: {
        type: model_1.OfficeSectionObject,
        args: {
            officeId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            },
            sectionName: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveCreateOfficeSection
    },
    updateSection: {
        type: model_1.OfficeSectionObject,
        args: {
            sectionId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            },
            sectionName: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveUpdateOfficeSection
    },
    deleteOfficeSection: {
        type: model_1.OfficeSectionObject,
        args: {
            sectionId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            }
        },
        resolve: controller_1.resolveDeleteOfficeSection
    },
    // =============================== User Account Mutations ======================================= //
    registerAccount: {
        type: model_1.UserAccountObject,
        args: {
            data: {
                type: new graphql_1.GraphQLNonNull(validation_1.AccountRegisterInput)
            }
        },
        resolve: controller_1.resolveRegisterAccount
    },
    updateAccount: {
        type: model_1.UserAccountObject,
        args: {
            data: {
                type: new graphql_1.GraphQLNonNull(validation_1.AccountUpdateInput)
            }
        },
        resolve: controller_1.resolveUpdateAccount
    },
    uploadSignature: {
        type: model_1.UserAccountObject,
        args: {
            userId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            signImage: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveUploadSignature
    },
    setAccountInactive: {
        type: model_1.UserAccountObject,
        args: {
            accountId: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveSetAccountInactive
    },
    changePassword: {
        type: model_1.UserAccountObject,
        args: {
            data: {
                type: new graphql_1.GraphQLNonNull(validation_1.UserChangePasswordInput)
            }
        },
        resolve: controller_1.resolveChangePassword
    },
    userLogin: {
        type: model_1.UserAccountObject,
        args: {
            data: {
                type: new graphql_1.GraphQLNonNull(validation_1.UserLoginInputInput)
            }
        },
        resolve: controller_1.resolveUserLogin
    },
    addRole: {
        type: model_1.RoleObject,
        args: {
            name: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveAddRole
    }
};
exports.queryFields = {
    // ============================== BIR Offices Queries ====================================== //
    getAllBirOffices: {
        type: new graphql_1.GraphQLList(model_1.BirOfficeObject),
        resolve: controller_1.resolveGetAllOffices
    },
    getBirOfficeById: {
        type: model_1.BirOfficeObject,
        args: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
            }
        },
        resolve: controller_1.resolveGetOfficeById
    },
    getAllOfficeSections: {
        type: new graphql_1.GraphQLList(model_1.OfficeSectionObject),
        resolve: controller_1.resolveGetAllOfficeSections
    },
    // ============================== User Account Queries ====================================== //
    getAccountByUid: {
        type: model_1.UserAccountObject,
        args: {
            uid: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            }
        },
        resolve: controller_1.resolveGetAccountByUid
    },
    // =============================== User Role Queries ======================================= //
    getAllRoles: {
        type: new graphql_1.GraphQLList(model_1.RoleObject),
        resolve: controller_1.resolveGetAllRoles
    }
};
//# sourceMappingURL=views.js.map