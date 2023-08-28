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
exports.resolveUserLogin = exports.resolveChangePassword = exports.resolveGetAccountByUid = exports.resolveSetAccountInactive = exports.resolveUpdateAccount = exports.resolveRegisterAccount = exports.resolveGetAllRoles = exports.resolveAddRole = exports.resolveDeleteOfficeSection = exports.resolveUpdateOfficeSection = exports.resolveCreateOfficeSection = exports.resolveDeleteOffice = exports.resolveGetAllOfficeSections = exports.resolveGetOfficeById = exports.resolveGetAllOffices = exports.resolveUpdateOffice = exports.resolveAddOffice = void 0;
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
// ============================================================== BIR Offices Controller ===================================================================== //
const resolveAddOffice = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    // map section names into prisma objects
    let officeSection = [];
    if (args.data.officeSections)
        officeSection = args.data.officeSections.map(sec => ({ sectionName: sec }));
    // save and return new office
    return yield database_1.default.birOffices.create({
        data: {
            officeName: args.data.officeName,
            sections: {
                createMany: {
                    data: officeSection
                }
            }
        }
    });
});
exports.resolveAddOffice = resolveAddOffice;
const resolveUpdateOffice = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.birOffices.update({
        where: {
            officeId: args.officeId
        },
        data: {
            officeName: args.officeName
        }
    });
});
exports.resolveUpdateOffice = resolveUpdateOffice;
const resolveGetAllOffices = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.birOffices.findMany();
});
exports.resolveGetAllOffices = resolveGetAllOffices;
const resolveGetOfficeById = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.birOffices.findUnique({
        where: {
            officeId: args.id
        }
    });
});
exports.resolveGetOfficeById = resolveGetOfficeById;
const resolveGetAllOfficeSections = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.officeSections.findMany();
});
exports.resolveGetAllOfficeSections = resolveGetAllOfficeSections;
const resolveDeleteOffice = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.officeSections.deleteMany({
        where: {
            officeId: args.id,
            sectionName: 'default'
        }
    });
    return yield database_1.default.birOffices.delete({
        where: {
            officeId: args.id
        }
    });
});
exports.resolveDeleteOffice = resolveDeleteOffice;
const resolveCreateOfficeSection = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.officeSections.create({
        data: {
            sectionName: args.sectionName,
            officeId: args.officeId
        }
    });
});
exports.resolveCreateOfficeSection = resolveCreateOfficeSection;
const resolveUpdateOfficeSection = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.officeSections.update({
        where: {
            sectionId: args.sectionId,
        },
        data: {
            sectionName: args.sectionName
        }
    });
});
exports.resolveUpdateOfficeSection = resolveUpdateOfficeSection;
const resolveDeleteOfficeSection = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.userAccounts.deleteMany({
        where: {
            officeId: args.sectionId,
            active: false
        }
    });
    return yield database_1.default.officeSections.delete({
        where: {
            sectionId: args.sectionId
        }
    });
});
exports.resolveDeleteOfficeSection = resolveDeleteOfficeSection;
// ============================================================== User Roles ======================================================================= //
const resolveAddRole = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.roles.create({
        data: {
            roleName: args.name
        }
    });
});
exports.resolveAddRole = resolveAddRole;
const resolveGetAllRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.roles.findMany({
        orderBy: {
            roleId: 'asc'
        }
    });
});
exports.resolveGetAllRoles = resolveGetAllRoles;
// ============================================================== User Account Controller ===================================================================== //
const resolveRegisterAccount = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.userAccounts.create({
        data: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            password: "",
            roleId: args.data.roleId,
            officeId: args.data.officeId,
            resetCode: (Math.random() + 1).toString(36).substring(2, 8)
        }
    });
});
exports.resolveRegisterAccount = resolveRegisterAccount;
const resolveUpdateAccount = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    let password;
    if (args.data.password && args.data.password.length > 6) {
        password = yield bcrypt_1.default.hash(args.data.password, 12);
    }
    return yield database_1.default.userAccounts.update({
        where: {
            accountId: args.data.accountId,
        },
        data: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            roleId: args.data.roleId,
            resetCode: (Math.random() + 1).toString(36).substring(2, 8),
            password: password
        }
    });
});
exports.resolveUpdateAccount = resolveUpdateAccount;
const resolveSetAccountInactive = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.userAccounts.update({
        where: {
            accountId: args.accountId,
        },
        data: {
            active: false
        }
    });
});
exports.resolveSetAccountInactive = resolveSetAccountInactive;
const resolveGetAccountByUid = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.userAccounts.findUnique({
        where: {
            accountId: args.uid
        }
    });
});
exports.resolveGetAccountByUid = resolveGetAccountByUid;
// ===================================== Authentication ====================================== //
const resolveChangePassword = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield database_1.default.userAccounts.findFirst({
        where: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            officeId: args.data.officeId,
            roleId: args.data.roleId,
            resetCode: args.data.resetCode
        }
    });
    if (!account)
        throw new graphql_1.GraphQLError('User does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    const encrypted = yield bcrypt_1.default.hash(args.data.password, 12);
    return yield database_1.default.userAccounts.update({
        where: {
            accountId: account.accountId
        },
        data: {
            password: encrypted,
            resetCode: (Math.random() + 1).toString(36).substring(2, 8)
        }
    });
});
exports.resolveChangePassword = resolveChangePassword;
const resolveUserLogin = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield database_1.default.userAccounts.findFirst({
        where: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            officeId: args.data.officeId,
            roleId: args.data.roleId
        }
    });
    if (!account)
        throw new graphql_1.GraphQLError('User does not exist', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    if (account.password.length === 0)
        throw new graphql_1.GraphQLError('User is not yet registered.', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    const authorized = yield bcrypt_1.default.compare(args.data.password, account.password);
    if (!authorized)
        throw new graphql_1.GraphQLError('Wrong Password', {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    return account;
});
exports.resolveUserLogin = resolveUserLogin;
//# sourceMappingURL=controller.js.map