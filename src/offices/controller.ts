import dbClient from "../database";
import { 
    AccountRegisterInput,
    AccountUpdateInput,
    BirOfficeInput
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