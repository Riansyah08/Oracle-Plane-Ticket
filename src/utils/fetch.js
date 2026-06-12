import { DOMParser } from "xmldom";
const HOST = process.env.VITE_HOST;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 15103;
const BASE_URL = `http://${HOST}:${FRONTEND_PORT}`;
const ITEMLIST_URL = BASE_URL + "/Ticket/init/Service/BPM/Biz/ItemInfoCoherenceBizService";
const Plansesch_URL = BASE_URL + "/Ticket/init/Service/BPM/Biz/PlaneScheduleCoherenceBizService";
const Ticketsearch_URL = BASE_URL + "/Ticket/init/Service/BPM/Biz/TicketInfoBizService";

/* ================= PLANE SCHEDULES ================= */
export async function PlaneSearch(planepload) {
const randomNumber = Math.floor(10000 + Math.random() * 90000);
  const payloadSearch = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/UserPlaneinfoProcess" xmlns:ns2="http://www.permatabank.com/Coherence">
			<ns2:PlaneScheduleRq>
				<ns2:TraceNumber>${randomNumber}</ns2:TraceNumber>
				<ns2:Reload>N</ns2:Reload>
			</ns2:PlaneScheduleRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
  `;

  try {
    /* ================= SOAP CALL ================= */
    const res = await fetch(Plansesch_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        Accept: "text/xml"
      },
      body: payloadSearch
    });

    const xmlText = await res.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const scheduleRs =
      xmlDoc.getElementsByTagName("PlaneScheduleRs")[0];

    let soapPlanes = [];

    if (scheduleRs) {
      const planes =
        scheduleRs.getElementsByTagName("Planeschedule");

      soapPlanes = Array.from(planes).map(plane => ({
        plane_id:
          plane.getElementsByTagName("planeId")[0]?.textContent ?? "",
        planeName:
          plane.getElementsByTagName("planeName")[0]?.textContent ?? "",
        flightNumber:
          plane.getElementsByTagName("flightNumber")[0]?.textContent ?? "",
        planeAddressFrom:
          plane.getElementsByTagName("planeAddressFrom")[0]?.textContent ?? "",
        planeAddressTo:
          plane.getElementsByTagName("planeAddressTo")[0]?.textContent ?? "",
        planeschedule_departs:
          plane.getElementsByTagName("planeScheduleDeparts")[0]?.textContent ?? "",
        planeschedule_arrive:
          plane.getElementsByTagName("planeScheduleArrive")[0]?.textContent ?? "",
        total_seat:
          plane.getElementsByTagName("TotalSeat")[0]?.textContent ?? "",
        availability:
          plane.getElementsByTagName("Availability")[0]?.textContent ?? "",
        km: Number(
          plane.getElementsByTagName("km")[0]?.textContent ?? 0
        ),
        price: Number(
          plane.getElementsByTagName("price")[0]?.textContent ?? 0
        )
      }));
    }

    return soapPlanes;

  } catch (err) {
    console.error("PlaneSearch failed:", err);
    return [];
  }
}

// utils/fetch.js
export function item_select() {
const randomNumber = Math.floor(10000 + Math.random() * 90000);
  const mapTier = (tier) => {
  if (!tier) return null;
  switch (tier.trim()) {
    case "T1":
      return "Silver";
    case "T2":
      return "Gold";
    case "T3":
      return "Platinum";
    default:
      return tier;
  }
};

  const payload = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/ItemCoherenceList" xmlns:ns2="http://www.permatabank.com/Coherence">
			<ns2:ItemRq>
				<ns2:TraceNumber>${randomNumber}</ns2:TraceNumber>
				<ns2:Reload>N</ns2:Reload>
			</ns2:ItemRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
`;

  return fetch(ITEMLIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      Accept: "text/xml"
    },
    body: payload
  })
    .then(res => res.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const items = Array.from(
        xmlDoc.getElementsByTagNameNS("*", "Items")
      );

      return items.map(item => ({
        id: item.getElementsByTagNameNS("*", "itemId")[0]?.textContent,
        name: item.getElementsByTagNameNS("*", "itemName")[0]?.textContent,
        category: item.getElementsByTagNameNS("*", "itemDescription")[0]?.textContent,
        points: Number(
          item.getElementsByTagNameNS("*", "itemPrice")[0]?.textContent || 0
        ),
        tier: mapTier(
          item.getElementsByTagNameNS("*", "minTier")[0]?.textContent || 0
        ),
        stock: mapTier(
          item.getElementsByTagNameNS("*", "itemStock")[0]?.textContent || 0
        )    
      }));
    });
}

/* ================= TICKET SELECT ================= */
export function ticket_select() {
  const payload = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/TicketInfoCoherence" xmlns:ns2="http://www.permatabank.com/UserSystem">
			<ns2:TicketInfoRq>
				<ns2:UserAccID/>
				<ns2:planeId/>
				<ns2:planeSeat/>
				<ns2:flightNumber/>
			</ns2:TicketInfoRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
`;

  return fetch(Ticketsearch_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      Accept: "text/xml"
    },
    body: payload
  })
    .then(res => res.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const items = Array.from(
        xmlDoc.getElementsByTagNameNS("*", "TicketList")
      );

      return items.map(item => ({
        planeId: Number(
          item.getElementsByTagNameNS("*", "planeName")[0]?.textContent
        ),
        planeSeat: Number(
          item.getElementsByTagNameNS("*", "planeSeat")[0]?.textContent
        ),
        flightNumber: Number(
          item.getElementsByTagNameNS("*", "flightNumber")[0]?.textContent || 0
        ),
        pairId: Number(
          item.getElementsByTagNameNS("*", "pairid")[0]?.textContent || 0
        ),
        departure_Date: Number(
          item.getElementsByTagNameNS("*", "planeScheduleDeparts")[0]?.textContent
        ),
        arrival_Date: Number(
          item.getElementsByTagNameNS("*", "planeScheduleArrive")[0]?.textContent
        )  
      }));
    });
}