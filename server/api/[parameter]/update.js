import database from "blitzdb";
export default defineEventHandler(async(event) => {
try {
const {parameter} = getRouterParams(event);
const method = event.node.req.method;
let query = {};
if (method == "GET") {
query = getQuery(event);
} else if(method == "POST") {
query = readBody(event);
}
const {currentMatch, updateRecord} = query;
if (!currentMatch || !updateRecord) {
setResponseStatus(event, 400);
return {message: "Missing required parameters"};
}
const items = await database?.[parameter]?.updateOne(currentMatch, updateRecord);
if (items) {
return items;
} else {
setResponseStatus(event, 404);
return {message: "not found"}
}
} catch(error) {
setResponseStatus(event, 500);
return {message: error.message};
}
});