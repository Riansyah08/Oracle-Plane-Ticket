import { DOMParser } from "xmldom";
const LOGIN_URL = "/Ticket/init/Service/BPM/Biz/UserLoginBizService";
const REGIST_URL = "/Ticket/init/Service/BPM/Biz/UserAccRegistBizService";
const TRANSACTIONLOG_URL = "/Ticket/init/Service/BPM/Biz/UserTicketDisplayBizService";
const TRANSACTION_URL = "/Ticket/init/Service/BPM/Biz/TicketBuynPointRedeemBizService";
const ITEMLIST_URL = "http://localhost:15103/Ticket/init/Service/BPM/Biz/ItemInfoCoherenceBizService";
const Plansesch_URL = "http://localhost:15103/Ticket/init/Service/BPM/Biz/PlaneScheduleCoherenceBizService";
const Ticketsearch_URL = "/Ticket/init/Service/BPM/Biz/TicketInfoBizService"

// Login logic payload fetching 
export function loginUser(formData) {
  const payloadlogin = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/UserLoginProcess" xmlns:ns2="http://www.permatabank.com/UserSystem">
			<ns2:UserSelectRq>
				<ns2:Email>${formData.email}</ns2:Email>
				<ns2:PasswordHash>${formData.password}</ns2:PasswordHash>
			</ns2:UserSelectRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
`;

return fetch(LOGIN_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml",
    "Accept": "text/xml"
  },
  body: payloadlogin
})
    .then(res => {
      console.log("HTTP STATUS:", res.status);
      return res.text(); // ✅ THIS WAS MISSING
    })
    .then(xmlText => {
      console.log("RAW RESPONSE:", xmlText); 
      return xmlText;
    })// 🔥 IMPORTANT
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const userNode =
        xmlDoc.getElementsByTagNameNS("*", "UserSelectRs")[0];

      if (!userNode) {
        throw new Error("Invalid SOAP response");
      }

      const statusCode =
        userNode.getElementsByTagNameNS("*", "StatusCode")[0]?.textContent;
      if (statusCode !== "00") {
        const statusDesc =
          userNode.getElementsByTagNameNS("*", "StatusDesc")[0]?.textContent;
          throw new Error(statusDesc || "Login failed");
      }
      // ✅ SUCCESS
      return {
        user_id: userNode.getElementsByTagNameNS("*", "UserAccID")[0]?.textContent,
        full_name: userNode.getElementsByTagNameNS("*", "FullName")[0]?.textContent,
        email: userNode.getElementsByTagNameNS("*", "Email")[0]?.textContent,
        phone_number: userNode.getElementsByTagNameNS("*", "PhoneNum")[0]?.textContent,
        join_date: userNode.getElementsByTagNameNS("*", "JoinDate")[0]?.textContent,
        password: formData.password,
        points_balance: Number(
          userNode.getElementsByTagNameNS("*", "PointsBalance")[0]?.textContent || 0
        ),
        km_hit: Number(
          userNode.getElementsByTagNameNS("*", "KmHit")[0]?.textContent || 0
        ),
        tier_id: userNode.getElementsByTagNameNS("*", "TierID")[0]?.textContent,
        tier_name: userNode.getElementsByTagNameNS("*", "TierName")[0]?.textContent
      };
    });
}


/* ================= REGISTER ================= */
export function Register(formData) {
  const payloadRegis = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/UserAccountRegisProcess" xmlns:ns2="http://www.permatabank.com/UserSystem">
			<ns2:UserInsertRq>
				<ns2:FullName>${formData.full_name}</ns2:FullName>
				<ns2:PasswordHash>${formData.password}</ns2:PasswordHash>
				<ns2:PhoneNum>${formData.phone_number}</ns2:PhoneNum>
				<ns2:PointsBalance>0</ns2:PointsBalance>
				<ns2:Email>${formData.email}</ns2:Email>
				<ns2:TierID>T1</ns2:TierID>
				<ns2:KmHit>0</ns2:KmHit>
			</ns2:UserInsertRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
`;

  return fetch(REGIST_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "Accept": "text/xml"
  },
    body: payloadRegis
      })
        .then(response => {
        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // If you expect an XML response, you would process it here
        return response.text(); // Get the response body as text
    })
    .then(xmlText => {
        // Process the XML response text
        console.log('Success (XML response text):', xmlText);
        // If you need to work with the XML structure, parse it using DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        console.log('Parsed XML Document:', xmlDoc);
    })
    .catch(error => {
        // Handle network errors or errors from the .then blocks
        console.error('There was a problem with the fetch operation:', error);
    });
}

/* ================= REDEEM ITEM ================= */
export function purchaseItem(newTransaction) {
const randomNumber = Math.floor(10000 + Math.random() * 90000);
  console.log("newTransaction:", newTransaction);
  const payloadItems = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/TransactionflowProcess" xmlns:ns2="http://www.permatabank.com/Coherence">
			<ns2:TicketBuywithCohRq>
				<ns2:TraceNumber/>
				<ns2:Email/>
				<ns2:PasswordHash/>
				<ns2:planeAddressFrom/>
				<ns2:planeAddressTo/>
				<ns2:planeSeat/>
				<ns2:DepartureDate/>
				<ns2:ArrivalDate/>
			</ns2:TicketBuywithCohRq>
			<ns2:PointRedeemwithCohRq>
				<ns2:TraceNumber>${randomNumber}</ns2:TraceNumber>
				<ns2:Email>${newTransaction.email}</ns2:Email>
				<ns2:PasswordHash>${newTransaction.password}</ns2:PasswordHash>
				<ns2:ItemId>${newTransaction.itemId}</ns2:ItemId>
				<ns2:Amount>${newTransaction.amount}</ns2:Amount>
			</ns2:PointRedeemwithCohRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
`;

  return fetch(TRANSACTION_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml",
    "Accept": "text/xml"
  },  
    body: payloadItems
  })
    .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const text = await response.text();
      
        console.log("RAW SOAP RESPONSE:", text);
      
        if (!text || text.trim() === "") {
          throw new Error("Empty SOAP response");
        }
      
        return text;
    })
    .then(xmlText => {
        // If you need to work with the XML structure, parse it using DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        console.log('Parsed XML Document:', xmlDoc);
    })
    .catch(error => {
        // Handle network errors or errors from the .then blocks
        console.error('There was a problem with the fetch operation:', error);
    });
}

/* ================= PURCHASE PLANE ================= */
export function purchasePlane(newTransaction) {
const randomNumber = Math.floor(10000 + Math.random() * 90000);
  const payloadPlane = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/TransactionflowProcess" xmlns:ns2="http://www.permatabank.com/Coherence">
			<ns2:TicketBuywithCohRq>
				<ns2:TraceNumber>${randomNumber}</ns2:TraceNumber>
				<ns2:Email>${newTransaction.email}</ns2:Email>
				<ns2:PasswordHash>${newTransaction.password}</ns2:PasswordHash>
				<ns2:planeAddressFrom>${newTransaction.planeAddressFrom}</ns2:planeAddressFrom>
				<ns2:planeAddressTo>${newTransaction.planeAddressTo}</ns2:planeAddressTo>        
        <ns2:planeId>${newTransaction.planeId}</ns2:planeId>
				<ns2:planeSeat>${newTransaction.planeSeat}</ns2:planeSeat>
				<ns2:DepartureDate>${newTransaction.DepartureDate}</ns2:DepartureDate>
				<ns2:ArrivalDate>${newTransaction.ArrivalDate}</ns2:ArrivalDate>
			</ns2:TicketBuywithCohRq>
			<ns2:PointRedeemwithCohRq>
				<ns2:TraceNumber/>
				<ns2:Email/>
				<ns2:PasswordHash/>
				<ns2:ItemId/>
				<ns2:Amount/>
			</ns2:PointRedeemwithCohRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
`;

  return fetch(TRANSACTION_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml",
    "Accept": "text/xml"
  },
    body: payloadPlane
 })
    .then(xmlText => {
        // ✅ Step 1: ensure it's a string
        if (typeof xmlText !== "string") {
          console.error("❌ Expected XML string but got:", xmlText);
          return [];
        }
      
        // ✅ Step 2: check empty
        if (xmlText.trim() === "") {
          console.error("❌ Empty XML response");
          return [];
        }
        // If you need to work with the XML structure, parse it using DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        console.log('Parsed XML Document:', xmlDoc);
    })
    .catch(error => {
        // Handle network errors or errors from the .then blocks
        console.error('There was a problem with the fetch operation:', error);
    });
}

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

/* ================= TRANSACTION LOG ================= */
export function Transactionlog({ email, password }) {
  const payloadLog = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/UserDisplayLogProcess" xmlns:ns2="http://www.permatabank.com/UserSystem">
			<ns2:TransactionLogDisplayRq>
				<ns2:Email>${email}</ns2:Email>
				<ns2:PasswordHash>${password}</ns2:PasswordHash>
			</ns2:TransactionLogDisplayRq>
		</ns1:start>
	</soap:Body>
</soap:Envelope>
`;

  return fetch(TRANSACTIONLOG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      Accept: "text/xml"
    },
    body: payloadLog
  })
    .then(res => res.text())
    .then(xmlText => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  // Get response root
  const response =
    xmlDoc.getElementsByTagNameNS("*", "TransactionLogDisplayRs")[0];

  if (!response) return [];

  // Optional status check
  const statusCode =
    response.getElementsByTagNameNS("*", "StatusCode")[0]?.textContent;

  if (statusCode !== "00") return [];

  // 🔥 THIS IS THE KEY PART
  const logs = response.getElementsByTagNameNS("*", "TransactionsLog");

  if (!logs || logs.length === 0) return [];

  return Array.from(logs).map(log => ({
    id:
      log.getElementsByTagNameNS("*", "TransactionId")[0]?.textContent,

    user_id:
      log.getElementsByTagNameNS("*", "bindAccID")[0]?.textContent,

    type:
      log.getElementsByTagNameNS("*", "TransactionType")[0]?.textContent,

    description:
      log.getElementsByTagNameNS("*", "Description")[0]?.textContent || "",

    date:
      log.getElementsByTagNameNS("*", "createdAt")[0]?.textContent,

    points: Number(
      log.getElementsByTagNameNS("*", "PointsAmount")[0]?.textContent || 0
    ),

    amount: Number(
      log.getElementsByTagNameNS("*", "AmountUsed")[0]?.textContent || 0
    ),

    // optional extras (future-proof)
    plane_name:
      log.getElementsByTagNameNS("*", "planeName")[0]?.textContent,

    item_name:
      log.getElementsByTagNameNS("*", "ItemName")[0]?.textContent
  }));
});
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
      "Content-Type": "text/xml; charset=utf-8",
      Accept: "text/xml"
    },
    body: payload
  })
    .then(res => res.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const items = Array.from(
        xmlDoc.getElementsByTagNameNS("*", "TicketInfoRs")
      );

      return items.map(item => ({
        userId: Number(
          item.getElementsByTagNameNS("*", "FullName")[0]?.textContent
        ),
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