import { ENDPOINT_URL, ID_TOKEN } from "../constants/constants";
import { setPools } from "../features/logic";
import { poolResponses } from "../types/types";

export async function queryGQL(userSlug: string) {
  const query = `
    query GetUserBySlug($slug: String!) {
      user(slug: $slug) {
        id
        player {
          gamerTag
          recentStandings(limit: 5) {
            placement
            entrant {
              event {
                numEntrants
                tournament {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(ENDPOINT_URL, {
    method: "POST", // ここが重要
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ID_TOKEN}`, // ID_TOKENをここで使う
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { slug: userSlug }
    })
  });

  const data = await response.json();

  return data;
}

export async function queryGQL2() {
    const query = `
        query PlayerPools(
          $tournamentSlug: String!,
          $eventSlug: String!,
          $gamerTag: String!,
        ) {
            tournament(slug: $tournamentSlug) {
                events(filter: {slug: $eventSlug}) { id slug }
                participants(query: {filter: {gamerTag: $gamerTag}}) {
                    nodes{
                        gamerTag
                        entrants{
                            event{id slug }
                            seeds{
                                phaseGroup{
                                    displayIdentifier
                                    phase{name}
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
  
    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ID_TOKEN}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { tournamentSlug: "12-kagaribi-12", eventSlug: "singles", gamerTag: "おつ" }
      })
    });
  
    const data = await response.json();
  
    return data;
  }

  export async function queryGQL3(gamerTags: string[]) {
    let query = `
        query GetEventId($tSlug:String!, $eSlug:String!){
            tournament(slug:$tSlug){ events( filter: {slug:$eSlug} ){ id } }
        }
    `;
    const subResponse = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ID_TOKEN}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { tSlug: "12-kagaribi-12", eSlug: "singles" }
        })
      });
    const subData = await subResponse.json();
    console.log(subData);
    query = `
        query PlayerPools(
          $tournamentSlug: String!,
          $eventId: ID!,
          $gamerTag: String!,
        ) {
            tournament(slug: $tournamentSlug) {
                participants(query: {
                    filter: {gamerTag: $gamerTag, eventIds:[$eventId]}
                }) {
                    nodes{
                        gamerTag
                        entrants{
                            event{ id }
                            seeds{
                                phaseGroup{
                                    displayIdentifier
                                    phase{name}
                                    wave{identifier}
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
    const res:poolResponses = [];

    console.log(subData["data"]["tournament"]["events"][0]["id"]);
    const eventId = subData["data"]["tournament"]["events"][0]["id"];
    console.log(eventId);
  
    for (const gamerTag of gamerTags){
        const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ID_TOKEN}`,
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query,
            variables: { tournamentSlug: "12-kagaribi-12", eventId: eventId, gamerTag: gamerTag }
        })
        });
    
        const data = await response.json();
        // console.log(data);
        if(data["data"]["tournament"]["participants"]["nodes"].length == 0 || data["data"]["tournament"]["participants"]["nodes"][0]["gamerTag"]!=gamerTag){
            res.push({pool: "Z000", gamerTag: gamerTag, });
            continue;
        }
        const seeds = data["data"]["tournament"]["participants"]["nodes"][0]["entrants"][0]["seeds"];
        res.push({pool: seeds[seeds.length-1]["phaseGroup"]["displayIdentifier"], gamerTag: data["data"]["tournament"]["participants"]["nodes"][0]["gamerTag"], });
    }

    const logicRes = setPools(res);
    console.log(logicRes);
  
    return logicRes;
  }