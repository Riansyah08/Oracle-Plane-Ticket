const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { DOMParser } = require("xmldom");

const fetchModule = require("./fetch");

const PlaneSearch =
  fetchModule.PlaneSearch ||
  fetchModule.default ||
  fetchModule;

const app = express();
const PORT = 3001;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET"],
  allowedHeaders: ["Content-Type"]
}));

/* ================= EXTRACT ALL LOG BLOCKS ================= */
function extractBlocks(log) {
  const lines = log.split("\n");

  const blocks = [];

  let current = null;

  for (const line of lines) {
    if (line.includes("[[PlaneSchedule]]")) {
      const timeMatch = line.match(
        /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})/
      );

      if (!timeMatch) continue;

      current = {
        time: new Date(timeMatch[1]),
        xml: ""
      };
    }

    if (current) {
      current.xml += line;

      if (line.includes("</xml-fragment>")) {
        blocks.push(current);
        current = null;
      }
    }
  }

  return blocks;
}

/* ================= GET LATEST ================= */
function getLatestXML(log) {
  const blocks = extractBlocks(log);

  if (blocks.length === 0) {
    console.log("❌ No parsed blocks found");
    return null;
  }

  let latest = blocks[0];

  for (const b of blocks) {
    if (b.time > latest.time) {
      latest = b;
    }
  }

  console.log("🕒 LATEST TIME:", latest.time.toISOString());

  const xmlMatch = latest.xml.match(
    /<xml-fragment[\s\S]*<\/xml-fragment>/
  );

  if (!xmlMatch) return null;

  return xmlMatch[0];
}

function cleanXML(xml) {
  return xml
    .replace(/^<xml-fragment[^>]*>/, "<PlaneLists>")
    .replace(/<\/xml-fragment>$/, "</PlaneLists>");
}

/* ================= XML PARSER ================= */
function parsePlaneXML(xmlString) {
  const xmlDoc = new DOMParser().parseFromString(xmlString, "text/xml");

  const nodes = xmlDoc.getElementsByTagName("*");
  const results = [];

  for (let i = 0; i < nodes.length; i++) {
    const name = nodes[i].localName || nodes[i].nodeName;

    if (name === "PlaneList") {
      const node = nodes[i];

      const get = (tag) => {
        const children = node.getElementsByTagName("*");

        for (let j = 0; j < children.length; j++) {
          const childName = children[j].localName || children[j].nodeName;

          if (childName === tag) {
            return children[j].textContent;
          }
        }
        return "";
      };

      results.push({
        plane_id: get("planeId"),
        planeName: get("planeName"),
        flightNumber: get("flightNumber"),
        planeAddressFrom: get("planeAddressFrom"),
        planeAddressTo: get("planeAddressTo"),
        planeschedule_departs: get("planeScheduleDeparts"),
        planeschedule_arrive: get("planeScheduleArrive"),
        total_seat: get("TotalSeat"),
        availability: get("Availability"),
        km: Number(get("KM") || 0),
        price: Number(get("Price") || 0)
      });
    }
  }

  return results;
}

/* ================= API ================= */
app.get("/api/planes", async (req, res) => {
  try {
    const log = fs.readFileSync(
      "D:/Oracle_14/Middleware/Oracle_Home/user_projects/domains/base_domain/transactionLog/osb_server1.esb.log",
      "utf-8"
    );

    console.log("LOG SIZE:", log.length);

    const xmlString = getLatestXML(log);

if (!xmlString) {
  console.log("⚠️ No log → SOAP fallback");
  const soapData = await PlaneSearch();
  return res.json(soapData);
}

const clean = cleanXML(xmlString);
const data = parsePlaneXML(clean);

console.log("✅ PARSED PLANES:", data.length);

if (data.length === 0) {
  console.log("⚠️ Empty → SOAP fallback");
  const soapData = await PlaneSearch();
  return res.json(soapData);
}

return res.json(data);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Failed to process planes" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running http://localhost:${PORT}`);
});