const { types } = require("pg");

const TIMESTAMP_OID = 1114;
const TIMESTAMPTZ_OID = 1184;
const DATE_OID = 1082;

const pad = (n) => String(n).padStart(2, "0");

const formatDateAsISOZ = (value) => {
  if (value == null) return value;

  if (typeof value === "string") {
    let s = value.replace(" ", "T");
    if (!/Z|[+-]\d{2}:\d{2}$/.test(s)) {
      s += "Z";
    }
    return s;
  }

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;
    return value.toISOString();
  }

  return value;
};

const parseTimestampAsString = (value) => {
  if (value == null) return null;
  return formatDateAsISOZ(value);
};

types.setTypeParser(TIMESTAMP_OID, (val) => {
  if (val == null) return null;
  return formatDateAsISOZ(val);
});

types.setTypeParser(TIMESTAMPTZ_OID, (val) => {
  if (val == null) return null;
  return formatDateAsISOZ(val);
});

types.setTypeParser(DATE_OID, (val) => {
  if (val == null) return null;
  return String(val);
});

const normalizeDates = (obj) => {
  if (obj == null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(normalizeDates);
  }

  if (typeof obj === "object") {
    if (obj instanceof Date) {
      return formatDateAsISOZ(obj);
    }

    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = normalizeDates(obj[key]);
    }
    return result;
  }

  return obj;
};

const normalizeResponseMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    try {
      const normalized = normalizeDates(body);
      return originalJson(normalized);
    } catch (e) {
      return originalJson(body);
    }
  };
  next();
};

module.exports = {
  formatDateAsISOZ,
  normalizeDates,
  normalizeResponseMiddleware,
};
