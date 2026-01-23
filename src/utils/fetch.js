const BPM_URL = "http://localhost:7003/soa-infra/services/default/BpmProject/MainProccess.service";

/* ================= REGISTER ================= */
export function Register(formData) {
  const payloadRegis = `
<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess"
           xmlns:ns2="http://www.permatabank.com/UserSystem">
  <Status_Code/>
  <ns2:TransactionLogDisplayRq/>
  <ns2:UserInsertRq>
    <ns2:UserAccID/>
    <ns2:FullName>${formData.full_name}</ns2:FullName>
    <ns2:PasswordHash>${formData.password}</ns2:PasswordHash>
    <ns2:PhoneNum>${formData.phone_number}</ns2:PhoneNum>
    <ns2:PointsBalance>0</ns2:PointsBalance>
    <ns2:Email>${formData.email}</ns2:Email>
    <ns2:TierID>T1</ns2:TierID>
    <ns2:KmHit>0</ns2:KmHit>
  </ns2:UserInsertRq>
  <user_options>Account</user_options>
</ns1:start>
`;

  return fetch(BPM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      "Accept": "text/xml"
    },
    body: payloadRegis
  })
    .then(res => res.text())
    .then(data => console.log("Register response:", data))
    .catch(err => console.error("Register error:", err));
}

/* ================= PURCHASE ITEM ================= */
export function purchaseItem(newTransaction) {
  const payloadItems = `
<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess"
           xmlns:ns2="http://www.permatabank.com/UserSystem">
  <Status_Code/>
  <ns2:PointRedeemRq>
    <ns2:UserAccID>${newTransaction.id}</ns2:UserAccID>
    <ns2:Email>${newTransaction.email}</ns2:Email>
    <ns2:ItemId>${newTransaction.itemId}</ns2:ItemId>
    <ns2:Amount>${newTransaction.amount}</ns2:Amount>
  </ns2:PointRedeemRq>
  <user_options>Redeem</user_options>
</ns1:start>
`;

  return fetch(BPM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      "Accept": "text/xml"
    },
    body: payloadItems
  });
}

/* ================= PURCHASE PLANE ================= */
export function purchasePlane(newTransaction) {
  const payloadPlane = `
<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess"
           xmlns:ns2="http://www.permatabank.com/UserSystem">
  <Status_Code/>
  <ns2:UserInformationRq>
    <ns2:UserAccID>${newTransaction.id}</ns2:UserAccID>
    <ns2:Email>${newTransaction.email}</ns2:Email>
    <ns2:planeAddressFrom>${newTransaction.planeAddressFrom}</ns2:planeAddressFrom>
    <ns2:planeAddressTo>${newTransaction.planeAddressTo}</ns2:planeAddressTo>
    <ns2:planeSeat>${newTransaction.planeSeat}</ns2:planeSeat>
  </ns2:UserInformationRq>
  <user_options>Purchase</user_options>
</ns1:start>
`;

  return fetch(BPM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      "Accept": "text/xml"
    },
    body: payloadPlane
  });
}

/* ================= TRANSACTION LOG ================= */
export function Transactionlog(newTransaction) {
  const payloadLog = `
<ns1:start xmlns:ns1="http://xmlns.oracle.com/bpmn/bpmnProcess/MainProccess"
           xmlns:ns2="http://www.permatabank.com/UserSystem">
  <Status_Code/>
  <ns2:TransactionLogDisplayRq>
    <ns2:UserAccID>${newTransaction.UserAccID}</ns2:UserAccID>
    <ns2:Email>${newTransaction.email}</ns2:Email>
  </ns2:TransactionLogDisplayRq>
  <user_options>Log_Display</user_options>
</ns1:start>
`;

  return fetch(BPM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      "Accept": "text/xml"
    },
    body: payloadLog
  });
}
