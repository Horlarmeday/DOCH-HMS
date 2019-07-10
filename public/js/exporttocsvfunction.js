import * as path from "path";
import * as fs from "fs";
const promisify = require("bluebird").promisify;
const appendFileAsync = promisify(fs.appendFile);


const BATCH_SIZE = 10000;

let connection = "AWS";
let database = "borrowme";
let targetPath = "C:\\Users\\EB\\Documents";

if (!fs.existsSync(targetPath))
    require("mkdirp").sync(targetPath);

let exportCollections = [
    { collection: "cards", query: {}, projection: {}, sort: {}, skip: 0, limit: 0, filename: "borrowme.cards.csv", delimiter: ",", fields: [] }
];
let totalDocs = 0;
let collectionResult = {};//collectionResult:{[name:string]:number}

function exportCollection(collectionParams) {
    let { collection, filename, query, projection, sort, skip, limit, fields, delimiter } = collectionParams;

    let continueRead = true;
    let filepath = path.resolve(targetPath, mb.sanitizeFile(filename || (collection + ".csv")));

    console.log(`export docs from ${connection}:${database}:${collection} to ${filepath} start...`);

    if (fs.existsSync(filepath))
        fs.unlinkSync(filepath);

    if (!_.isEmpty(fields)) {
        projection = {};
        fields.forEach(field => {
            projection[field] = 1;
        })
    } else {
        fields = mb.tryGetFields({ connection, db: database, collection });
    }

    collectionResult[collection] = 0;

    let theSkip = skip;
    let theLimit = limit || Number.MAX_SAFE_INTEGER;
    while (continueRead) {
        let docs = mb.readFromDb({ connection, db: database, collection, query, projection, sort, skip: theSkip, limit: theLimit > BATCH_SIZE ? BATCH_SIZE : theLimit });
        let readLength = docs.length;
        let isFirstRead = theSkip === skip;
        theSkip += readLength;
        theLimit -= readLength;

        if (readLength < BATCH_SIZE)
            continueRead = false;

        if (readLength) {
            collectionResult[collection] += readLength;
            let csvContent = mb.docsToCSV({ docs, fields, delimiter, withColumnTitle: isFirstRead });
            await(appendFileAsync(filepath, csvContent));

            console.log(`export ${collectionResult[collection]} docs to ${path.basename(filepath)}.`);
            totalDocs += docs.length;
        }

        sleep(10)
    }

    console.log(`export ${collectionResult[collection]} docs from ${connection}:${database}:${collection} to ${filepath} finished.`);
}

exportCollections.forEach(it => exportCollection(it));
_.delay(() => mb.openFolder(targetPath), 1000);

if (exportCollections.length > 1)
    console.log(`Total ${totalDocs} document(s) of ${exportCollections.length} collections successfully exported.`, collectionResult);
