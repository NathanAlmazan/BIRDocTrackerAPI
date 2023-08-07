"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginInputInput = exports.UserChangePasswordInput = exports.AccountUpdateProfileInput = exports.AccountRequestResetCodeInput = exports.AccountChangePasswordInput = exports.AccountLoginInput = exports.AccountUpdateInput = exports.AccountRegisterInput = exports.BirOfficeSectionInput = exports.BirOfficeInput = void 0;
const graphql_1 = require("graphql");
exports.BirOfficeInput = new graphql_1.GraphQLInputObjectType({
    name: "OfficeInput",
    fields: () => ({
        officeName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        officeSections: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
        }
    })
});
exports.BirOfficeSectionInput = new graphql_1.GraphQLInputObjectType({
    name: "OfficeSectionInput",
    fields: () => ({
        sectionName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        officeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        }
    })
});
exports.AccountRegisterInput = new graphql_1.GraphQLInputObjectType({
    name: "AccountRegisterInput",
    fields: () => ({
        firstName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        lastName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        position: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        officeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        }
    })
});
exports.AccountUpdateInput = new graphql_1.GraphQLInputObjectType({
    name: "AccountUpdateInput",
    fields: () => ({
        accountId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        firstName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        lastName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        position: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        }
    })
});
exports.AccountLoginInput = new graphql_1.GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        firstName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        lastName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        officeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        password: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        }
    })
});
exports.AccountChangePasswordInput = new graphql_1.GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        accountId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        resetCode: {
            type: graphql_1.GraphQLString
        },
        password: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
    })
});
exports.AccountRequestResetCodeInput = new graphql_1.GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        accountId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        }
    })
});
exports.AccountUpdateProfileInput = new graphql_1.GraphQLInputObjectType({
    name: "UserAccountInput",
    fields: () => ({
        accountId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        firstName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        lastName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        position: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        officeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        }
    })
});
exports.UserChangePasswordInput = new graphql_1.GraphQLInputObjectType({
    name: "UserChangePasswordInput",
    fields: () => ({
        firstName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        lastName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        officeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        resetCode: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        password: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        }
    })
});
exports.UserLoginInputInput = new graphql_1.GraphQLInputObjectType({
    name: 'UserLoginInputInput',
    fields: () => ({
        firstName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        lastName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        officeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        password: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        }
    })
});
//# sourceMappingURL=validation.js.map