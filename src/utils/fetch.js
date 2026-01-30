const BPM_URL = "/soa-infra/services/default/BpmProject/MainProccess.service";
const ITEMLIST_URL = "/soa-infra/services/default/BpmProject/SelectTransaction.service";
const Plansesch_URL = "/soa-infra/services/default/BpmProject/PlaneSchedule.service"


// Login logic payload fetching 
export function loginUser(formData) {
  const payloadlogin = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>  
  <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess" xmlns:ns2="http://www.permatabank.com/UserSystem">
    <Status_Code></Status_Code>
    <ns2:TransactionLogDisplayRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
    </ns2:TransactionLogDisplayRq>
    <ns2:UserInsertRq>
    <ns2:FullName></ns2:FullName>
      <ns2:PasswordHash></ns2:PasswordHash>
      <ns2:PhoneNum></ns2:PhoneNum>
      <ns2:PointsBalance>0</ns2:PointsBalance>
      <ns2:Email></ns2:Email>
      <ns2:TierID>T1</ns2:TierID>
      <ns2:KmHit>0</ns2:KmHit>
    </ns2:UserInsertRq>
    <ns2:PointRedeemRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:ItemId></ns2:ItemId>
      <ns2:Amount></ns2:Amount>
    </ns2:PointRedeemRq>
    <ns2:UserInformationRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:planeAddressFrom></ns2:planeAddressFrom>
      <ns2:planeAddressTo></ns2:planeAddressTo>
      <ns2:planeSeat></ns2:planeSeat>
    </ns2:UserInformationRq>
    <user_options>Login</user_options>
     <ns2:UserSelectRq>
      <ns2:UserAccID>${formData.userAccID}</ns2:UserAccID>
      <ns2:Email>${formData.email}</ns2:Email>
    </ns2:UserSelectRq>
  </ns1:start>
</soap:Body>
</soap:Envelope>
`;

return fetch(BPM_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "Accept": "text/xml",
    "SOAPAction": "start"
  },
  body: payloadlogin
})
    .then(res => res.text()) // 🔥 ALWAYS read body
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

const returnedUserId =
  userNode.getElementsByTagNameNS("*", "UserAccID")[0]?.textContent;

const returnedEmail =
  userNode.getElementsByTagNameNS("*", "Email")[0]?.textContent;

// 🔴 CRITICAL MATCH CHECK
if (
  !returnedUserId ||
  !returnedEmail ||
  String(returnedUserId) !== String(formData.userAccID) ||
  returnedEmail !== formData.email
) {
  throw new Error("Invalid User ID or Email");
}
      // ✅ SUCCESS
      return {
        user_id: userNode.getElementsByTagNameNS("*", "UserAccID")[0]?.textContent,
        full_name: userNode.getElementsByTagNameNS("*", "FullName")[0]?.textContent,
        email: userNode.getElementsByTagNameNS("*", "Email")[0]?.textContent,
        phone_number: userNode.getElementsByTagNameNS("*", "PhoneNum")[0]?.textContent,
        join_date: userNode.getElementsByTagNameNS("*", "JoinDate")[0]?.textContent,
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
  <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess" xmlns:ns2="http://www.permatabank.com/UserSystem">
    <Status_Code></Status_Code>
    <ns2:TransactionLogDisplayRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
    </ns2:TransactionLogDisplayRq>
    <ns2:UserInsertRq>
    <ns2:FullName>${formData.full_name}</ns2:FullName>
      <ns2:PasswordHash>${formData.password}</ns2:PasswordHash>
      <ns2:PhoneNum>${formData.phone_number}</ns2:PhoneNum>
      <ns2:PointsBalance>0</ns2:PointsBalance>
      <ns2:Email>${formData.email}</ns2:Email>
      <ns2:TierID>T1</ns2:TierID>
      <ns2:KmHit>0</ns2:KmHit>
    </ns2:UserInsertRq>
    <ns2:PointRedeemRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:ItemId></ns2:ItemId>
      <ns2:Amount></ns2:Amount>
    </ns2:PointRedeemRq>
    <ns2:UserInformationRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:planeAddressFrom></ns2:planeAddressFrom>
      <ns2:planeAddressTo></ns2:planeAddressTo>
      <ns2:planeSeat></ns2:planeSeat>
    </ns2:UserInformationRq>
    <user_options>Account</user_options>
    </ns1:start>
</soap:Body>
</soap:Envelope>
`;

  return fetch(BPM_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "Accept": "text/xml",
    "SOAPAction": "start"
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

/* ================= PURCHASE ITEM ================= */
export function purchaseItem(newTransaction) {
  const payloadItems = `
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
  <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess" xmlns:ns2="http://www.permatabank.com/UserSystem">
    <Status_Code></Status_Code>
    <ns2:TransactionLogDisplayRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
    </ns2:TransactionLogDisplayRq>
    <ns2:UserInsertRq>
      <ns2:UserAccID><ns2:UserAccID/>
      <ns2:FullName></ns2:FullName>
      <ns2:PasswordHash></ns2:PasswordHash>
      <ns2:PhoneNum></ns2:PhoneNum>
      <ns2:PointsBalance></ns2:PointsBalance>
      <ns2:Email></ns2:Email>
      <ns2:TierID></ns2:TierID>
      <ns2:KmHit></ns2:KmHit>
    </ns2:UserInsertRq>
    <ns2:PointRedeemRq>
        <ns2:UserAccID>${newTransaction.id}</ns2:UserAccID>
        <ns2:Email>${newTransaction.email}</ns2:Email>
        <ns2:ItemId>${newTransaction.itemId}</ns2:ItemId>
        <ns2:Amount>${newTransaction.amount}</ns2:Amount>
    </ns2:PointRedeemRq>
    <ns2:UserInformationRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:planeAddressFrom></ns2:planeAddressFrom>
      <ns2:planeAddressTo></ns2:planeAddressTo>
      <ns2:planeSeat></ns2:planeSeat>
    </ns2:UserInformationRq>
    <user_options>Redeem</user_options>
    </ns1:start>
  </soap:Body>
  </soap:Envelope>
`;

  return fetch(BPM_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "Accept": "text/xml",
    "SOAPAction": "start"
  },  
    body: payloadItems
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

/* ================= PURCHASE PLANE ================= */
export function purchasePlane(newTransaction) {
  const payloadPlane = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess" xmlns:ns2="http://www.permatabank.com/UserSystem">
    <Status_Code></Status_Code>
    <ns2:TransactionLogDisplayRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
    </ns2:TransactionLogDisplayRq>
    <ns2:UserInsertRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:FullName></ns2:FullName>
      <ns2:PasswordHash></ns2:PasswordHash>
      <ns2:PhoneNum></ns2:PhoneNum>
      <ns2:PointsBalance></ns2:PointsBalance>
      <ns2:Email></ns2:Email>
      <ns2:TierID></ns2:TierID>
      <ns2:KmHit></ns2:KmHit>
    </ns2:UserInsertRq>
    <ns2:PointRedeemRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:ItemId></ns2:ItemId>
      <ns2:Amount></ns2:Amount>
    </ns2:PointRedeemRq>
    <ns2:UserInformationRq>
      <ns2:UserAccID>${newTransaction.user_id}</ns2:UserAccID>
      <ns2:Email>${newTransaction.email}</ns2:Email>
      <ns2:planeAddressFrom>${newTransaction.planeAddressFrom}</ns2:planeAddressFrom>
      <ns2:planeAddressTo>${newTransaction.planeAddressTo}</ns2:planeAddressTo>
      <ns2:planeSeat>${newTransaction.planeSeat}</ns2:planeSeat>
    </ns2:UserInformationRq>
    <user_options>Purchase</user_options>
    </ns1:start>
</soap:Body>
</soap:Envelope>
`;

  return fetch(BPM_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "Accept": "text/xml",
    "SOAPAction": "start"
  },
    body: payloadPlane
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

/* ================= TRANSACTION LOG ================= */
export function PlaneSearch() {
  const payloadSearch = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/PlaneSchedule"
            xmlns:ns2="http://www.permatabank.com/UserSystem">
          <ns2:PlaneScheduleRq></ns2:PlaneScheduleRq>
        </ns1:start>
      </soap:Body>
    </soap:Envelope>
  `;

  return fetch(Plansesch_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      Accept: "text/xml",
      SOAPAction: "start"
    },
    body: payloadSearch
  })
    .then(res => res.text())
    .then(xmlText => {
      console.log('RAW XML:', xmlText);
        
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
      // 1️⃣ Find PlaneScheduleRs (this EXISTS)
      const scheduleRs =
        xmlDoc.getElementsByTagName("PlaneScheduleRs")[0];
        
      if (!scheduleRs) {
        console.error('PlaneScheduleRs not found');
        return [];
      }
    
      // 2️⃣ Get Planeschedule nodes (one or many)
      const planes =
        scheduleRs.getElementsByTagName("Planeschedule");
    
      if (!planes || planes.length === 0) {
        console.error('No Planeschedule nodes found');
        return [];
      }
    
      // 3️⃣ Map planes
      return Array.from(planes).map(plane => ({
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
      
        km: Number(
          plane.getElementsByTagName("km")[0]?.textContent ?? 0
        ),
      
        price: Number(
          plane.getElementsByTagName("price")[0]?.textContent ?? 0
        )
      }));
    });
}

/* ================= TRANSACTION LOG ================= */
export function Transactionlog({ email, userAccID }) {
  const payloadLog = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>  
  <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess" xmlns:ns2="http://www.permatabank.com/UserSystem">
    <Status_Code></Status_Code>
    <ns2:TransactionLogDisplayRq>
      <ns2:UserAccID>${userAccID}</ns2:UserAccID>
      <ns2:Email>${email}</ns2:Email>
    </ns2:TransactionLogDisplayRq>
    <ns2:UserInsertRq>
    <ns2:FullName></ns2:FullName>
      <ns2:PasswordHash></ns2:PasswordHash>
      <ns2:PhoneNum></ns2:PhoneNum>
      <ns2:PointsBalance></ns2:PointsBalance>
      <ns2:Email></ns2:Email>
      <ns2:TierID></ns2:TierID>
      <ns2:KmHit></ns2:KmHit>
    </ns2:UserInsertRq>
    <ns2:PointRedeemRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:ItemId></ns2:ItemId>
      <ns2:Amount></ns2:Amount>
    </ns2:PointRedeemRq>
    <ns2:UserInformationRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
      <ns2:planeAddressFrom></ns2:planeAddressFrom>
      <ns2:planeAddressTo></ns2:planeAddressTo>
      <ns2:planeSeat></ns2:planeSeat>
    </ns2:UserInformationRq>
    <user_options>Log_Display</user_options>
    </ns1:start>
</soap:Body>
</soap:Envelope>
`;

  return fetch(BPM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      Accept: "text/xml",
      SOAPAction: "start"
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
  const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body/>
    </soapenv:Envelope>
  `;

  return fetch(ITEMLIST_URL, {
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
          item.getElementsByTagNameNS("*", "minTier")[0]?.textContent
        )
      }));
    });
}

function mapTier(dbTier) {
  switch (dbTier?.trim()) {
    case "T3":
      return "Platinum";
    case "T2":
      return "Gold";
    case "T1":
      return "Silver";
    default:
      return "Silver";
  }
}
