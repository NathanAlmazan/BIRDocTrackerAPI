"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthenticationObject = exports.UserAccountObject = exports.RoleObject = exports.OfficeSectionObject = exports.BirOfficeObject = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const graphql_1 = require("graphql");
exports.BirOfficeObject = new graphql_1.GraphQLObjectType({
    name: "BirOffice",
    description: "BIR Offices",
    fields: () => ({
        officeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        officeName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        refNum: {
            type: graphql_1.GraphQLString
        },
        officeSections: {
            type: new graphql_1.GraphQLList(exports.OfficeSectionObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.officeSections.findMany({
                    where: {
                        officeId: parent.officeId
                    },
                    orderBy: {
                        sectionId: 'asc'
                    }
                });
            })
        }
    })
});
exports.OfficeSectionObject = new graphql_1.GraphQLObjectType({
    name: "OfficeSection",
    description: "BIR Offices Sections",
    fields: () => ({
        sectionId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        sectionName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        admin: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
        },
        sectionOffice: {
            type: exports.BirOfficeObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.birOffices.findUnique({
                    where: {
                        officeId: parent.officeId
                    }
                });
            })
        },
        officers: {
            type: new graphql_1.GraphQLList(exports.UserAccountObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.userAccounts.findMany({
                    where: {
                        officeId: parent.sectionId,
                        active: true
                    }
                });
            })
        }
    })
});
exports.RoleObject = new graphql_1.GraphQLObjectType({
    name: "UserRoles",
    description: "BIR User Roles",
    fields: () => ({
        roleId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        roleName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        superuser: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
        }
    })
});
exports.UserAccountObject = new graphql_1.GraphQLObjectType({
    name: "UserAccount",
    description: "BIR Employees accounts",
    fields: () => ({
        accountId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        firstName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        signImage: {
            type: graphql_1.GraphQLString
        },
        lastName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        role: {
            type: new graphql_1.GraphQLNonNull(exports.RoleObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.roles.findUnique({
                    where: {
                        roleId: parent.roleId
                    }
                });
            })
        },
        resetCode: {
            type: graphql_1.GraphQLString
        },
        registered: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                const account = yield database_1.default.userAccounts.findUnique({
                    where: {
                        accountId: parent.accountId
                    },
                    select: {
                        password: true
                    }
                });
                return (account && account.password.length > 0);
            })
        },
        officeSection: {
            type: exports.OfficeSectionObject,
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return yield database_1.default.officeSections.findUnique({
                    where: {
                        sectionId: parent.officeId
                    }
                });
            })
        }
    })
});
exports.JWTAuthenticationObject = new graphql_1.GraphQLObjectType({
    name: "JSONWebTokens",
    description: "JSON Web Token Object",
    fields: {
        accessToken: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return jsonwebtoken_1.default.sign({
                    accountId: parent.accountId
                }, process.env.SECRET_KEY, {
                    expiresIn: '1h'
                });
            })
        },
        refreshToken: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return jsonwebtoken_1.default.sign({
                    accountId: parent.accountId
                }, process.env.SECRET_KEY, {
                    expiresIn: '6h'
                });
            })
        }
    }
});
//# sourceMappingURL=model.js.map