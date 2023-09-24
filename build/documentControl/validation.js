"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFileInput = exports.MessageCreateInput = exports.ThreadCreateInput = void 0;
const graphql_1 = require("graphql");
exports.ThreadCreateInput = new graphql_1.GraphQLInputObjectType({
    name: "ThreadInput",
    fields: () => ({
        subject: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        authorId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        statusId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        recipientId: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLInt)
        },
        docTypeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        purposeId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        attachments: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
        },
        completed: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
        },
        dateDue: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        tagId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        },
        recipientUserId: {
            type: graphql_1.GraphQLString
        },
        purposeNotes: {
            type: graphql_1.GraphQLString
        }
    })
});
exports.MessageCreateInput = new graphql_1.GraphQLInputObjectType({
    name: "MessageInput",
    fields: () => ({
        message: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        senderId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        threadId: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        files: {
            type: new graphql_1.GraphQLList(exports.MessageFileInput)
        }
    })
});
exports.MessageFileInput = new graphql_1.GraphQLInputObjectType({
    name: "MessageFileInput",
    fields: () => ({
        fileUrl: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        fileName: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        },
        fileType: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
        }
    })
});
//# sourceMappingURL=validation.js.map