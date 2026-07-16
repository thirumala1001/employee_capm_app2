const cds = require('@sap/cds');
const { emppersonalData } = cds.entities;

// module.exports = srv => {
//     const db = cds.db;

//     srv.after('READ', 'empPersonalSet', (results, req) => {
//         // let results = []
//         // console.log("req data:=", req);
//         // console.log("request data:=", req.data);
//         // console.log("request query:=", req.query);  
//         // console.log("request params:=", req.params);
//         // results = await db.run(SELECT.from(emppersonalData));
//         // console.log("results:=", results);
//         if (!Array.isArray(results)) {
//             results = [results];
//         }
//         results.forEach(element => {
//             console.log("element:=", element.empDateOfBirth);
//             element.empDateOfBirth = new Date(element.empDateOfBirth).toLocaleDateString('en-GB');
//             // element.empDateOfBirth = new Date("'" + element.empDateOfBirth + "'").toLocaleDateString('en-GB');
//         });
//     })
// }
