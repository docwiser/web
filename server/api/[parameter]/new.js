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
const items = await database?.[parameter]?.insertOne(query);
if ('_id' in items) {
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