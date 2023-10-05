import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import dbClient from "../database";
import { 
    AccountRegisterInput,
    AccountUpdateInput,
    BirOfficeInput,
    UserChangePassword
} from "./validation";


// ============================================================== BIR Offices Controller ===================================================================== //

export const resolveAddOffice = async (_: any, args: BirOfficeInput) => {
    // map section names into prisma objects
    let officeSection: { sectionName: string }[] = [];
    if (args.data.officeSections) officeSection = args.data.officeSections.map(sec => ({ sectionName: sec })) 

    // save and return new office
    return await dbClient.birOffices.create({
        data: {
            officeName: args.data.officeName,
            sections: {
                createMany: {
                    data: officeSection
                }
            }
        }
    })
}

export const resolveUpdateOffice = async (_: any, args: { officeId: number, officeName: string }) => {
    return await dbClient.birOffices.update({
        where: {
            officeId: args.officeId
        },
        data: {
            officeName: args.officeName
        }
    })
}

export const resolveGetAllOffices = async () => {
    return await dbClient.birOffices.findMany({
        orderBy: {
            officeId: 'asc'
        }
    })
}


export const resolveGetOfficeById = async (_: any, args: { id: number }) => {
    return await dbClient.birOffices.findUnique({
        where: {
            officeId: args.id
        }
    })
}

export const resolveGetAllOfficeSections = async () => {
    return await dbClient.officeSections.findMany()
}

export const resolveDeleteOffice = async (_: any, args: { id: number }) => {
    await dbClient.officeSections.deleteMany({
        where: {
            officeId: args.id,
            sectionName: 'default'
        }
    });

    return await dbClient.birOffices.delete({
        where: {
            officeId: args.id
        }
    })
}

export const resolveCreateOfficeSection = async (_: any, args: { officeId: number, sectionName: string }) => {
    return await dbClient.officeSections.create({
        data: {
            sectionName: args.sectionName,
            officeId: args.officeId
        }
    })
}

export const resolveUpdateOfficeSection = async (_: any, args: { sectionId: number, sectionName: string }) => {
    return await dbClient.officeSections.update({
        where: {
            sectionId: args.sectionId,
        },
        data: {
            sectionName: args.sectionName
        }
    })
}

export const resolveDeleteOfficeSection = async (_: any, args: { sectionId: number }) => {
    await dbClient.userAccounts.deleteMany({
        where: {
            officeId: args.sectionId,
            active: false
        }
    });

    return await dbClient.officeSections.delete({
        where: {
            sectionId: args.sectionId
        }
    })
}

// ============================================================== User Roles ======================================================================= //

export const resolveAddRole = async (_: any, args: { name: string }) => {
    return await dbClient.roles.create({
        data: {
            roleName: args.name
        }
    })
} 

export const resolveGetAllRoles = async () => {
    return await dbClient.roles.findMany({
        orderBy: {
            roleId: 'asc'
        }
    })
}

// ============================================================== User Account Controller ===================================================================== //

export const resolveRegisterAccount = async (_: any, args: AccountRegisterInput) => {
    return await dbClient.userAccounts.create({
        data: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            password: "",
            roleId: args.data.roleId,
            officeId: args.data.officeId,
            resetCode: (Math.random() + 1).toString(36).substring(2, 8)
        }
    })
}

export const resolveUpdateAccount = async (_: any, args: AccountUpdateInput) => {
    let password: string | undefined;
    
    if (args.data.password && args.data.password.length > 6) {
        password = await bcrypt.hash(args.data.password, 12);
    }

    return await dbClient.userAccounts.update({
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
    })
}

export const resolveUploadSignature = async (_: any, args: { userId: string, signImage: string | null }) => {
    return await dbClient.userAccounts.update({
        where: {
            accountId: args.userId
        },
        data: {
            signImage: args.signImage
        }
    })
}

export const resolveSetAccountInactive = async (_: any, args: { accountId: string }) => {
    return await dbClient.userAccounts.update({
        where: {
            accountId: args.accountId,
        },
        data: {
            active: false
        }
    })
}

export const resolveGetAccountByUid = async (_: any, args: { uid: string }) => {
    return await dbClient.userAccounts.findUnique({
        where: {
            accountId: args.uid
        }
    })
}

export const resolveGetAccountsByOffice = async (_: any, args: { officeIds: number[] }) => {
    return await dbClient.userAccounts.findMany({
        where: {
            officeId: {
                in: args.officeIds
            }
        }
    })
}

// ===================================== Authentication ====================================== //

export const resolveChangePassword = async (_: any, args: { data: UserChangePassword }) => {
    const account = await dbClient.userAccounts.findFirst({
        where: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            officeId: args.data.officeId,
            roleId: args.data.roleId,
            resetCode: args.data.resetCode
        }
    })

    if (!account) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const encrypted = await bcrypt.hash(args.data.password, 12);

    return await dbClient.userAccounts.update({
        where: {
            accountId: account.accountId
        },
        data: {
            password: encrypted,
            resetCode: (Math.random() + 1).toString(36).substring(2, 8)
        }
    })
}

export const resolveUserLogin = async (_: any, args: { data: Omit<UserChangePassword, "resetCode"> }) => {
    const account = await dbClient.userAccounts.findFirst({
        where: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            officeId: args.data.officeId,
            roleId: args.data.roleId
        }
    })

    if (!account) throw new GraphQLError('User does not exist', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    if (account.password.length === 0) throw new GraphQLError('User is not yet registered.', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    const authorized = await bcrypt.compare(args.data.password, account.password);

    if (!authorized) throw new GraphQLError('Wrong Password', {
        extensions: {
            code: 'BAD_REQUEST'
        }
    })

    return account;
}