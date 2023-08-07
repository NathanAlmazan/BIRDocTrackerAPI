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


export const resolveGetAllOffices = async () => {
    return await dbClient.birOffices.findMany()
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
    return await dbClient.birOffices.delete({
        where: {
            officeId: args.id
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
            position: args.data.position,
            officeId: args.data.officeId,
            resetCode: (Math.random() + 1).toString(36).substring(2, 8)
        }
    })
}

export const resolveUpdateAccount = async (_: any, args: AccountUpdateInput) => {
    return await dbClient.userAccounts.update({
        where: {
            accountId: args.data.accountId,
        },
        data: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            position: args.data.position,
            resetCode: (Math.random() + 1).toString(36).substring(2, 8)
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

// ===================================== Authentication ====================================== //

export const resolveChangePassword = async (_: any, args: { data: UserChangePassword }) => {
    const account = await dbClient.userAccounts.findFirst({
        where: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            officeId: args.data.officeId,
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
            officeId: args.data.officeId
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