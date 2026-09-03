export const parseUTCDate = (value) => {
  if (value == null) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  let isoString = String(value).trim();
  if (!isoString) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    isoString = isoString + "T00:00:00Z";
  } else {
    isoString = isoString.replace(" ", "T");
    if (!/Z|[+-]\d{2}:\d{2}$/.test(isoString)) {
      isoString += "Z";
    }
  }

  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
};

export const formatForumDateTime = (value) => {
  const date = parseUTCDate(value);
  if (!date) return "Date inconnue";

  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatForumDate = (value) => {
  const date = parseUTCDate(value);
  if (!date) return "Date inconnue";

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const hasBeenEdited = (createdAt, updatedAt) => {
  const created = parseUTCDate(createdAt);
  const updated = parseUTCDate(updatedAt);
  if (!created || !updated) return false;

  return updated.getTime() > created.getTime();
};

export const EDIT_WINDOW_MS = 15 * 60 * 1000;

export const isEditableWithinWindow = (createdAt, nowTs = Date.now()) => {
  const createdDate = parseUTCDate(createdAt);
  if (!createdDate) return false;

  const diff = nowTs - createdDate.getTime();
  return diff >= 0 && diff < EDIT_WINDOW_MS;
};

export const isSameUser = (user, target) =>
  Boolean(
    user &&
      target &&
      ((user.id != null &&
        target.user_id != null &&
        String(user.id) === String(target.user_id)) ||
        (user.username &&
          target.author &&
          String(user.username).toLowerCase() ===
            String(target.author).toLowerCase())),
  );
