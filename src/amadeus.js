export const Amadeus = require("amadeus");
export const amadeus = new Amadeus({
    clientId: "XMl3Bll9MQrrRVSBHpzrv1SG5tMpdCXu",
    clientSecret: "jVUtCQXEm1T3AP1C"
});
export function ajaxFindCountry (query) {
    //console.log("Hi")
    amadeus.referenceData.locations.get({
      keyword : query,
      subType : Amadeus.location.any
      })
}
  