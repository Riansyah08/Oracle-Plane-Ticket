import { DOMParser } from "xmldom";
const LOGIN_URL = "/Ticket/init/Service/BPM/Biz/UserLoginBizService";
const REGIST_URL = "/Ticket/init/Service/BPM/Biz/UserAccRegistBizService";
const TRANSACTIONLOG_URL = "/Ticket/init/Service/BPM/Biz/UserTicketDisplayBizService";
const TRANSACTION_URL = "/Ticket/init/Service/BPM/Biz/TicketBuynPointRedeemBizService";
const Changepassword_URL = "/Ticket/init/Service/BPM/Biz/UserChangePWBizService";
const Maintenance_URL = "/Ticket/init/Service/BPM/Biz/MaintenanceCheckBizService";

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
    .then(async (res) => {
      console.log("HTTP STATUS:", res.status);

      const xmlText = await res.text();

      return {
        status: res.status,
        xmlText
      };
    })
    .then(xmlText => {
      return xmlText;
    })// 🔥 IMPORTANT
    .then(({ status, xmlText }) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const userNode =
        xmlDoc.getElementsByTagNameNS("*", "UserSelectRs")[0];

      if (!userNode) {
        const error = new Error("Invalid SOAP response");
        error.status = status;
        throw error;
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
    "Content-Type": "text/xml",
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
}

/*====== Change Password ======*/
export function Changepassword(formData){
  const payloadChangepass = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/Process1" xmlns:ns2="http://www.permatabank.com/System02">
            <ns2:PasswordChngRq>
                <ns2:UserAccID></ns2:UserAccID>
                <ns2:Email>${formData.email}</ns2:Email>
                <ns2:Password>${formData.Password}</ns2:Password>
            </ns2:PasswordChngRq>
        </ns1:start>
    </soap:Body>
</soap:Envelope>
`;
  return fetch(Changepassword_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      "Accept": "text/xml"
    },
    body: payloadChangepass
  })
    .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const text = await response.text();
      
        if (!text || text.trim() === "") {
          throw new Error("Empty SOAP response");
        }
      
        return text;
    })
    .catch(error => {
        // Handle network errors or errors from the .then blocks
        console.error('There was a problem with the fetch operation:', error);
    });
}

/* ================= PURCHASE ITEM ================= */
export function purchaseItem(newTransaction) {
const randomNumber = Math.floor(10000 + Math.random() * 90000);
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
      
        if (!text || text.trim() === "") {
          console.warn("Empty SOAP response, assuming success");
          return true;
        }
      
        return text;
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
          return [];
        }
      
        // ✅ Step 2: check empty
        if (xmlText.trim() === "") {
          console.error("❌ Empty XML response");
          return [];
        }
    })
    .catch(error => {
        // Handle network errors or errors from the .then blocks
        console.error('There was a problem with the fetch operation:', error);
    });
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

    ticket_id:
      log.getElementsByTagNameNS("*", "TicketId")[0]?.textContent,

    // optional extras (future-proof)
    plane_name:
      log.getElementsByTagNameNS("*", "planeName")[0]?.textContent,

    item_name:
      log.getElementsByTagNameNS("*", "ItemName")[0]?.textContent,

    transaction_status:
      log.getElementsByTagNameNS("*", "TransactionStatus")[0]?.textContent
  }));
});
}

// MaintenanceCheck 
export function MaintenanceCheck(datacheck) {
  const payloadMaintenance = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MaintenenceCheck" xmlns:ns2="http://www.permatabank.com/Maintenance">
            <ns2:MaintenanceCheckRq>
                <ns2:LogCheck>${datacheck}</ns2:LogCheck>
            </ns2:MaintenanceCheckRq>
        </ns1:start>
    </soap:Body>
</soap:Envelope>
`;

return fetch(Maintenance_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml",
    "Accept": "text/xml"
  },
  body: payloadMaintenance
})
    .then(res => {
      console.log("HTTP STATUS:", res.status);
      return res.text(); // ✅ THIS WAS MISSING
    })
    .then(xmlText => {
      return xmlText;
    })// 🔥 IMPORTANT
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const userNode =
        xmlDoc.getElementsByTagNameNS("*", "MaintenanceCheckRs")[0];

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
        log_check: userNode.getElementsByTagNameNS("*", "LogCheck")[0]?.textContent,
        availability: userNode.getElementsByTagNameNS("*", "Availability")[0]?.textContent
      };
    });
}