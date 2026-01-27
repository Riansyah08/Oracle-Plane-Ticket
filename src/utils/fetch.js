const BPM_URL = "/soa-infra/services/default/BpmProject/MainProccess.service";

/* ================= REGISTER ================= */
export function Register(formData) {
  const payloadRegis = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>  
  <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess" xmlns:ns2="http://www.permatabank.com/UserSystem">
    <Status_Code></Status_Code>
    <ns2:TransactionLogDisplayRq>
    <ns2:TransactionLogDisplayRq>
      <ns2:UserAccID></ns2:UserAccID>
      <ns2:Email></ns2:Email>
    </ns2:TransactionLogDisplayRq>
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
      "Content-Type": "application/xml",
      "Accept": "application/xml"
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
      "Content-Type": "text/xml",
      "Accept": "text/xml"
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
      <ns2:UserAccID>${newTransaction.id}</ns2:UserAccID>
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
      "Content-Type": "text/xml",
      "Accept": "text/xml"
    },
    body: payloadPlane
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

/* ================= TRANSACTION LOG ================= */
export function Transactionlog(newTransaction) {
  const payloadLog = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess" xmlns:ns2="http://www.permatabank.com/UserSystem">
    <Status_Code/>
    <ns2:TransactionLogDisplayRq>
      <ns2:UserAccID>${newTransaction.UserAccID}</ns2:UserAccID>
      <ns2:Email>${newTransaction.email}</ns2:Email>
    </ns2:TransactionLogDisplayRq>
    <ns2:FullName></ns2:FullName>
      <ns2:PasswordHash></ns2:PasswordHash>
      <ns2:PhoneNum></ns2:PhoneNum>
      <ns2:PointsBalance></ns2:PointsBalance>
      <ns2:Email></ns2:Email>
      <ns2:TierID></ns2:TierID>
      <ns2:KmHit></ns2:KmHit>
    </ns2:UserInsertq>
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
      "Content-Type": "application/xml",
      "Accept": "application/xml"
    },
    body: payloadLog
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
    