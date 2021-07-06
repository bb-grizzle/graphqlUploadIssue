import { ApolloServer, gql } from "apollo-server";
import { createWriteStream } from "fs";
import AWS from "aws-sdk";
require("dotenv").config();

const books = [
	{
		title: "The Awakening",
		author: "Kate Chopin",
	},
	{
		title: "City of Glass",
		author: "Paul Auster",
	},
];

const typeDefs = gql`
	type Book {
		title: String
		author: String
	}

	type Query {
		books: [Book]
	}

	type Mutation {
		upload(file: Upload!): Boolean!
	}
`;

const resolvers = {
	Query: {
		books: () => books,
	},
	Mutation: {
		upload: async (_, { file }) => {
			const { createReadStream, filename, mimetype } = await file;
			const readStream = createReadStream();

			// Both didnt work.

			// 01. stream upload
			// const writeStream = createWriteStream(`${process.cwd()}/uploads/${filename}`);
			// readStream.pipe(writeStream);

			// 02. s3 upload
			// const s3 = new AWS.S3({
			// 	accessKeyId: process.env.AWS_KEY,
			// 	secretAccessKey: process.env.AWS_SECRET_KEY,
			// 	region: "ap-northeast-2",
			// });

			// const param = {
			// 	Bucket: "grizzle-instaclone",
			// 	Key: "filename",
			// 	ACL: "public-read",
			// 	Body: readStream,
			// 	ContentType: mimetype,
			// };

			// await s3
			// 	.upload(param, function (err, data) {
			// 		console.log("😀 UPLOAD");
			// 		console.log(err);
			// 		console.log(data);
			// 	})
			// 	.promise();

			return true;
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
